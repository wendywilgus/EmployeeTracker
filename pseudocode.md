Three Tables

Department
    Id: INTEGER (associate with role/department_id)
    name: VARCHAR(30)


Role
    id: INTEGER (associate with employee/role_id*)
    title: VARCHAR(30)
    salary: DECIMAL
    department_id: INTEGER (associate with Department/id*)

Employee
    id: INTEGER (associate with employee/manager_id)
    first_name: VARCHAR(30)
    last_name: VARCHAR(30)
    role_id: INTEGER (associate with role/id)
    manager_id: INTEGER (associate with employee/id)