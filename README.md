CREATE DATABASE IF NOT EXISTS bookstore;

USE bookstore;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
author VARCHAR(255) NOT NULL,
description TEXT,
publish_year INT
);

INSERT INTO books (title, author, description, publish_year) VALUES
('To Kill a Mockingbird', 'Harper Lee', 'A novel about racial injustice and the loss of innocence in the American South', 1960),
('1984', 'George Orwell', 'A dystopian novel set in a totalitarian society', 1949),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners set in Georgian England', 1813);
