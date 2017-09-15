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
            addNewProduct();
        }
    });
}

var viewProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
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
    connection.end();
}


var viewLowInventory = function() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.log("Here are the products with low stock:");
        console.log("--------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("\x1b[37m", "Product ID: " + res[i].item_id);
            console.log("\x1b[37m", "Name: " + res[i].product_name);
            console.log("\x1b[37m", "Price: $" + res[i].price);
            console.log("\x1b[37m", "Department: " + res[i].department_name);
            console.log("\x1b[31m", "Quantity: " + res[i].stock_quantity);
            console.log("\x1b[37m", "********************************")

        }
    });
    connection.end();

}


var addInventory = function() {
    connection.query("SELECT product_name, stock_quantity FROM products", function(err, res) {
        arrayOfProducts = [];

        for (var i = 0; i < res.length; i++) {
            arrayOfProducts.push(res[i].product_name);
        }

        inquirer.prompt([{
                type: "list",
                name: "chooseProduct",
                message: "Which product would you like to add inventory for?",
                choices: arrayOfProducts
            },
            {
                name: "additionalInventoryAmount",
                message: "How many would you like to add to the inventory?"
            }
        ]).then(function(response) {
            additionalInventory = parseInt(response.additionalInventoryAmount);
            productToUpdate = response.chooseProduct;
            connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", [productToUpdate], function(err, res) {
                if (err) throw err;
                oldInventory = res[0].stock_quantity;
                newInventory = oldInventory + additionalInventory;
                updateInvetory(newInventory);
            });

        });
    });


}

var addNewProduct = function() {
    inquirer.prompt([{
            name: "newProductName",
            message: "What is the name of the product?",
        },
        {
            name: "newProductDepartment",
            message: "In what department will the product be located?",
        },
        {
            name: "newProductPrice",
            message: "How much does it cost? ($)"
        },
        {
            name: "newProductStock",
            message: "How many are currently in stock?"
        },
    ]).then(function(response) {
        connection.query("INSERT INTO products SET ?", {
                product_name: response.newProductName,
                department_name: response.newProductDepartment,
                price: parseInt(response.newProductPrice),
                stock_quantity: parseInt(response.newProductStock),
                product_sales: 0
            },
            function(err, res) {
                if (err) throw err;
                console.log("New product was added!");
                connection.end();

            });
    });

}

var updateInvetory = function(updatedInventoryNumber) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE product_name = ?", [newInventory, productToUpdate], function(err, res) {
        if (err) throw err;
        console.log("Inventory has been updated to " + newInventory);

    });
    connection.end();

}