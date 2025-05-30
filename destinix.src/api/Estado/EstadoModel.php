<?php
class EstadoModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getEstados() {
        $sql = "SELECT * FROM estado ORDER BY id_estado ASC";

        return $this->conn->query($sql);
    }

    public function insertEstado($desc_estado) {
        $stmt = $this->conn->prepare("INSERT INTO estado (desc_estado) VALUES (?)");
        $stmt->bind_param("s", $desc_estado);
        return $stmt->execute();
    }

    public function updateEstado($id, $desc_estado) {
        $stmt = $this->conn->prepare("UPDATE estado SET desc_estado = ? WHERE id_estado = ?");
        $stmt->bind_param("si", $desc_estado, $id);
        return $stmt->execute();
    }

    public function deleteEstado($id) {
        $stmt = $this->conn->prepare("DELETE FROM estado WHERE id_estado = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
