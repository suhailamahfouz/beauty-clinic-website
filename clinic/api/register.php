<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    
    // 1. Check if this email is already registered
    $check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_email->bind_param("s", $data->email);
    $check_email->execute();
    $result = $check_email->get_result();
    
    if($result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(["error" => "Email already exists!"]);
    } else {
        // 2. If not, insert the new user into the database
        $sql = "INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        
        // Bind the parameters to the SQL query
        $stmt->bind_param("ssss", $data->name, $data->phone, $data->email, $data->password);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Account created successfully!"]);
        } else {
            http_response_code(503);
            echo json_encode(["error" => "Unable to create account."]);
        }
        $stmt->close();
    }
    $check_email->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Incomplete data."]);
}

$conn->close();
?>