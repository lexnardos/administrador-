import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const PersonaForm = () => {
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({
    nombre_usu: "",
    apellido_usu: "",
    tipo_documento: "",
    documento: "",
    email_usu: "",
    telefono_usu: "",
    genero: "",
    localidad: "",
    fecha_nacimiento: "",
    contraseña: "",
    id_estado: "",
    token: "",
    id_seguridad: "",
    rol_idRol: "",
    foto_perfil: null
  });
  const [editando, setEditando] = useState(false);
  const [idPersona, setIdPersona] = useState(null);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const res = await axios.get("http://localhost/destinix/api/Persona/PersonaController.php");
      setPersonas(res.data);
    } catch (error) {
      console.error("Error al cargar personas:", error);
    }
  };

  const resetForm = () => {
    setForm({
      nombre_usu: "",
      apellido_usu: "",
      tipo_documento: "",
      documento: "",
      email_usu: "",
      telefono_usu: "",
      genero: "",
      localidad: "",
      fecha_nacimiento: "",
      contraseña: "",
      id_estado: "",
      token: "",
      id_seguridad: "",
      rol_idRol: "",
      foto_perfil: null
    });
    setIdPersona(null);
    setEditando(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      if (editando) {
        formData.append("id_persona", idPersona);
        await axios.post("http://localhost/destinix/api/Persona/PersonaController.php?editar=1", formData);
        alert("Persona actualizada");
      } else {
        await axios.post("http://localhost/destinix/api/Persona/PersonaController.php", formData);
        alert("Persona registrada");
      }

      fetchPersonas();
      resetForm();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al guardar persona:", error);
    }
  };

  const handleEditar = (persona) => {
    setEditando(true);
    setIdPersona(persona.id_persona);
    setForm({
      nombre_usu: persona.nombre_usu,
      apellido_usu: persona.apellido_usu,
      tipo_documento: persona.tipo_documento,
      documento: persona.documento,
      email_usu: persona.email_usu,
      telefono_usu: persona.telefono_usu,
      genero: persona.genero,
      localidad: persona.localidad,
      fecha_nacimiento: persona.fecha_nacimiento,
      contraseña: persona.contraseña,
      id_estado: persona.id_estado,
      token: persona.token,
      id_seguridad: persona.id_seguridad,
      rol_idRol: persona.rol_idRol,
      foto_perfil: null
    });

    const modal = new window.bootstrap.Modal(document.getElementById("modalPersona"));
    modal.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar esta persona?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Persona/PersonaController.php?id=${id}`);
        fetchPersonas();
      } catch (error) {
        console.error("Error al eliminar persona:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Personas</h2>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalPersona" onClick={resetForm}>
          Registrar Persona
        </button>
      </div>

      <div className="card shadow p-3">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Documento</th>
                <th>Email</th>
                <th>Género</th>
                <th>Localidad</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.length === 0 ? (
                <tr><td colSpan="9" className="text-center">No hay registros</td></tr>
              ) : (
                personas.map((persona) => (
                  <tr key={persona.id_persona}>
                    <td>{persona.id_persona}</td>
                    <td>{persona.nombre_usu}</td>
                    <td>{persona.apellido_usu}</td>
                    <td>{persona.documento}</td>
                    <td>{persona.email_usu}</td>
                    <td>{persona.genero}</td>
                    <td>{persona.localidad}</td>
                    <td>{persona.rol_idRol}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(persona)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(persona.id_persona)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalPersona" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar Persona" : "Registrar Persona"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body row g-3">
                {[
                  ["nombre_usu", "Nombre"],
                  ["apellido_usu", "Apellido"],
                  ["tipo_documento", "Tipo Documento"],
                  ["documento", "Documento"],
                  ["email_usu", "Email", "email"],
                  ["telefono_usu", "Teléfono"],
                  ["genero", "Género"],
                  ["localidad", "Localidad"],
                  ["fecha_nacimiento", "Fecha Nacimiento", "date"],
                  ["contraseña", "Contraseña", "password"],
                  ["id_estado", "ID Estado"],
                  ["token", "Token"],
                  ["id_seguridad", "ID Seguridad"],
                  ["rol_idRol", "ID Rol"]
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

                <div className="col-md-6">
                  <label className="form-label">Foto de Perfil</label>
                  <input
                    type="file"
                    name="foto_perfil"
                    className="form-control"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </div>
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

export default PersonaForm;
