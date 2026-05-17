<?php
// Allow the website to communicate with the server (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Include the database connection file
require_once 'db_connect.php';

// Receive form data sent from the form (via JavaScript)
$data = json_decode(file_get_contents("php://input"));

// Ensure required fields exist and are not empty
if (!empty($data->name) && !empty($data->phone) && !empty($data->service)) {
    
// Prepare the query to insert data into the bookings table
    $sql = "INSERT INTO bookings (name, phone, service, doctor, date, time) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
// Bind incoming data in order
// 's' means the data type is Text/String
    $stmt->bind_param("ssssss", $data->name, $data->phone, $data->service, $data->doctor, $data->date, $data->time);
    
// Execute the query
    if ($stmt->execute()) {
        http_response_code(201); // Success response
        echo json_encode(["message" => "Success! Appointment saved in MySQL."]);
    } else {
        http_response_code(503); // Server error response
        echo json_encode(["error" => "Unable to save booking."]);
    }
    
    $stmt->close();
} else {
    http_response_code(400); // Error response for missing data
    echo json_encode(["error" => "Incomplete data. Please fill all fields."]);
}

$conn->close();
?>