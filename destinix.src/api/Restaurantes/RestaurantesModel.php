<?php
class RestaurantesModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getRestaurantes() {
        $sql = "SELECT 
                    r.*, 
                    e.desc_estado AS desc_estado, 
                    emp.nombre_emp AS nombre_empresa
                FROM restaurantes r
                JOIN estado e ON r.estado_id_estado = e.id_estado
                JOIN empresa emp ON r.empresa_id_empresa = emp.id_empresa";
        return $this->conn->query($sql);
    }
    

    public function insertRestaurante($titulo, $img, $descripcion, $estadoId, $empresaId) {
        $stmt = $this->conn->prepare("INSERT INTO restaurantes (titulo_restaurante, img, desc_restaurantes, estado_id_estado, empresa_id_empresa) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssii", $titulo, $img, $descripcion, $estadoId, $empresaId);
        return $stmt->execute();
    }

    public function deleteRestaurante($id) {
        $stmt = $this->conn->prepare("DELETE FROM restaurantes WHERE id_restaurante = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function updateRestaurante($id, $titulo, $img, $descripcion, $estadoId, $empresaId) {
        if ($img) {
            $stmt = $this->conn->prepare("UPDATE restaurantes SET titulo_restaurante = ?, img = ?, desc_restaurantes = ?, estado_id_estado = ?, empresa_id_empresa = ? WHERE id_restaurante = ?");
            $stmt->bind_param("sssiii", $titulo, $img, $descripcion, $estadoId, $empresaId, $id);
        } else {
            $stmt = $this->conn->prepare("UPDATE restaurantes SET titulo_restaurante = ?, desc_restaurantes = ?, estado_id_estado = ?, empresa_id_empresa = ? WHERE id_restaurante = ?");
            $stmt->bind_param("ssiii", $titulo, $descripcion, $estadoId, $empresaId, $id);
        }
        return $stmt->execute();
    }
}
