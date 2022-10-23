
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
function viewEmployees
    select all of the employees from a table  

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
async function addEmployee () {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstname",
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastname",
            },
            {
                type: "input",
                message: "What is the employee's role?",
                name: "role",
            },
            {
                type: "input",
                message: "Who is the employee's manager?",
                name: "manager",
            },
        ])//add to database
};

function updateRole ()  {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What will the new role be for this employee?",
                name: "newrole",
            },
        ])//update role in employee db
};

