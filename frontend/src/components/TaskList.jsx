
import React from "react";
import Task from "./Task";

export default function TaskList({ tasks, onToggle, onDelete }) {
    if (tasks.length === 0) {
        return (
            <div className="empty">
                <h3>No tasks yet!</h3>
                <p>Add your first task to get started.</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
