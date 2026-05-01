// (Using Node.js and MySQL) generate queries that perform the following tasks (8 Grades):
const mysql = require("mysql2");
require("dotenv").config({
  path: "./.env.local",
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

connection.connect((error) => {
  if (error) {
    console.log(`Error while connecting to DB: ${error}`);
  }
  console.log("Connected to DB successfully");
});

const executionCallback = (error, result, name) => {
  console.log("##Execute: ", name);
  if (error) {
    console.log("Error While Executing Query", error);
  }
  console.log("result: ", result);
};

// --- DROP TABLES IF EXISTS AND USERS IN CASE OF LOOPING AGAIN ---
connection.execute("DROP TABLE IF EXISTS SALES, PRODUCTS, SUPPLIERS;", [], (error, result) =>
  executionCallback(error, result, "Drop Tables"),
);
connection.execute("DROP USER 'store_manager'@'localhost';", [], (error, result) =>
  executionCallback(error, result, "Drop 'store_manager' User;"),
);

// 1- Create the required tables for the retail store database based on the tables structure and relationships. (0.5 Grade)

// -- SUPPLIERS TABLE
connection.execute(
  "CREATE TABLE IF NOT EXISTS SUPPLIERS (SupplierID INT (11) PRIMARY KEY AUTO_INCREMENT, SupplierName VARCHAR(255) NOT NULL, ContactNumber VARCHAR(255) NOT NULL, CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, DeletedAt TIMESTAMP NULL DEFAULT NULL);",
  [],
  (error, result) => executionCallback(error, result, "1.1- Create Suppliers Table"),
);

// -- PRODUCTS TABLE
connection.execute(
  "CREATE TABLE IF NOT EXISTS PRODUCTS (ProductID INT (11) PRIMARY KEY AUTO_INCREMENT, ProductName VARCHAR(255), Price DECIMAL(10, 2) NOT NULL, StockQuantity INT (11) DEFAULT 0, SupplierID INT (11) NOT NULL, FOREIGN KEY (SupplierID) REFERENCES SUPPLIERS (SupplierID) ON DELETE CASCADE ON UPDATE CASCADE, CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, DeletedAt TIMESTAMP NULL DEFAULT NULL);",
  [],
  (error, result) => executionCallback(error, result, "1.2- Create Products Table"),
);

// -- SALES TABLE
connection.execute(
  "CREATE TABLE IF NOT EXISTS SALES (SaleID INT (11) PRIMARY KEY AUTO_INCREMENT, ProductID INT (11) NOT NULL, QuantitySold INT (11) NOT NULL DEFAULT 0, SaleDate DATE, FOREIGN KEY (ProductID) REFERENCES PRODUCTS (ProductID) ON DELETE CASCADE ON UPDATE CASCADE, CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, DeletedAt TIMESTAMP NULL DEFAULT NULL);",
  [],
  (error, result) => executionCallback(error, result, "1.3- Create Sales Table"),
);

// 2- Add a column “Category” to the Products table. (0.5 Grade)
connection.execute(
  "ALTER TABLE PRODUCTS ADD Category VARCHAR(255) NOT NULL;",
  [],
  (error, result) =>
    executionCallback(error, result, "2- Add a column “Category” to the Products table"),
);

// 3- Remove the “Category” column from Products. (0.5 Grade)
connection.execute("ALTER TABLE PRODUCTS DROP Category;", [], (error, result) =>
  executionCallback(error, result, "3- Remove the “Category” column from Products"),
);

// 4- Change “ContactNumber” column in Suppliers to VARCHAR (15). (0.5 Grade)
connection.execute("ALTER TABLE SUPPLIERS MODIFY ContactNumber VARCHAR(15);", [], (error, result) =>
  executionCallback(error, result, "4- Change “ContactNumber” column in Suppliers to VARCHAR (15)"),
);

// 5- Add a NOT NULL constraint to ProductName!!. (0.5 Grade)
connection.execute(
  "ALTER TABLE PRODUCTS MODIFY ProductName VARCHAR(225) NOT NULL;",
  [],
  (error, result) =>
    executionCallback(error, result, "5- Add a NOT NULL constraint to ProductName"),
);

// 6- Perform Basic Inserts: (0.5 Grade)
// a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
connection.execute(
  "INSERT INTO SUPPLIERS (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567')",
  [],
  (error, result) =>
    executionCallback(
      error,
      result,
      "6.a- Add a supplier with the name 'FreshFoods' and contact number '01001234567'",
    ),
);

// b. Insert the following three products, all provided by 'FreshFoods':
// i. 'Milk' with a price of 15.00 and stock quantity of 50.
// ii. 'Bread' with a price of 10.00 and stock quantity of 30.
// iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
connection.execute(
  "INSERT INTO PRODUCTS (ProductName, Price, StockQuantity, SupplierID) VALUES ('Milk', 15.00, 50, 1), ('Bread', 10.00, 30, 1), ('Eggs', 20.00, 40, 1)",
  [],
  (error, result) => executionCallback(error, result, "6.b- Insert the three products"),
);

// c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
connection.execute(
  "INSERT INTO SALES (ProductID, QuantitySold, SaleDate) VALUES (1, 2, '2025-05-20');",
  [],
  (error, result) =>
    executionCallback(
      error,
      result,
      "6.c- Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'",
    ),
);

// 7- Update the price of 'Bread' to 25.00. (0.5 Grade)
connection.execute("UPDATE PRODUCTS SET Price = 25.00 WHERE ProductID = 2", [], (error, result) =>
  executionCallback(error, result, "7- Update the price of 'Bread' to 25.00"),
);

// 8- Delete the product 'Eggs'. (0.5 Grade)
connection.execute("DELETE FROM PRODUCTS WHERE ProductID = 3;", [], (error, result) =>
  executionCallback(error, result, "8- Delete the product 'Eggs'"),
);

// 9- Retrieve the total quantity sold for each product. (0.5 Grade)
connection.execute(
  "SELECT PRODUCTS.ProductID, ProductName, COALESCE(SUM(QuantitySold), 0) AS TotalQuantitySold FROM PRODUCTS LEFT JOIN SALES ON PRODUCTS.ProductID = SALES.ProductID GROUP BY ProductID;",
  [],
  (error, result) =>
    executionCallback(error, result, "9- Retrieve the total quantity sold for each product"),
);

// 10- Get the product with the highest stock. (0.5 Grade)
connection.execute(
  "SELECT ProductID, ProductName, StockQuantity FROM PRODUCTS ORDER BY StockQuantity DESC LIMIT 1;",
  [],
  (error, result) => executionCallback(error, result, "10- Get the product with the highest stock"),
);

// 11- Find suppliers with names starting with 'F'. (0.5 Grade)
connection.execute(
  "SELECT SupplierID, SupplierName FROM SUPPLIERS WHERE SupplierName LIKE 'f%';",
  [],
  (error, result) =>
    executionCallback(error, result, "11- Find suppliers with names starting with 'F'"),
);

// 12- Show all products that have never been sold. (0.5 Grade)
connection.execute(
  "SELECT PRODUCTS.ProductID, ProductName, StockQuantity, QuantitySold FROM PRODUCTS LEFT JOIN SALES ON PRODUCTS.ProductID = SALES.ProductID WHERE SALES.QuantitySold IS NULL;",
  [],
  (error, result) =>
    executionCallback(error, result, "12- Show all products that have never been sold"),
);

// 13- Get all sales along with product name and sale date. (0.5 Grade)
connection.execute(
  "SELECT PRODUCTS.ProductID, ProductName, QuantitySold, SaleDate FROM PRODUCTS JOIN SALES ON SALES.ProductID - PRODUCTS.ProductID",
  [],
  (error, result) =>
    executionCallback(error, result, "13- Get all sales along with product name and sale date"),
);

// 14- Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables. (0.5 Grade)
connection.execute(
  "CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'root';",
  [],
  (error, result) => executionCallback(error, result, "14.1- Create a user “store_manager”"),
);
connection.execute(
  "GRANT SELECT, INSERT, UPDATE ON retail_db.* TO 'store_manager'@'localhost';",
  [],
  (error, result) =>
    executionCallback(
      error,
      result,
      "14.2- give them SELECT, INSERT, and UPDATE permissions on all tables",
    ),
);

// 15- Revoke UPDATE permission from “store_manager”. (0.5 Grade)
connection.execute(
  "REVOKE SELECT, INSERT, UPDATE ON retail_db.* FROM 'store_manager'@'localhost'",
  [],
  (error, result) =>
    executionCallback(error, result, "15- Revoke UPDATE permission from “store_manager”"),
);

// 16- Grant DELETE permission to “store_manager” only on the Sales table. (0.5 Grade)
connection.execute(
  "GRANT DELETE ON retail_db.SALES TO 'store_manager'@'localhost';",
  [],
  (error, result) =>
    executionCallback(
      error,
      result,
      "16- Grant DELETE permission to “store_manager” only on the Sales table",
    ),
);
