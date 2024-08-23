import express from 'express';
import {
    getTodo,
    shareTodo,
    deleteTodo,
    getTodosByID,
    createTodo,
    toggleCompleted,
    getUserByEmail,
    getUserByID,
    getSharedTodoByID,
} from "./database.js";
import cors from 'cors';

const corsOptions = {
    origin: "http://localhost:3000", 
    merhods: ["GET", "POST", "PUT", "DELETE"], 
    Credentials: true, 
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions)); 

app.get("/todo/:id", async (req, res) => {
    const todo = await getTodosByID(req.params.id);
    res.status(200).send(todo);
});

app.get("/todo/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoByID(req.params.id);
    const author = await getUserByID(todo.user_id);
    const shared_with = await getUserByID(todo.shared_with_id);
    res.status(200).send({ author, shared_with });
});

app.get("/users/:id", async (req, res) => {
    const user = await getUserByID(req.params.id);
    res.status(200).send(user);
});

app.put("/todo/:id", async (req, res) => {
    const { value } = req.body;
    const todo = await toggleCompleted(req.params.id, value);
    res.status(200).send(todo);
});

app.delete("/todo/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.send({ message: "Todo deleted successfully" });
});

app.post("/todo/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body;
    // const { todo_id, user_id, shared_with_id } = req.body;
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
});

app.post("/todo", async (req, res) => {
    const { user_id, title } = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
});


app.listen(8080, () => {
    console.log("Por el port 8080");
});