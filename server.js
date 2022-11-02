const mysql = require("mysql2");
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');
const express = require('express');
const app = express();


require('dotenv').config()

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extend: false }));
app.use(express.json());

app.use((req, res) => res.status(404).end());
app.listen(PORT);

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
    },
);

//constant to allow async/await
const query = util.promisify(db.query).bind(db);

//Main prompt for starting questios
const mainPrompt = () => {
    console.log("Welcome to your Employee Tracker.");
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View All Departments", 
                    "View All Roles", 
                    "View All Employees", 
                    "View By Manager",
                    "Add a Department", 
                    "Add a Role", 
                    "Add an Employee", 
                    "Update an Employee Role",
                    "Update Employee Manager",
                    "Quit"],
                name: "mainlist",
            }
        ])
        .then((answer) => {
            //switch path based on user choice from list
            switch(answer.mainlist){
                case "Quit":
                    console.log('Exit');
                    break;
                case "View All Departments":
                    db.query(`SELECT * FROM department ORDER BY department.name ASC`, function (err, results) {
                        console.table(`/n`, results);
                        mainPrompt();
                    });
                    break;
                case "View All Roles":
                    db.query(`SELECT role.title, role.id, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.title ASC`, function (err, results)    {
                        console.table(`/n`, results);
                        mainPrompt();
                    });
                    break;
                case "View All Employees":
                    db.query(`SELECT a.id, a.first_name, a.last_name, role.title, department.name AS department, role.salary, CONCAT(b.first_name, " ", b.last_name) AS manager FROM employee a INNER JOIN role ON a.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee b ON b.id = a.manager_id ORDER BY a.last_name ASC`, function (err, results){
                        console.table(`/n`, results);
                        mainPrompt();
                    });
                    break;
                case "View By Manager":
                    viewEmployeesbyManager();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Update an Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":
                    updateManager();
                    break;     
                default: console.log("error not found", answer);        
            };
        })
};

async function viewEmployeesbyManager(){
    const employees = [];
    const employeesEntry = [];

    await query(`SELECT id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee`)
        .then(res => {
            res.forEach(employee => {
                employees.push(employee.name)
                employeesEntry.push(employee);
            });
        });
    
        inquirer    
            .prompt([
                {
                    type: "list",
                    message: "Whose team would you like to view?",
                    name: "managers",
                    choices: employees
                }
            ])
            .then(async ans => {
                let manager_id;
                employeesEntry.forEach(employee => {
                    if(employee.name === ans.managers){
                        manager_id = employee.id;
                    }
                });

                await query(`SELECT * FROM employee WHERE manager_id = ?`, manager_id)
                    .then(res => console.table(`/n`, res));
                
                mainPrompt();                
            });
};
     

const addDepartment = () =>  {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "name",
                validate: (input) => {
                    if (input.trim() === "") {
                        return false;
                    }
                    return true;
                }
            }
        ])//then add to database
        .then(ans => {
            db.query(`INSERT INTO department (name) VALUES (?)`, ans.name, function (err, results) {
                mainPrompt();
            });
        })
};

//add a role to Role table
async function addRole()  {
    //array for department names created by user
    const departments = [];

    const departmentEntry = [];
    await query(`SELECT id, name FROM department`).then(res => {
        res.forEach(department => {
            departments.push(department.name)
            departmentEntry.push(department);
        });
    });
    inquirer
        .prompt([
            {
                type: "list",
                message: "What is the department for this role?",
                name: "department",
                choices: departments,
            },
            {
                type: "input",
                message: "What is the employee's role?",
                name: "title",
                validate: (input) => {
                    if (input.trim() === ""){
                        return false;
                    }
                    return true;
                }
            },
            {
                type: "input",
                message: "What is the employee's salary?",
                name: "salary",
                validate: (input) => {
                    if (isNaN(input)){
                        return "Please enter a number for the salary."
                    }
                    return true;
                }
            },
            
        ]) //add to database
        .then(async ans => {
            let department_id;
            departmentEntry.forEach(department => {
                if(department.name === ans.department){
                    department_id = parseInt(department.id);
                }
            });
            let salary = parseInt(ans.salary);
            await query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [ans.title, salary, department_id]
                .then(res => console.log(`Added ${ans.title} to roles.`)));
            mainPrompt();
        });
};

//function to add a new employee to Employee table
async function addEmployee() {
    const rolesArray = [];
    const rolesEntry = [];
    const employees = ['None'];
    const employeesEntry = [];

    await query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`)
        .then(res => {
            res.forEach(employee => {
                employees.push(employee.name)
                employeesEntry.push(employee);
        });
    });
    await query(`SELECT id, title FROM role`)
        .then(res => {
            res.forEach(role => {
                rolesArray.push(role.title)
                rolesEntry.push(role);
            });
        });
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "first_name",
                validate: (input) => {
                    if(input === ""){
                        return "Please enter a name for the employee."
                    }
                    return true;
                }
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastname",
                validate: (input) => {
                    if(input === ""){
                        return "Please enter a name for the employee."
                    }
                    return true;
                }
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: rolesArray,
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: employees,
            },
        ])//add to database
        .then(async ans => {
            const {first_name, last_name, roles, manager} = ans;
            let role_id;
            rolesEntry.forEach(role => {
                if(role.title === roles){
                    role_id = parseInt(role.id);
                }
            })
            let manager_id;
            employeesEntry.forEach(employee => {
                if(employee.name === manager){
                    manager_id = parseInt(employee.id);
                }
            });
            await query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [first_name, last_name, role_id, manager_id])
            .then(res => console.log(`Added ${first_name} ${last_name} to database.`));
            
            mainPrompt();
        });
};

//function to update employee role
async function updateRole()  {
    const employList = [];
    const employeesEntry = [];
    const rolesList = [];
    const rolesEntry = [];
    await query(`SELECT id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee`)
        .then(res => res.forEach(person => {
            employeesEntry.push(person);
            employList.push(person.name)
        }));

    await query(`SELECT title, id FROM role`)
        .then(res => res.forEach(role => {
            rolesEntry.push(role);
        }));

    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee would you like to update?",
                choices: employeeList,
                name: "employee"
            },
            {
                type: "list",
                message: "What will the new role be for this employee?",
                choices: rolesList,
                name: "newrole",
            },
        ])//update role in employee db
        .then(async ans => {
            let employee_id;
            let role_id;
            employeesEntry.forEach(person => {
                if(person.name === ans.person){
                    employee_id = parseInt(person.id);
                }
            })
        
            await query(`UPDATE employee SET role_id = ? WHERE id = ?`, [role_id, employee_id])
                .then(ans => console.log(`Role for ${ans.person} has been updated.`));

            mainPrompt();
        });
};

//function to update Employee's manager
async function updateManager() {
    const employees = [];
    const employeesEntry = [];

    await query(`SELECT id, CONCAT(employee.first_name, " ", employee.last_name,) AS name FROM employee`)
        .then(res => {
            res.forEach(person => {
                employees.push(person.name);
                employeesEntry.push(person);
            });
        });
    
    inquirer    
        .prompt([
            {
                type: "list",
                message: "Which employee's manager would you like to update?",
                choices: employees,
                name: "employee",
            },
            {
                type: "list",
                message: "Who will the new manager be? Select same employee if there is no manager.",
                choices: employees,
            }
        ])
        .then( async ans => {
            let manager_id;
            let employee_id;
            employeesEntry.forEach(person => {
                if (ans.employee == ans.newManager){
                    manager_id = null;
                }else{
                    if(person.name === ans.newManager){
                        manager_id = parseInt(person.id);
                    }
                }

                if(ans.employee === person.name){
                    employee_id = person.id;
                }
            });

            await query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [manager_id, employee_id])
                .then(ans => 
                    console.log(`Manager for ${ans.employee} has been updated.`))

            mainPrompt();
        });
}
mainPrompt();
module.exports = mainPrompt;
