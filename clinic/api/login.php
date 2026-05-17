<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    
// Prepare and execute the SQL statement to check for the user
    $sql = "SELECT id, name, phone, email, role FROM users WHERE email = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    
    $stmt->bind_param("ss", $data->email, $data->password);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // If found, return its data to the frontend
        $user = $result->fetch_assoc();
        http_response_code(200);
        echo json_encode([
            "message" => "Login successful",
            "user" => $user
        ]);
    } else {
        // If not found, return an error message
        http_response_code(401);
        echo json_encode(["error" => "Incorrect Email or Password!"]);
    }
    
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Incomplete data."]);
}

$conn->close();
?>