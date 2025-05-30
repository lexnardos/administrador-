<?php
class CategoriaModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getCategorias() {
        $sql = "SELECT * FROM categoria";
        return $this->conn->query($sql);
    }

    public function insertCategoria($nombre, $descripcion) {
        $stmt = $this->conn->prepare("INSERT INTO categoria (nombre_cate, desc_cate) VALUES (?, ?)");
        $stmt->bind_param("ss", $nombre, $descripcion);
        return $stmt->execute();
    }

    public function updateCategoria($id, $nombre, $descripcion) {
        $query = "UPDATE categoria SET nombre_cate = ?, desc_cate = ? WHERE id_categoria = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $nombre, $descripcion, $id);
        return $stmt->execute();
    }
    

    public function deleteCategoria($id) {
        $stmt = $this->conn->prepare("DELETE FROM categoria WHERE id_categoria = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
