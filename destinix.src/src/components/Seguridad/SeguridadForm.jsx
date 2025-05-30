import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const SeguridadForm = () => {
  const [datos, setDatos] = useState([]);
  const [form, setForm] = useState({
    email_usu: "",
    contra_usu: ""
  });
  const [editando, setEditando] = useState(false);
  const [id_seguridad, setIdSeguridad] = useState(null);

  useEffect(() => {
    fetchSeguridad();
  }, []);

  const fetchSeguridad = async () => {
    try {
      const res = await axios.get("http://localhost/destinix/api/Seguridad/SeguridadController.php");
      setDatos(res.data);
    } catch (error) {
      console.error("Error al cargar datos de seguridad:", error);
    }
  };

  const resetForm = () => {
    setForm({ email_usu: "", contra_usu: "" });
    setEditando(false);
    setIdSeguridad(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.post("http://localhost/destinix/api/Seguridad/SeguridadController.php?editar=1", {
          ...form,
          id_seguridad
        });
        alert("Registro actualizado");
      } else {
        await axios.post("http://localhost/destinix/api/Seguridad/SeguridadController.php", form);
        alert("Registro creado");
      }

      fetchSeguridad();
      resetForm();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleEditar = (dato) => {
    setEditando(true);
    setIdSeguridad(dato.id_seguridad);
    setForm({ email_usu: dato.email_usu, contra_usu: dato.contra_usu });

    const modal = new window.bootstrap.Modal(document.getElementById("modalSeguridad"));
    modal.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar este registro?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Seguridad/SeguridadController.php?id=${id}`);
        fetchSeguridad();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Seguridad</h2>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalSeguridad" onClick={resetForm}>
          Registrar Seguridad
        </button>
      </div>

      <div className="card shadow p-3">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No hay registros</td></tr>
              ) : (
                datos.map((dato) => (
                  <tr key={dato.id_seguridad}>
                    <td>{dato.id_seguridad}</td>
                    <td>{dato.email_usu}</td>
                    <td>{dato.contra_usu}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(dato)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(dato.id_seguridad)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalSeguridad" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar Seguridad" : "Registrar Seguridad"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email_usu"
                  value={form.email_usu}
                  onChange={handleChange}
                  className="form-control mb-3"
                  required
                />
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="contra_usu"
                  value={form.contra_usu}
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

export default SeguridadForm;
