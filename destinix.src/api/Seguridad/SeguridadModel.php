<?php
class SeguridadModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getSeguridad() {
        $sql = "SELECT * FROM seguridad";
        return $this->conn->query($sql);
    }

    public function insertSeguridad($email_usu, $contra_usu) {
        $stmt = $this->conn->prepare("INSERT INTO seguridad (email_usu, contra_usu) VALUES (?, ?)");
        $stmt->bind_param("ss", $email_usu, $contra_usu);
        return $stmt->execute();
    }

    public function updateSeguridad($id, $email_usu, $contra_usu) {
        $stmt = $this->conn->prepare("UPDATE seguridad SET email_usu = ?, contra_usu = ? WHERE id_seguridad = ?");
        $stmt->bind_param("ssi", $email_usu, $contra_usu, $id);
        return $stmt->execute();
    }

    public function deleteSeguridad($id) {
        $stmt = $this->conn->prepare("DELETE FROM seguridad WHERE id_seguridad = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
