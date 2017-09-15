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
    getProducts();
});

function getProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("Here are the available products:");
        console.log("--------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id);
            console.log("Name: " + res[i].product_name);
            console.log("Price: $" + res[i].price);
            console.log("********************************")

        }
        getCustomerProductChoice();
    });
}


var getCustomerProductChoice = function() {
    inquirer.prompt([{
            name: "chosen_product_id",
            message: "What is the ID of the product you would like to purchase?"
        },
        {
            name: "chosen_product_quantity",
            message: "How many would you like to purchase?"
        }
    ]).then(function(answer) {
        chosenID = parseInt(answer.chosen_product_id);
        chosenQuantity = parseInt(answer.chosen_product_quantity);
        checkInventory(chosenID, chosenQuantity);
    });
}

var checkInventory = function(productID, productQuantityNeeded) {
    connection.query("SELECT * FROM products WHERE ?", { item_id: productID }, function(err, res) {
        currentInventory = res[0].stock_quantity
        if (productQuantityNeeded > currentInventory) {
            console.log("Insufficient stock! (Current inventory: " + currentInventory + ")");
            connection.end();
        } else {
            orderTotal = res[0].price * productQuantityNeeded;
            newStockQuantity = currentInventory - productQuantityNeeded;
            totalSales = res[0].product_sales;
            totalSales += orderTotal;
            updateProduct(productID, newStockQuantity, totalSales);
            console.log("Your total is $" + orderTotal);
        }
    });
}

var updateProduct = function(productID, newInventory, totalSales) {
    connection.query("UPDATE products SET ?  WHERE ?", [{ stock_quantity: newInventory, product_sales: totalSales }, { item_id: productID }], function(err, res) {
        if (err) throw err;
        connection.end();
    });
}
