<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "destinix";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificamos si se recibió el token por GET
if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Buscar al usuario con ese token y que aún no esté verificado
    $sql = "SELECT * FROM persona WHERE token_verificacion = ? AND verificado = 0";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // Actualizar el estado de verificado
        $update = "UPDATE persona SET verificado = 1, token_verificacion = NULL WHERE token_verificacion = ?";
        $stmt2 = $conn->prepare($update);
        $stmt2->bind_param("s", $token);
        $stmt2->execute();
        $stmt2->close();

        echo "<h2 style='color: green;'>✅ ¡Correo verificado correctamente!</h2>";
        echo "<p>Ya puedes <a href='login.php'>iniciar sesión</a>.</p>";
    } else {
        echo "<h2 style='color: red;'>❌ Token inválido o cuenta ya verificada.</h2>";
    }

    $stmt->close();
} else {
    echo "<h2>❗ No se recibió ningún token.</h2>";
}

$conn->close();
