<?php
class HotelesModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getHoteles() {
        $sql = "SELECT 
                    h.*, 
                    e.desc_estado AS desc_estado, 
                    emp.nombre_emp AS nombre_empresa
                FROM hoteles h
                JOIN estado e ON h.estado_id_estado = e.id_estado
                JOIN empresa emp ON h.empresa_id_empresa = emp.id_empresa";
        return $this->conn->query($sql);
    }
    

    public function insertHotel($titulo, $img, $descripcion, $estadoId, $empresaId) {
        $stmt = $this->conn->prepare("INSERT INTO hoteles (titulo_hotel, img, descripcion_hotel, estado_id_estado, empresa_id_empresa) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssii", $titulo, $img, $descripcion, $estadoId, $empresaId);
        return $stmt->execute();
    }

    public function deleteHotel($id) {
        $stmt = $this->conn->prepare("DELETE FROM hoteles WHERE id_hoteles = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function updateHotel($id, $titulo, $img, $descripcion, $estadoId, $empresaId) {
        if ($img) {
            $stmt = $this->conn->prepare("UPDATE hoteles SET titulo_hotel = ?, img = ?, descripcion_hotel = ?, estado_id_estado = ?, empresa_id_empresa = ? WHERE id_hoteles = ?");
            $stmt->bind_param("sssiii", $titulo, $img, $descripcion, $estadoId, $empresaId, $id);
        } else {
            $stmt = $this->conn->prepare("UPDATE hoteles SET titulo_hotel = ?, descripcion_hotel = ?, estado_id_estado = ?, empresa_id_empresa = ? WHERE id_hoteles = ?");
            $stmt->bind_param("ssiii", $titulo, $descripcion, $estadoId, $empresaId, $id);
        }
        return $stmt->execute();
    }
}
