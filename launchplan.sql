--part one
INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`) 
VALUES ("Pants", "Womens", 13, 9), 
("Sweatshirt", "Mens", 44, 3), 
("Headphones", "Electronics", 52, 20), 
("Earrings", "Jewelry", 6, 4), 
("Picture Frame", "Houseware", 12, 19),
("Cool T-Shirt", "Womens", 6, 10),
("Cupcakes", "Snacks", 5, 2),
("Fluffy Blanket", "Houseware", 20, 7),
("Potato", "Produce", 1, 100),
("Blender", "Kitchen", 90, 3)
LIMIT 10;

--part three
INSERT INTO departments (`department_name`, `overhead_cost`)
VALUES ("Womens", 1000),
("Mens", 1000),
("Electronics", 2300),
("Jewelry", 1340),
("Houseware", 900),
("Snacks", 400),
("Produce", 650),
("Kitchen",3400);