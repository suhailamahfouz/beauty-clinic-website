<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (!empty($data->id) && !empty($data->role)) {
    // 🛡️ Security Layer (Prepared Statements):
// Prevents SQL Injection by separating SQL code
// from user-provided data
    $sql = "UPDATE users SET role = ? WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    // Bind the parameters to the SQL query (s = string, i = integer)
    $stmt->bind_param("si", $data->role, $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Role updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update role."]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}

$conn->close();
?>