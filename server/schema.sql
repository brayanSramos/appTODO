CREATE DATABASE todo_t;
USE todo_t;
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE todo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE shared_todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES todo(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
);
---Llamar la tablas de la base de datos totdo_t
SHOW TABLES;
---Describe la tabla que les espesifiques
DESCRIBE shared_todos;
---Mostrar la taba users y todo
SELECT *
FROM users;
SELECT *
FROM todo;
---Mostrar los item de la tablas user y todo
SELECT *
FROM users
WHERE id = 1;
SELECT *
FROM todo
WHERE user_id = 1;
--- ? buscar 😊
SELECT todo.*,
    shared_todos.shared_with_id
FROM todo
    LEFT JOIN shared_todos ON todo.id = shared_todos.todo_id
WHERE todo.user_id = 2
    OR shared_todos.shared_with_id = 2;
--- Insertart datos en la tabla users
INSERT INTO users (name, email, password)
VALUES ('John Doe', 'john@example.com', 'password123'),
    ('Jane Smith', 'jane@example.com', 'password456');
--- Insertart datos en la tabla todo
INSERT INTO todo (title, user_id)
VALUES ('Buy groceries✔️', 1),
    ('Clean the house👾', 1),
    ('Call mom✒️', 1),
    ('Comer a la hora🏃🏽', 1),
    ('comprar comida💥', 1);
--- Insertart todo 1 de user 1 al user 1
INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
VALUES (1, 1, 2);