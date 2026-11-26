
const API_URL = "http://localhost/TodoList_Tp/backend/api/tasks.php";

export async function getTasks() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Erreur lors du chargement");
    }

    return await response.json();
}

export async function addTask(title) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout");
    }

    return data.task;
}

export async function deleteTask(id) {
    const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
    }

    return data;
}

export async function toggleTask(id) {
    const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur lors du changement");
    }

    return data.task;
}
