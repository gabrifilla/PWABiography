<?php
include 'dbConnection.php';

if(isset($_POST['result'])){
    $data = $_POST['result'];
}else{
    $data = null;
}

$data = json_decode($data);
try {
    // For each data
    foreach ($data as $d) {
        // Verify if there is already a data with that same id
        $verifyQuery = "SELECT id FROM biographies WHERE id = :id";
        $stmt = $db->prepare($verifyQuery);
        $stmt->execute(array(':id' => $d->id));
        $veri = $stmt->rowCount();

        // If there is a data with that id it will update the information on DB, if there isnt, it inserts a new one
        if ($veri > 0) {
            $query = "UPDATE biographies SET name = :name, email = :email, celphone = :cel, biography = :bio 
                        WHERE id = :id";
        } else {
            $query = "INSERT INTO biographies(id, name, email, celphone, biography) VALUES (:id, :name, :email, :cel, :bio)";
        }
        $stmt = $db->prepare($query);
        $stmt->execute(array(
            ':id' => $d->id,
            ':name' => $d->name,
            ':email' => $d->email,
            ':cel' => $d->celphone,
            ':bio' => $d->biography
        ));
        $ret = $stmt->rowCount();
    }
    echo true;
} catch(Exception $e){
    echo false;
}