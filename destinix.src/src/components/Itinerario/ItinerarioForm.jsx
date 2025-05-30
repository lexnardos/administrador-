import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

const ItinerarioForm = () => {
  const [itinerarios, setItinerarios] = useState([]);
  const [form, setForm] = useState({
    persona_id_persona: "",
    id_sitio: "",
    id_hoteles: "",
    id_restaurante: "",
    fecha_itinerario: "",
    hora_inicio: "",
    hora_fin: "",
    descripcion: "",
    estado_id_estado: ""
  });
  const [editando, setEditando] = useState(false);
  const [idItinerario, setIdItinerario] = useState(null);

  useEffect(() => {
    fetchItinerarios();
  }, []);

  const fetchItinerarios = async () => {
    try {
      const res = await axios.get("http://localhost/destinix/api/Itinerario/ItinerarioController.php");
      setItinerarios(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar itinerarios:", error);
    }
  };

  const resetForm = () => {
    setForm({
      persona_id_persona: "",
      id_sitio: "",
      id_hoteles: "",
      id_restaurante: "",
      fecha_itinerario: "",
      hora_inicio: "",
      hora_fin: "",
      descripcion: "",
      estado_id_estado: ""
    });
    setIdItinerario(null);
    setEditando(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      if (editando) {
        formData.append("id_itinerario", idItinerario);
        await axios.post("http://localhost/destinix/api/Itinerario/ItinerarioController.php?editar=1", formData);
        alert("Itinerario actualizado correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/Itinerario/ItinerarioController.php", formData);
        alert("Itinerario registrado exitosamente");
      }

      fetchItinerarios();
      resetForm();

      const modalElement = document.getElementById("modalItinerario");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleEditar = (item) => {
    setEditando(true);
    setIdItinerario(item.id_itinerario);
    setForm({
      persona_id_persona: item.persona_id_persona,
      id_sitio: item.id_sitio,
      id_hoteles: item.id_hoteles,
      id_restaurante: item.id_restaurante,
      fecha_itinerario: item.fecha_itinerario,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin,
      descripcion: item.descripcion,
      estado_id_estado: item.estado_id_estado
    });

    const modalElement = document.getElementById("modalItinerario");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar este itinerario?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Itinerario/ItinerarioController.php?id=${id}`);
        fetchItinerarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Gestión de Itinerarios</h2>
        <button
          className="btn btn-success px-4"
          data-bs-toggle="modal"
          data-bs-target="#modalItinerario"
          onClick={resetForm}
        >
          Ingresar Itinerario
        </button>
      </div>

      <div className="card shadow p-3">
        <h4 className="text-center mb-3">Itinerarios Registrados</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Persona</th>
                <th>Sitio</th>
                <th>Hotel</th>
                <th>Restaurante</th>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {itinerarios.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">No hay itinerarios registrados</td>
                </tr>
              ) : (
                itinerarios.map((item) => (
                  <tr key={item.id_itinerario}>
                    <td>{item.persona_id_persona}</td>
                    <td>{item.id_sitio}</td>
                    <td>{item.id_hoteles}</td>
                    <td>{item.id_restaurante}</td>
                    <td>{item.fecha_itinerario}</td>
                    <td>{item.hora_inicio}</td>
                    <td>{item.hora_fin}</td>
                    <td>{item.estado_id_estado}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(item)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(item.id_itinerario)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalItinerario" tabIndex="-1" aria-labelledby="modalItinerarioLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalItinerarioLabel">
                  {editando ? "Editar Itinerario" : "Registrar Itinerario"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {[
                    { label: "ID Persona", name: "persona_id_persona" },
                    { label: "ID Sitio", name: "id_sitio" },
                    { label: "ID Hotel", name: "id_hoteles" },
                    { label: "ID Restaurante", name: "id_restaurante" },
                    { label: "Fecha", name: "fecha_itinerario", type: "date" },
                    { label: "Hora Inicio", name: "hora_inicio", type: "time" },
                    { label: "Hora Fin", name: "hora_fin", type: "time" },
                    { label: "Estado", name: "estado_id_estado" }
                  ].map(({ label, name, type = "text" }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type={type}
                        className="form-control"
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="cerrarModal">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {editando ? "Actualizar Itinerario" : "Guardar Itinerario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItinerarioForm;
