<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

// Receive form data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['name']) && isset($data['service'])) {
    $name = $conn->real_escape_string($data['name']);
    $phone = $conn->real_escape_string($data['phone']);
    $email = $conn->real_escape_string($data['email']);
    $service = $conn->real_escape_string($data['service']);
    $doctor = $conn->real_escape_string($data['doctor']);
    $date = $conn->real_escape_string($data['date']);
    $time = $conn->real_escape_string($data['time']);

  // Insert booking into the database
    $sql = "INSERT INTO bookings (name, phone, email, service, doctor, date, time) 
            VALUES ('$name', '$phone', '$email', '$service', '$doctor', '$date', '$time')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Appointment booked successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}

$conn->close();
?>