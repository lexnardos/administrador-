import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap"; 
import './SitiosForm.css';
window.bootstrap = bootstrap;          

const SitiosForm = () => {
  const [nombre, setNombre] = useState("");
  const [img, setImg] = useState(null);
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [estadoId, setEstadoId] = useState("");
  const [editando, setEditando] = useState(false);
  const [sitioEditandoId, setSitioEditandoId] = useState(null);

  const [personas, setPersonas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [sitios, setSitios] = useState([]);

  useEffect(() => {
    axios.get("http://localhost/destinix/obtener_persona.php")
      .then(res => setPersonas(res.data))
      .catch(err => console.error("Error al obtener personas:", err));

    axios.get("http://localhost/destinix/obtener_estado.php")
      .then(res => setEstados(res.data))
      .catch(err => console.error("Error al obtener estados:", err));

    obtenerSitios();
  }, []);

  const obtenerSitios = () => {
    axios.get("http://localhost/destinix/api/sitios/SitiosController.php")
      .then(res => setSitios(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Error al obtener sitios:", err);
        setSitios([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre_sitio", nombre);
    formData.append("ubicacion_sitio", ubicacion);
    formData.append("desc_sitio", descripcion);
    formData.append("persona_id_persona", personaId);
    formData.append("estado_id_estado", estadoId);
    if (img) formData.append("img_sitio", img);

    try {
      if (editando) {
        formData.append("id_sitio", sitioEditandoId);
        await axios.post("http://localhost/destinix/api/sitios/SitiosController.php?editar=1", formData);
        alert("Sitio actualizado correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/sitios/SitiosController.php", formData);
        alert("Sitio registrado exitosamente");
      }

      resetFormulario();
      obtenerSitios();
      document.getElementById("cerrarModal").click(); 
    } catch (error) {
      console.error("Error al enviar sitio:", error);
    }
  };

  const handleEditar = (sitio) => {
    setEditando(true);
    setSitioEditandoId(sitio.id_sitio);
    setNombre(sitio.nombre_sitio);
    setUbicacion(sitio.ubicacion_sitio);
    setDescripcion(sitio.desc_sitio);
    setPersonaId(sitio.persona_id_persona);
    setEstadoId(sitio.estado_id_estado);
    setImg(null);

    // Asegura que el modal de Bootstrap esté inicializado
    const modalElement = document.getElementById("modalSitio");
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este sitio?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/sitios/SitiosController.php?id=${id}`);
        obtenerSitios();
      } catch (error) {
        console.error("Error al eliminar el sitio:", error);
      }
    }
  };

  const resetFormulario = () => {
    setNombre("");
    setImg(null);
    setUbicacion("");
    setDescripcion("");
    setPersonaId("");
    setEstadoId("");
    setEditando(false);
    setSitioEditandoId(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Gestión de Sitios Turísticos</h2>
        <button
          className="btn btn-success px-4"
          data-bs-toggle="modal"
          data-bs-target="#modalSitio"
          onClick={resetFormulario}
        >
          Ingresar Sitio
        </button>
      </div>

      <div className="card custom-card shadow p-3">
        <h4 className="text-center mb-3">Sitios Registrados</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Imagen</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sitios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No hay sitios registrados</td>
                </tr>
              ) : (
                sitios.map((sitio) => (
                  <tr key={sitio.id_sitio}>
                    <td>{sitio.nombre_sitio}</td>
                    <td>{sitio.ubicacion_sitio}</td>
                    <td>{sitio.desc_sitio}</td>
                    <td>{sitio.desc_estado || "N/A"}</td>
                    <td>{sitio.documento || "N/A"}</td>
                    <td>
                      {sitio.img_sitio ? (
                        <img
                          src={`http://localhost/destinix/api/uploads/${sitio.img_sitio}`}
                          alt="Sitio"
                          width="80"
                          height="60"
                          className="img-thumbnail"
                        />
                      ) : "Sin imagen"}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditar(sitio)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(sitio.id_sitio)}
                      >
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
        id="modalSitio"
        tabIndex="-1"
        aria-labelledby="modalSitioLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalSitioLabel">
                  {editando ? "Editar Sitio Turístico" : "Registrar Sitio Turístico"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre del Sitio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setImg(e.target.files[0])}
                      accept="image/*"
                      {...(!editando && { required: true })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ubicación</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ubicacion}
                      onChange={(e) => setUbicacion(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Persona Responsable</label>
                    <select
                      className="form-select"
                      value={personaId}
                      onChange={(e) => setPersonaId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione una persona</option>
                      {personas.map((p) => (
                        <option key={p.id_persona} value={p.id_persona}>
                          {p.documento}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={estadoId}
                      onChange={(e) => setEstadoId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione un estado</option>
                      {estados.map((e) => (
                        <option key={e.id_estado} value={e.id_estado}>
                          {e.desc_estado}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="cerrarModal">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {editando ? "Actualizar Sitio" : "Guardar Sitio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default SitiosForm;
