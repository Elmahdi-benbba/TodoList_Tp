
import React from "react";

export default function Task({ task, onToggle, onDelete }) {
    return (
        <div className={`task ${Number(task.done) === 1 ? "completed" : ""}`}>

            <div className="task-info">
                <button
                    className="check-btn"
                    onClick={() => onToggle(task.id)}
                >
                    {Number(task.done) === 1 ? "✓" : ""}
                </button>

                <span className="task-title">
                    {task.title}
                </span>
            </div>

            <div className="task-actions">
                <span className="status">
                    {Number(task.done) === 1 ? "Done" : "Pending"}
                </span>

                <button
                    className="delete-btn"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </button>
            </div>

        </div>
    );
}
