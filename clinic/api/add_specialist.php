<?php
error_reporting(0); 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$name = $_POST['name'] ?? '';
$title = $_POST['title'] ?? '';
$desc = $_POST['desc'] ?? '';

$image_path = "images/logo.png"; 

if(isset($_FILES["image"]) && $_FILES["image"]["error"] == 0) {
   //  Magic Fix: Direct the image upload to the frontend folder 
    $target_dir = __DIR__ . "/../images/"; 
    
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $file_extension = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $new_file_name = "doc_" . time() . "_" . rand(1000, 9999) . "." . $file_extension; 
    
    $target_file = $target_dir . $new_file_name;
    
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        $image_path = "images/" . $new_file_name; 
    }
}

$name = $conn->real_escape_string($name);
$title = $conn->real_escape_string($title);
$desc = $conn->real_escape_string($desc);

$sql = "INSERT INTO specialists (name, title, description, image_path) VALUES ('$name', '$title', '$desc', '$image_path')";

if($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Doctor added successfully!"]);
} else {
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
}

$conn->close();
?>