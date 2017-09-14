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
    getManagerInput();
});

var getManagerInput = function() {
    inquirer.prompt([{
        type: "list",
        name: "managerAction",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function(response) {
        if (response.managerAction === "View Products for Sale") {
            viewProducts();
        } else if (response.managerAction === "View Low Inventory") {
            viewLowInventory();
        } else if (response.managerAction === "Add to Inventory") {
            addInventory();
        } else if (response.managerAction === "Add New Product") {
            addProduct();
        }
    });
}

var viewProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("Here are the available products:");
        console.log("--------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id);
            console.log("Name: " + res[i].product_name);
            console.log("Price: $" + res[i].price);
            console.log("Quantity: " + res[i].stock_quantity);
            console.log("********************************")

        }
    });
}


var viewLowInventory = function() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        console.log("Here are the products with low stock:");
        console.log("--------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("\x1b[37m", "Product ID: " + res[i].item_id);
            console.log("\x1b[37m", "Name: " + res[i].product_name);
            console.log("\x1b[37m", "Price: $" + res[i].price);
            console.log("\x1b[31m", "Quantity: " + res[i].stock_quantity);
            console.log("\x1b[37m", "********************************")

        }
    });
}