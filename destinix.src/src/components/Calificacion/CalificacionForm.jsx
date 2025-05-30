import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";


window.bootstrap = bootstrap;

const CalificacionForm = () => {
  const [puntuacion, setPuntuacion] = useState("");
  const [editando, setEditando] = useState(false);
  const [calificacionEditandoId, setCalificacionEditandoId] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    obtenerCalificaciones();
  }, []);

  const obtenerCalificaciones = () => {
    axios.get("http://localhost/destinix/api/Calificacion/CalificacionController.php")
  .then(res => setCalificaciones(Array.isArray(res.data) ? res.data : []))

      .catch(err => {
        console.error("Error al obtener calificaciones:", err);
        setCalificaciones([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("puntuacion", puntuacion);

    try {
      if (editando) {
        formData.append("id_calificacion", calificacionEditandoId);
        await axios.post("http://localhost/destinix/api/Calificacion/CalificacionController.php?editar=1", formData);
        alert("Calificación actualizada correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/Calificacion/CalificacionController.php", formData);
        alert("Calificación registrada exitosamente");
      }

      resetFormulario();
      obtenerCalificaciones();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al enviar calificación:", error);
    }
  };

  const handleEditar = (calificacion) => {
    setEditando(true);
    setCalificacionEditandoId(calificacion.id_calificacion);
    setPuntuacion(calificacion.puntuacion);

    const modalElement = document.getElementById("modalCalificacion");
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta calificación?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Calificacion/CalificacionController.php?id=${id}`);
        obtenerCalificaciones();
      } catch (error) {
        console.error("Error al eliminar la calificación:", error);
      }
    }
  };

  const resetFormulario = () => {
    setPuntuacion("");
    setEditando(false);
    setCalificacionEditandoId(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Gestión de Calificaciones</h2>
        <button
  className="btn btn-success px-4"
  onClick={() => {
    resetFormulario();
    const modalElement = document.getElementById("modalCalificacion");
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  }}
>
  Ingresar Calificación
</button>
      </div>

      <div className="card custom-card shadow p-3">
        <h4 className="text-center mb-3">Calificaciones Registradas</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Puntuación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No hay calificaciones registradas</td>
                </tr>
              ) : (
                calificaciones.map((calificacion) => (
                  <tr key={calificacion.id_calificacion}>
                    <td>{calificacion.id_calificacion}</td>
                    <td>{calificacion.puntuacion}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(calificacion)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(calificacion.id_calificacion)}>
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
      <div
        className="modal fade"
        id="modalCalificacion"
        tabIndex="-1"
        aria-labelledby="modalCalificacionLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalCalificacionLabel">
                  {editando ? "Editar Calificación" : "Registrar Calificación"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Puntuación</label>
                  <input
                    type="number"
                    className="form-control"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(e.target.value)}
                    min="0"
                    max="5"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="cerrarModal">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {editando ? "Actualizar Calificación" : "Guardar Calificación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalificacionForm;
