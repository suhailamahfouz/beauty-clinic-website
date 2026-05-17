<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

// Receive form data sent from the form (via JavaScript)
$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    $id = $conn->real_escape_string($data->id);
    
    // Prepare the SQL statement to delete the service
    $sql = "DELETE FROM services WHERE id = $id";

    if($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Service deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete service."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No ID provided."]);
}

$conn->close();
?>