<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id) && isset($data->in_stock)) {
    $id = $conn->real_escape_string($data->id);
    $in_stock = $conn->real_escape_string($data->in_stock); // Expecting 1 for in stock, 0 for out of stock
    
    $sql = "UPDATE products SET in_stock = $in_stock WHERE id = $id";

    if($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Stock status updated."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update stock."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}

$conn->close();
?>