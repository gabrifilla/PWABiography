<?php
include('./dbConnection.php');

$query = "SELECT * FROM biographies";
$stmt = $db->prepare($query);
$stmt->execute();
$res = $stmt->fetchAll();

echo json_encode($res);