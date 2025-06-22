USE ynov_ci;
CREATE TABLE user
(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    surname VARCHAR(100),
    name VARCHAR(100),
    email VARCHAR(255),
    birthdate DATE,
    city VARCHAR(255),
    postal_code VARCHAR(5)
);