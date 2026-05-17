<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

$sql = "SELECT * FROM specialists ORDER BY id DESC";
$result = $conn->query($sql);

$specialists = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $specialists[] = $row;
    }
}

echo json_encode($specialists);
$conn->close();
?>