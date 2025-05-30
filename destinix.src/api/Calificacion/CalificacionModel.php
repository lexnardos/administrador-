<?php
class CalificacionModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getCalificaciones() {
        $sql = "SELECT * FROM calificacion";
        return $this->conn->query($sql);
    }

    public function insertCalificacion($puntuacion) {
        $stmt = $this->conn->prepare("INSERT INTO calificacion (puntuacion) VALUES (?)");
        $stmt->bind_param("d", $puntuacion); 
        return $stmt->execute();
    }

    public function updateCalificacion($id, $puntuacion) {
        $stmt = $this->conn->prepare("UPDATE calificacion SET puntuacion = ? WHERE id_calificacion = ?");
        $stmt->bind_param("di", $puntuacion, $id); 
        return $stmt->execute();
    }

    public function deleteCalificacion($id) {
        $stmt = $this->conn->prepare("DELETE FROM calificacion WHERE id_calificacion = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
