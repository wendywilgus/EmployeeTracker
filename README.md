# Employee Tracker
Module 12 Assignment
## Overview

This application is a content management system (CMS) that allows managers to view and update a company's employee database.  The project was built using Node.js, Inquirer, and MySQL.

## Table of Contents

- [Story](#user-story)
- [Mockup](#mockup) 
- [Installation](#installation)
- [License](#license)
- [Resources](#resources)

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Mock-Up

The following video shows an example of the application being used from the command line:

[![A video thumbnail shows the command-line employee management application with a play button overlaying the view.]

## Installation

In order to use the application you will need to instal the required npm packages listed in the package.json. You will also need to create a database following the architecture of the schema.sql. Finally you will need to include a .env file that contains your MySQL password.

## License
This project was completed as part of Georgia Tech's Full Stack Development Boot Camp course. 
---
© 2022 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.


## Resources
The following resources were helpful in researching best practices and problem-solving on the project.
* [ExpressJs](https://expressjs.com/en/guide/routing.html)
* [Routing](https://expressjs.com/en/guide/routing.html)
* [Switch/Case Method](https://www.w3schools.com/js/js_switch.asp)
* [Inquirer package](https://www.npmjs.com/package/inquirer/v/8.2.4)


