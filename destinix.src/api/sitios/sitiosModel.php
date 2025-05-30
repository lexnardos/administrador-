<?php
class SitiosModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getSitios() {
        $sql = "SELECT 
                    st.*, 
                    p.documento AS documento, 
                    e.desc_estado AS desc_estado 
                FROM sitio_turistico st
                JOIN persona p ON st.persona_id_persona = p.id_persona
                JOIN estado e ON st.estado_id_estado = e.id_estado";
        return $this->conn->query($sql);
    }

    public function insertSitio($nombre, $img, $ubicacion, $descripcion, $personaId, $estadoId) {
        $stmt = $this->conn->prepare("INSERT INTO sitio_turistico (nombre_sitio, img_sitio, ubicacion_sitio, desc_sitio, persona_id_persona, estado_id_estado) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssii", $nombre, $img, $ubicacion, $descripcion, $personaId, $estadoId);
        return $stmt->execute();
    }

    public function deleteSitio($id) {
        $stmt = $this->conn->prepare("DELETE FROM sitio_turistico WHERE id_sitio = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function updateSitio($id, $nombre, $img, $ubicacion, $descripcion, $personaId, $estadoId) {
        if ($img) {
            // Actualiza todo, incluida la imagen
            $stmt = $this->conn->prepare("UPDATE sitio_turistico 
                SET nombre_sitio = ?, img_sitio = ?, ubicacion_sitio = ?, desc_sitio = ?, persona_id_persona = ?, estado_id_estado = ? 
                WHERE id_sitio = ?");
            $stmt->bind_param("ssssiii", $nombre, $img, $ubicacion, $descripcion, $personaId, $estadoId, $id);
        } else {
            // No se actualiza la imagen
            $stmt = $this->conn->prepare("UPDATE sitio_turistico 
                SET nombre_sitio = ?, ubicacion_sitio = ?, desc_sitio = ?, persona_id_persona = ?, estado_id_estado = ? 
                WHERE id_sitio = ?");
            $stmt->bind_param("sssiii", $nombre, $ubicacion, $descripcion, $personaId, $estadoId, $id);
        }
    
        return $stmt->execute();
    }
    
    
}
