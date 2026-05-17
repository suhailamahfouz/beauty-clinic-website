<?php
// This API endpoint retrieves all bookings from the database and returns them as JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include the database connection file
require_once 'db_connect.php';

// Query to select all bookings, ordered by creation date (newest first)
$sql = "SELECT * FROM bookings ORDER BY created_at DESC";
$result = $conn->query($sql);

$bookings = array();

// Fetch all bookings and store them in an array
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

// Return the bookings as JSON
echo json_encode($bookings);

$conn->close();
?>