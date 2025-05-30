import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const EmpresaForm = () => {
  const [empresas, setEmpresas] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [empresaId, setEmpresaId] = useState(null);
  const [nombreEmp, setNombreEmp] = useState("");
  const [direccionEmp, setDireccionEmp] = useState("");
  const [correoEmpresa, setCorreoEmpresa] = useState("");
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, perRes, catRes] = await Promise.all([
        axios.get("http://localhost/destinix/api/Empresa/EmpresaController.php"),
        axios.get("http://localhost/destinix/api/Persona/PersonaController.php"),
        axios.get("http://localhost/destinix/api/Categoria/CategoriaController.php"),
      ]);
      setEmpresas(empRes.data);
      setPersonas(perRes.data);
      setCategorias(catRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const resetFormulario = () => {
    setEmpresaId(null);
    setNombreEmp("");
    setDireccionEmp("");
    setCorreoEmpresa("");
    setTelefonoEmpresa("");
    setPersonaId("");
    setCategoriaId("");
    setEditando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombre_emp: nombreEmp,
      direccion_emp: direccionEmp,
      correo_empresa: correoEmpresa,
      telefono_empresa: telefonoEmpresa,
      persona_id_persona: personaId,
      id_categoria: categoriaId,
    };

    try {
      if (editando) {
        datos.id_empresa = empresaId;
        await axios.put("http://localhost/destinix/api/Empresa/EmpresaController.php", datos);
        alert("Empresa actualizada correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/Empresa/EmpresaController.php", datos);
        alert("Empresa registrada exitosamente");
      }

      fetchData();
      resetFormulario();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al guardar empresa:", error);
    }
  };

  const handleEditar = (empresa) => {
    setEditando(true);
    setEmpresaId(empresa.id_empresa);
    setNombreEmp(empresa.nombre_emp);
    setDireccionEmp(empresa.direccion_emp);
    setCorreoEmpresa(empresa.correo_empresa);
    setTelefonoEmpresa(empresa.telefono_empresa);
    setPersonaId(empresa.persona_id_persona);
    setCategoriaId(empresa.id_categoria);

    const modal = new window.bootstrap.Modal(document.getElementById("modalEmpresa"));
    modal.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta empresa?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Empresa/EmpresaController.php?id=${id}`);
        fetchData();
      } catch (error) {
        console.error("Error al eliminar empresa:", error);
      }
    }
  };

  const getNombrePersona = (id) => {
    const persona = personas.find(p => p.id_persona === id);
    return persona ? persona.documento : "Desconocido";
  };

  const getNombreCategoria = (id) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nombre_cate : "Desconocido";
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <h2>Gestión de Empresas</h2>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#modalEmpresa"
          onClick={resetFormulario}
        >
          Ingresar Empresa
        </button>
      </div>

      <div className="card shadow p-3">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Persona</th>
                <th>Categoría</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No hay empresas registradas</td></tr>
              ) : (
                empresas.map(emp => (
                  <tr key={emp.id_empresa}>
                    <td>{emp.nombre_emp}</td>
                    <td>{emp.direccion_emp}</td>
                    <td>{emp.correo_empresa}</td>
                    <td>{emp.telefono_empresa}</td>
                    <td>{getNombrePersona(emp.persona_id_persona)}</td>
                    <td>{getNombreCategoria(emp.id_categoria)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(emp)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(emp.id_empresa)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalEmpresa" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editando ? "Editar Empresa" : "Registrar Empresa"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" value={nombreEmp} onChange={(e) => setNombreEmp(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Dirección</label>
                  <input type="text" className="form-control" value={direccionEmp} onChange={(e) => setDireccionEmp(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-control" value={correoEmpresa} onChange={(e) => setCorreoEmpresa(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input type="text" className="form-control" value={telefonoEmpresa} onChange={(e) => setTelefonoEmpresa(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Persona</label>
                  <select className="form-select" value={personaId} onChange={(e) => setPersonaId(e.target.value)} required>
                    <option value="">Seleccione una persona</option>
                    {personas.map(p => (
                      <option key={p.id_persona} value={p.id_persona}>{p.documento}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(c => (
                      <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_cate}</option>
                    ))}
                  </select>
                </div>
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

export default EmpresaForm;
