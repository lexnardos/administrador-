<?php
class ReservaModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getReservas() {
        $sql = "SELECT * FROM reserva";
        return $this->conn->query($sql);
    }

    public function insertReserva($fecha_reserva, $fecha_visita, $cantidad_personas, $restaurante_id, $sitio_id, $hotel_id, $estado_id, $empresa_id, $id_itinerario) {
        $stmt = $this->conn->prepare("INSERT INTO reserva (fecha_reserva, fecha_visita, cantidad_personas, restaurante_id, sitio_id, hotel_id, estado_id, empresa_id, id_itinerario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiiiiiii", $fecha_reserva, $fecha_visita, $cantidad_personas, $restaurante_id, $sitio_id, $hotel_id, $estado_id, $empresa_id, $id_itinerario);
        return $stmt->execute();
    }

    public function updateReserva($id, $fecha_reserva, $fecha_visita, $cantidad_personas, $restaurante_id, $sitio_id, $hotel_id, $estado_id, $empresa_id, $id_itinerario) {
        $stmt = $this->conn->prepare("UPDATE reserva SET fecha_reserva = ?, fecha_visita = ?, cantidad_personas = ?, restaurante_id = ?, sitio_id = ?, hotel_id = ?, estado_id = ?, empresa_id = ?, id_itinerario = ? WHERE id_reserva = ?");
        $stmt->bind_param("ssiiiiiiii", $fecha_reserva, $fecha_visita, $cantidad_personas, $restaurante_id, $sitio_id, $hotel_id, $estado_id, $empresa_id, $id_itinerario, $id);
        return $stmt->execute();
    }

    public function deleteReserva($id) {
        $stmt = $this->conn->prepare("DELETE FROM reserva WHERE id_reserva = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
