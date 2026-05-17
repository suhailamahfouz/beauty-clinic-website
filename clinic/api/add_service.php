<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

// Ensure required data and image are provided
if (isset($_POST['title']) && isset($_FILES['image'])) {
    
    $title = $_POST['title'];
    $duration = $_POST['duration'];
    $price = $_POST['price'];
// Set offer price to NULL if no discount offer exists
    $offer = !empty($_POST['offer']) ? $_POST['offer'] : null; 
    $desc = $_POST['desc'];
    
// Image upload configuration
    $target_dir = "../images/";
// Add a timestamp before the image name
// to prevent duplicate filenames from overwriting each other
    $image_name = time() . "_" . basename($_FILES["image"]["name"]);
    $target_file = $target_dir . $image_name;
    $db_image_path = "images/" . $image_name;

    // Attempt to upload the image to the target folder
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        
        // Insert data into the database
        $sql = "INSERT INTO services (title, duration, price, offer, description, image_path) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        
        // s = string, d = double (for prices)
        $stmt->bind_param("ssddss", $title, $duration, $price, $offer, $desc, $db_image_path);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Service added successfully!"]);
        } else {
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["error" => "Failed to upload image."]);
    }
} else {
    echo json_encode(["error" => "Incomplete data. Please fill all fields and select an image."]);
}

$conn->close();
?>