<?php
$servername = "sql200.infinityfree.com";
$username = "if0_41869200";
$password = "Soi972006";
$dbname = "if0_41869200_beauty";

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// فحص الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>