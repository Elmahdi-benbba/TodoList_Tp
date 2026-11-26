
<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once "../config/database.php";

function response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

try {

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET") {

        $sql = "SELECT * FROM todo ORDER BY created_at DESC";

        $stmt = $pdo->query($sql);

        $tasks = $stmt->fetchAll();

        response($tasks);
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        response(["error" => "Invalid JSON data"], 400);
    }

    if ($method === "POST") {

        $title = trim($data["title"] ?? "");

        if ($title === "") {
            response(["error" => "Title is required"], 400);
        }

        $sql = "INSERT INTO todo (title) VALUES (?)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$title]);

        $id = $pdo->lastInsertId();

        $stmt = $pdo->prepare("SELECT * FROM todo WHERE id = ?");

        $stmt->execute([$id]);

        $task = $stmt->fetch();

        response([
            "message" => "Task added successfully",
            "task" => $task
        ], 201);
    }

    if ($method === "DELETE") {

        $id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            response(["error" => "Valid task ID is required"], 400);
        }

        $sql = "DELETE FROM todo WHERE id = ?";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            response(["error" => "Task not found"], 404);
        }

        response(["message" => "Task deleted successfully"]);
    }

    if ($method === "PATCH") {

        $id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            response(["error" => "Valid task ID is required"], 400);
        }

        $sql = "UPDATE todo
                SET done = IF(done = 1, 0, 1)
                WHERE id = ?";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {

            $check = $pdo->prepare("SELECT id FROM todo WHERE id = ?");

            $check->execute([$id]);

            if (!$check->fetch()) {
                response(["error" => "Task not found"], 404);
            }
        }

        $stmt = $pdo->prepare("SELECT * FROM todo WHERE id = ?");

        $stmt->execute([$id]);

        response([
            "message" => "Task status updated successfully",
            "task" => $stmt->fetch()
        ]);
    }

    response(["error" => "Method not allowed"], 405);

} catch (PDOException $e) {

    response([
        "error" => "Database error"
    ], 500);

} catch (Throwable $e) {

    response([
        "error" => "Server error"
    ], 500);

}
