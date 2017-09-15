var consoleTable = require('console.table');
var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    getSupervisorInput();
});

var getSupervisorInput = function() {
    inquirer.prompt([{
        type: "list",
        name: "supervisorAction",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"]
    }]).then(function(response) {
        if (response.supervisorAction === "View Product Sales by Department") {
            viewSales();
        } else if (response.supervisorAction === "Create New Department") {
            createNewDepartment();
        }
    });
}

var viewSales = function() {
    connection.query("SELECT d.department_id, d.department_name, d.overhead_cost, SUM(p.product_sales) as total_product_sales, (SUM(p.product_sales) - d.overhead_cost) AS total_profit FROM departments d LEFT JOIN products p ON d.department_name = p.department_name GROUP BY d.department_id, d.department_name, d.overhead_cost;", function(err, res) {
        console.table(res);
    });
    connection.end();
}

var createNewDepartment = function() {
	inquirer.prompt([
	{
		name: "newDeptName",
		message: "What is the name of the new department?"
	},
	{
		name: "newOverheadCost",
		message: "What is the overhead cost of the new department?"
	}
	]).then(function(response){
    connection.query("INSERT INTO departments SET ?", 
    	{ department_name: response.newDeptName, 
    		overhead_cost: response.newOverheadCost }, 
    	function(err, res) {
        if (err) throw err;
        console.log("New department has been added!");
    });
    connection.end();
	});

}