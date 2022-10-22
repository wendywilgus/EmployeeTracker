
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'MVUEdAMS02<0',
        database: 'tracker_db'
    },
);

function mainPrompt() {
    console.log("Welcome to your Employee Tracker.");
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"],
                name: "department",
            },
        ])
}

function viewDepartments
    select all of the departments from a table
function viewRoles
    select all of the roles from a table
function viewEmployees
    select all of the employees from a table  
function addDepartment ()   {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "department",
            }
        ])//then add to database
};
function addRole () {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's role?",
                name: "newrole",
            },
            {
                type: "input",
                message: "What is the employee's name?",
                name: "employee",
            },
            {
                type: "input",
                message: "What is the employee's salary?",
                name: "salary",

            },
            {
                type: "input",
                message: "What is the department for this role?",
                name: "department",
            }
        ]) //add to database
};
function addEmployee () {
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

