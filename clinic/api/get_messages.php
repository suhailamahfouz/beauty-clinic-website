<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

// Fetch messages ordered from newest to oldest
$sql = "SELECT * FROM messages ORDER BY created_at DESC";
$result = $conn->query($sql);

$messages = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

echo json_encode($messages);
$conn->close();
?>