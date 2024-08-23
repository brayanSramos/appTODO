import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
.createPool({
host: process.env.MYSQL_HOST,
user: process.env.MYSQL_USER,
password: process.env.MYSQL_PASSWORD,
database: process.env.MYSQL_DATABASE,
})
.promise();

export async function getTodosByID(id) {
  const [rows] = await pool.query(
    `
    SELECT todo.*, shared_todos.shared_with_id
    FROM todo
    LEFT JOIN shared_todos ON todo.id = shared_todos.todo_id
    WHERE todo.user_id = ? OR shared_todos.shared_with_id = ?
  `,
    [id, id]
  );
  return rows;
}

export async function getTodo(id) {
  const [rows] = await pool.query(`SELECT * FROM todo WHERE id = ?`, [id]);
  return rows[0];
}

export async function getSharedTodoByID(id) {
  const [rows] = await pool.query(
    `SELECT * FROM shared_todos WHERE todo_id = ?`,
    [id]
  );
  return rows[0];
}

export async function getUserByID(id) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  // console.log(rows[0]);
  return rows[0];
}

export async function createTodo(user_id, title) {
  const [result] = await pool.query(
    `
    INSERT INTO todo (user_id, title)
    VALUES (?, ?)
  `,
    [user_id, title]
  );
  const todoID = result.insertId;
  return getTodo(todoID);
}

export async function deleteTodo(id) {
  const [result] = await pool.query(
    `
    DELETE FROM todo WHERE id = ?;
    `,
    [id]
  );
  return result;
}

export async function toggleCompleted(id, value) {
  const newValue = value === true ? "TRUE" : "FALSE";
  const [result] = await pool.query(
    `
    UPDATE todo
    SET completed = ${newValue} 
    WHERE id = ?;
    `,
    [id]
  );
  return result;
}

export async function shareTodo(todo_id, user_id, shared_with_id) {
  const [result] = await pool.query(
    `
    INSERT INTO shared_todos (todo_id, user_id, shared_with_id) 
    VALUES (?, ?, ?);
    `,
    [todo_id, user_id, shared_with_id]
  );
  return result.insertId;
}
/**
 * Tests for development
 */
// console.log(await createTodo("test", "test"));

// const todos = await getTodos();
// console.log(todos);

// const todoByID = await getTodo(2);
// console.log(todoByID);

// await deleteTodo(2);

// await shareTodo(13, 2, 1);
