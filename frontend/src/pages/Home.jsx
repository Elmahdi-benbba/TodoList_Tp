
import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";

import {
    getTasks,
    addTask,
    deleteTask,
    toggleTask
} from "../services/api";

export default function Home() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

    async function handleAdd(title) {
        try {
            setError("");

            const newTask = await addTask(title);

            setTasks((prevTasks) => [
                newTask,
                ...prevTasks
            ]);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete(id) {
        try {
            setError("");

            await deleteTask(id);

            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleToggle(id) {
        try {
            setError("");

            const updatedTask = await toggleTask(id);

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === updatedTask.id
                        ? updatedTask
                        : task
                )
            );
        } catch (err) {
            setError(err.message);
        }
    }

    const completedTasks = tasks.filter(
        (task) => Number(task.done) === 1
    ).length;

    const pendingTasks = tasks.length - completedTasks;

    return (
        <>
            <Navbar />

            <main className="container">
                <section className="stats">

                    <div className="stat-card">
                        <h3>{tasks.length}</h3>
                        <p>Total Tasks</p>
                    </div>

                    <div className="stat-card">
                        <h3>{completedTasks}</h3>
                        <p>Completed</p>
                    </div>

                    <div className="stat-card">
                        <h3>{pendingTasks}</h3>
                        <p>Pending</p>
                    </div>

                </section>

                <section className="content">

                    <h2>Add New Task</h2>

                    <AddTask onAdd={handleAdd} />

                    <div className="list-header">
                        <h2>My Task List</h2>
                        <span>{tasks.length} Tasks</span>
                    </div>

                    {error && (
                        <p className="error">{error}</p>
                    )}

                    {loading ? (
                        <p className="loading">Loading tasks...</p>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    )}

                </section>

            </main>
        </>
    );
}
