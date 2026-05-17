<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

// Get the raw POST data and decode it from JSON
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->message)) {
    // Sanitize the input data to prevent SQL injection
    $name = $conn->real_escape_string($data->name);
    $phone = $conn->real_escape_string($data->phone);
    $email = $conn->real_escape_string($data->email);
    $message = $conn->real_escape_string($data->message);

    $sql = "INSERT INTO messages (name, phone, email, message) VALUES ('$name', '$phone', '$email', '$message')";

    if($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Message sent successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to send message."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}

$conn->close();
?>