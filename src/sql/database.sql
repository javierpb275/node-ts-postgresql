CREATE DATABASE task_app;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL
);

CREATE TABLE tasks(
    task_id SERIAL PRIMARY KEY,
    task_description TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    user_id SERIAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users 
    (username, user_email, user_password) 
    VALUES ('john', 'john@gmail.com', 'Abc123..'), 
    ('mery', 'mery@gmail.com', 'Abc123..')

INSERT INTO tasks 
    (task_description, user_id) 
    VALUES ('Wash the dishes', 1), 
    ('Sweep the floor', 2)

