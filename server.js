
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');
const util = require('util');
const { ADDRGETNETWORKPARAMS } = require("dns");
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.pw,
        database: 'tracker_db'
    },
);

const query = util.promisify(db.query).bind(db);

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
                    "Add a Department", 
                    "Add a Role", 
                    "Add an Employee", 
                    "Update an Employee Role"],
                name: "mainlist",
            },
        ])
}

function viewDepartments
    select all of the departments from a table
function viewRoles
    select all of the roles from a table

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
                    message: ""
                }
            ])
}
     

const addDepartment = () =>  {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "department",
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
        });
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
module.exports = mainPrompt;
