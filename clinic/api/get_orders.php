<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

// Fetch orders ordered from newest to oldest
$sql = "SELECT * FROM orders ORDER BY created_at DESC";
$result = $conn->query($sql);

$orders = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
       // Decode the JSON string in the 'items' column to an array
        $row['items'] = json_decode($row['items']); 
        $orders[] = $row;
    }
}

echo json_encode($orders);

$conn->close();
?>