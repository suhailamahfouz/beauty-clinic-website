<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? 0;
// Set discount to NULL if no discount is applied
$offer = !empty($_POST['offer']) ? $_POST['offer'] : null; 
$desc = $_POST['desc'] ?? '';
$in_stock = 1; // Product is available by default

$image_path = "images/logo.png"; 

if(isset($_FILES["image"]) && $_FILES["image"]["error"] == 0) {
    $target_dir = __DIR__ . "/../images/"; 
    if (!file_exists($target_dir)) { mkdir($target_dir, 0777, true); }

    $file_extension = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $new_file_name = "prod_" . time() . "_" . rand(1000, 9999) . "." . $file_extension; 
    
    $target_file = $target_dir . $new_file_name;
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        $image_path = "images/" . $new_file_name; 
    }
}

// Database protection
$name = $conn->real_escape_string($name);
$desc = $conn->real_escape_string($desc);

// Insert data
$sql = "INSERT INTO products (name, price, offer, description, image_path, in_stock) VALUES ('$name', '$price', " . ($offer ? "'$offer'" : "NULL") . ", '$desc', '$image_path', '$in_stock')";

if($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Product added successfully!"]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
?>