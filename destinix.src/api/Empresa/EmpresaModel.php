<?php
class EmpresaModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getEmpresas() {
        $sql = "SELECT * FROM empresa";
        return $this->conn->query($sql);
    }

    public function insertEmpresa($nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria) {
        $stmt = $this->conn->prepare("INSERT INTO empresa (nombre_emp, direccion_emp, correo_empresa, telefono_empresa, persona_id_persona, id_categoria) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssii", $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria);
        return $stmt->execute();
    }

    public function updateEmpresa($id, $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria) {
        $stmt = $this->conn->prepare("UPDATE empresa SET nombre_emp = ?, direccion_emp = ?, correo_empresa = ?, telefono_empresa = ?, persona_id_persona = ?, id_categoria = ? WHERE id_empresa = ?");
        $stmt->bind_param("ssssiis", $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria, $id);
        return $stmt->execute();
    }

    public function deleteEmpresa($id) {
        $stmt = $this->conn->prepare("DELETE FROM empresa WHERE id_empresa = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
