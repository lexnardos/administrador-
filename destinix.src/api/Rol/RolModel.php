<?php
class RolModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getRoles() {
        $sql = "SELECT * FROM rol";
        return $this->conn->query($sql);
    }

    public function insertRol($tipo_rol) {
        $stmt = $this->conn->prepare("INSERT INTO rol (Tipo_Rol) VALUES (?)");
        $stmt->bind_param("s", $tipo_rol);
        return $stmt->execute();
    }

    public function updateRol($id, $tipo_rol) {
        $stmt = $this->conn->prepare("UPDATE rol SET Tipo_Rol = ? WHERE idRol = ?");
        $stmt->bind_param("si", $tipo_rol, $id);
        return $stmt->execute();
    }

    public function deleteRol($id) {
        $stmt = $this->conn->prepare("DELETE FROM rol WHERE idRol = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
