DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(7, 0) NOT NULL.
    department_id INT.
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL

);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT  (associate with role/id)
    manager_id: INTEGER (associate with employee/id)
    FOREIGN Key (manager_id)
    REFERENCES employee_id
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);

SOURCE db/seeds.sql;

    

 
