import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const RolForm = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    Tipo_Rol: ""
  });
  const [editando, setEditando] = useState(false);
  const [idRol, setIdRol] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost/destinix/api/Rol/RolController.php");
      setRoles(res.data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const resetForm = () => {
    setForm({ Tipo_Rol: "" });
    setEditando(false);
    setIdRol(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await axios.post("http://localhost/destinix/api/Rol/RolController.php?editar=1", {
          ...form,
          idRol
        });
        alert("Rol actualizado");
      } else {
        await axios.post("http://localhost/destinix/api/Rol/RolController.php", form);
        alert("Rol registrado");
      }

      fetchRoles();
      resetForm();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al guardar el rol:", error);
    }
  };

  const handleEditar = (rol) => {
    setEditando(true);
    setIdRol(rol.idRol);
    setForm({ Tipo_Rol: rol.Tipo_Rol });

    const modal = new window.bootstrap.Modal(document.getElementById("modalRol"));
    modal.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar este rol?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Rol/RolController.php?id=${id}`);
        fetchRoles();
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Roles</h2>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalRol" onClick={resetForm}>
          Registrar Rol
        </button>
      </div>

      <div className="card shadow p-3">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tipo de Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr><td colSpan="3" className="text-center">No hay registros</td></tr>
              ) : (
                roles.map((rol) => (
                  <tr key={rol.idRol}>
                    <td>{rol.idRol}</td>
                    <td>{rol.Tipo_Rol}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(rol)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(rol.idRol)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalRol" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar Rol" : "Registrar Rol"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Tipo de Rol</label>
                <input
                  type="text"
                  name="Tipo_Rol"
                  value={form.Tipo_Rol}
                  onChange={handleChange}
                  className="form-control"
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

export default RolForm;
