CREATE DATABASE IF NOT EXISTS devops_app;

USE devops_app;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL
);

INSERT INTO products (name, price)
VALUES
('Laptop', 55000),
('Mobile', 25000),
('Keyboard', 2000);