<?php
class PersonaModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getPersonas() {
        $sql = "SELECT * FROM persona";
        return $this->conn->query($sql);
    }

    public function insertPersona($nombre_usu, $apellido_usu, $tipo_documento, $documento, $email_usu, $telefono_usu, $genero, $localidad, $fecha_nacimiento, $contraseña, $id_estado, $token, $id_seguridad, $rol_idRol, $foto_perfil) {
        $stmt = $this->conn->prepare("INSERT INTO persona (nombre_usu, apellido_usu, tipo_documento, documento, email_usu, telefono_usu, genero, localidad, fecha_nacimiento, contraseña, id_estado, token, id_seguridad, rol_idRol, foto_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssssssiss", $nombre_usu, $apellido_usu, $tipo_documento, $documento, $email_usu, $telefono_usu, $genero, $localidad, $fecha_nacimiento, $contraseña, $id_estado, $token, $id_seguridad, $rol_idRol, $foto_perfil);
        return $stmt->execute();
    }

    public function updatePersona($id, $nombre_usu, $apellido_usu, $tipo_documento, $documento, $email_usu, $telefono_usu, $genero, $localidad, $fecha_nacimiento, $contraseña, $id_estado, $token, $id_seguridad, $rol_idRol, $foto_perfil) {
        $stmt = $this->conn->prepare("UPDATE persona SET nombre_usu = ?, apellido_usu = ?, tipo_documento = ?, documento = ?, email_usu = ?, telefono_usu = ?, genero = ?, localidad = ?, fecha_nacimiento = ?, contraseña = ?, id_estado = ?, token = ?, id_seguridad = ?, rol_idRol = ?, foto_perfil = ? WHERE id_persona = ?");
        $stmt->bind_param("ssssssssssssissi", $nombre_usu, $apellido_usu, $tipo_documento, $documento, $email_usu, $telefono_usu, $genero, $localidad, $fecha_nacimiento, $contraseña, $id_estado, $token, $id_seguridad, $rol_idRol, $foto_perfil, $id);
        return $stmt->execute();
    }

    public function deletePersona($id) {
        $stmt = $this->conn->prepare("DELETE FROM persona WHERE id_persona = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
