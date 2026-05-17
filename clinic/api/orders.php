<?php
// Allow requests from any origin and set content type to JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Include the database connection file
require_once 'db_connect.php';

// Get the raw POST data and decode it from JSON
$data = json_decode(file_get_contents("php://input"));

// Check if the required fields are present in the data
if (!empty($data->customerName) && !empty($data->phone) && !empty($data->items)) {
    
   // Convert the items array to a JSON string for storage in the database
    $items_json = json_encode($data->items);
    
   // Prepare the SQL statement to insert the order into the database
    $sql = "INSERT INTO orders (customerName, phone, address, items, totalAmount) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    // Bind the parameters to the SQL query
    $stmt->bind_param("ssssd", $data->customerName, $data->phone, $data->address, $items_json, $data->totalAmount);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Success! Order saved in MySQL."]);
    } else {
        http_response_code(503);
        echo json_encode(["error" => "Unable to save order."]);
    }
    
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Incomplete order data."]);
}

$conn->close();
?>