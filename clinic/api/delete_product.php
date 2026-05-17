<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    $id = $conn->real_escape_string($data->id);
    
    $sql = "DELETE FROM products WHERE id = $id";

    if($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Product deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete product."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No ID provided."]);
}

$conn->close();
?>