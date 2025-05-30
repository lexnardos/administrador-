import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const ReservaForm = () => {
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({
    fecha_reserva: "",
    fecha_visita: "",
    cantidad_personas: "",
    restaurante_id: "",
    sitio_id: "",
    hotel_id: "",
    estado_id: "",
    empresa_id: "",
    id_itinerario: ""
  });
  const [editando, setEditando] = useState(false);
  const [idReserva, setIdReserva] = useState(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const res = await axios.get("http://localhost/destinix/api/Reserva/ReservaController.php");
      setReservas(res.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    }
  };

  const resetForm = () => {
    setForm({
      fecha_reserva: "",
      fecha_visita: "",
      cantidad_personas: "",
      restaurante_id: "",
      sitio_id: "",
      hotel_id: "",
      estado_id: "",
      empresa_id: "",
      id_itinerario: ""
    });
    setIdReserva(null);
    setEditando(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await axios.post("http://localhost/destinix/api/Reserva/ReservaController.php?editar=1", {
          ...form,
          id_reserva: idReserva
        });
        alert("Reserva actualizada");
      } else {
        await axios.post("http://localhost/destinix/api/Reserva/ReservaController.php", form);
        alert("Reserva registrada");
      }

      fetchReservas();
      resetForm();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al guardar reserva:", error);
    }
  };

  const handleEditar = (reserva) => {
    setEditando(true);
    setIdReserva(reserva.id_reserva);
    setForm({
      fecha_reserva: reserva.fecha_reserva,
      fecha_visita: reserva.fecha_visita,
      cantidad_personas: reserva.cantidad_personas,
      restaurante_id: reserva.restaurante_id,
      sitio_id: reserva.sitio_id,
      hotel_id: reserva.hotel_id,
      estado_id: reserva.estado_id,
      empresa_id: reserva.empresa_id,
      id_itinerario: reserva.id_itinerario
    });

    const modal = new window.bootstrap.Modal(document.getElementById("modalReserva"));
    modal.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar esta reserva?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Reserva/ReservaController.php?id=${id}`);
        fetchReservas();
      } catch (error) {
        console.error("Error al eliminar reserva:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Reservas</h2>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalReserva" onClick={resetForm}>
          Registrar Reserva
        </button>
      </div>

      <div className="card shadow p-3">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Fecha Reserva</th>
                <th>Fecha Visita</th>
                <th>Cant. Personas</th>
                <th>Restaurante</th>
                <th>Sitio</th>
                <th>Hotel</th>
                <th>Estado</th>
                <th>Empresa</th>
                <th>Itinerario</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr><td colSpan="11" className="text-center">No hay registros</td></tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva.id_reserva}>
                    <td>{reserva.id_reserva}</td>
                    <td>{reserva.fecha_reserva}</td>
                    <td>{reserva.fecha_visita}</td>
                    <td>{reserva.cantidad_personas}</td>
                    <td>{reserva.restaurante_id}</td>
                    <td>{reserva.sitio_id}</td>
                    <td>{reserva.hotel_id}</td>
                    <td>{reserva.estado_id}</td>
                    <td>{reserva.empresa_id}</td>
                    <td>{reserva.id_itinerario}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(reserva)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(reserva.id_reserva)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalReserva" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar Reserva" : "Registrar Reserva"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body row g-3">
                {[
                  ["fecha_reserva", "Fecha Reserva", "date"],
                  ["fecha_visita", "Fecha Visita", "date"],
                  ["cantidad_personas", "Cantidad de Personas", "number"],
                  ["restaurante_id", "ID Restaurante"],
                  ["sitio_id", "ID Sitio"],
                  ["hotel_id", "ID Hotel"],
                  ["estado_id", "ID Estado"],
                  ["empresa_id", "ID Empresa"],
                  ["id_itinerario", "ID Itinerario"]
                ].map(([name, label, type = "text"]) => (
                  <div className="col-md-6" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="modal-footer mt-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="cerrarModal">Cancelar</button>
                <button type="submit" className="btn btn-success">{editando ? "Actualizar" : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaForm;
