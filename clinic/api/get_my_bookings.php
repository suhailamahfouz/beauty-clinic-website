<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'])) {
    $email = $conn->real_escape_string($data['email']);
    
   // Query to select bookings for the given email, ordered by ID (newest first)
    $sql = "SELECT * FROM bookings WHERE email = '$email' ORDER BY id DESC";
    $result = $conn->query($sql);
    
    $bookings = array();
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
    }
    echo json_encode(["success" => true, "bookings" => $bookings]);
} else {
    echo json_encode(["success" => false, "message" => "No email provided."]);
}

$conn->close();
?>