
import React, { useState } from "react";

export default function AddTask({ onAdd }) {
    const [title, setTitle] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (title.trim() === "") return;

        onAdd(title.trim());
        setTitle("");
    }

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button type="submit">+ Add Task</button>
        </form>
    );
}
