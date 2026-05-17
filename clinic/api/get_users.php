<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db_connect.php';

// Fetch users ordered from newest to oldest
$sql = "SELECT id, name, email, phone, role FROM users ORDER BY id DESC";
$result = $conn->query($sql);

$users = array();
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}
echo json_encode($users);
$conn->close();
?>