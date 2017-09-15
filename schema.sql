--part one 
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

--part three
ALTER TABLE `bamazon`.`products` 
ADD COLUMN `product_sales` DECIMAL(10,5) NULL AFTER `stock_quantity`;


CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100) NOT NULL,
	overhead_cost DECIMAL(10,5) NOT NULL default 0
);

SELECT d.department_id, d.department_name, SUM(d.overhead_cost), SUM(p.product_sales), (SUM(d.overhead_cost) - SUM(p.product_sales)) AS total_profit
FROM departments d
LEFT JOIN products p ON d.department_name = p.department_name
GROUP BY d.department_id, d.department_name;