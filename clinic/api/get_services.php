<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

// Fetch services from the database
$sql = "SELECT * FROM services";
$result = $conn->query($sql);

$services = array();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
}

// Return the services as JSON
echo json_encode($services);

$conn->close();
?>