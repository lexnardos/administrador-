import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const EstadoForm = () => {
  const [estados, setEstados] = useState([]);
  const [descEstado, setDescEstado] = useState("");
  const [idEstado, setIdEstado] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    fetchEstados();
  }, []);

  const fetchEstados = async () => {
    try {
      const response = await axios.get("http://localhost/destinix/api/Estado/EstadoController.php");
      setEstados(response.data);
    } catch (error) {
      console.error("Error al cargar estados:", error);
    }
  };

  const resetFormulario = () => {
    setIdEstado(null);
    setDescEstado("");
    setEditando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("desc_estado", descEstado);

    try {
      if (editando) {
        formData.append("id_estado", idEstado);
        await axios.post("http://localhost/destinix/api/Estado/EstadoController.php?editar=1", formData);
        alert("Estado actualizado correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/Estado/EstadoController.php", formData);
        alert("Estado registrado correctamente");
      }

      fetchEstados();
      resetFormulario();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al guardar estado:", error);
    }
  };

  const handleEditar = (estado) => {
    setEditando(true);
    setIdEstado(estado.id_estado);
    setDescEstado(estado.desc_estado);

    const modal = new window.bootstrap.Modal(document.getElementById("modalEstado"));
    modal.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este estado?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Estado/EstadoController.php?id=${id}`);
        fetchEstados();
      } catch (error) {
        console.error("Error al eliminar estado:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Estados</h2>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalEstado" onClick={resetFormulario}>
          Ingresar Estado
        </button>
      </div>

      <div className="card shadow p-3">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estados.length === 0 ? (
                <tr><td colSpan="3" className="text-center">No hay estados registrados</td></tr>
              ) : (
                estados.map(estado => (
                  <tr key={estado.id_estado}>
                    <td>{estado.id_estado}</td>
                    <td>{estado.desc_estado}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(estado)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(estado.id_estado)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalEstado" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar Estado" : "Registrar Estado"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Descripción del Estado</label>
                <input
                  type="text"
                  className="form-control"
                  value={descEstado}
                  onChange={(e) => setDescEstado(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
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

export default EstadoForm;
