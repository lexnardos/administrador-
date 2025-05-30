import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import '../SitiosTuristicos/SitiosForm';

window.bootstrap = bootstrap;

const RestaurantesForm = () => {
  const [titulo, setTitulo] = useState("");
  const [img, setImg] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [estadoId, setEstadoId] = useState("");
  const [editando, setEditando] = useState(false);
  const [restauranteEditandoId, setRestauranteEditandoId] = useState(null);

  const [empresas, setEmpresas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost/destinix/obtener_empresa.php")
      .then(res => setEmpresas(res.data))
      .catch(err => console.error("Error al obtener empresas:", err));

    axios.get("http://localhost/destinix/obtener_estado.php")
      .then(res => setEstados(res.data))
      .catch(err => console.error("Error al obtener estados:", err));

    obtenerRestaurantes();
  }, []);

  const obtenerRestaurantes = () => {
    axios.get("http://localhost/destinix/api/Restaurantes/RestaurantesController.php")
      .then(res => setRestaurantes(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Error al obtener restaurantes:", err);
        setRestaurantes([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo_restaurante", titulo);
    formData.append("desc_restaurantes", descripcion);
    formData.append("empresa_id_empresa", empresaId);
    formData.append("estado_id_estado", estadoId);
    if (img) formData.append("img", img);

    try {
      if (editando) {
        formData.append("id_restaurante", restauranteEditandoId);
        await axios.post("http://localhost/destinix/api/Restaurantes/RestaurantesController.php?editar=1", formData);
        alert("Restaurante actualizado correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/Restaurantes/RestaurantesController.php", formData);
        alert("Restaurante registrado exitosamente");
      }

      resetFormulario();
      obtenerRestaurantes();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al enviar restaurante:", error);
    }
  };

  const handleEditar = (restaurante) => {
    setEditando(true);
    setRestauranteEditandoId(restaurante.id_restaurante);
    setTitulo(restaurante.titulo_restaurante);
    setDescripcion(restaurante.desc_restaurantes);
    setEmpresaId(restaurante.empresa_id_empresa);
    setEstadoId(restaurante.estado_id_estado);
    setImg(null);

    const modalElement = document.getElementById("modalRestaurante");
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este restaurante?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Restaurantes/RestaurantesController.php?id=${id}`);
        obtenerRestaurantes();
      } catch (error) {
        console.error("Error al eliminar el restaurante:", error);
      }
    }
  };

  const resetFormulario = () => {
    setTitulo("");
    setImg(null);
    setDescripcion("");
    setEmpresaId("");
    setEstadoId("");
    setEditando(false);
    setRestauranteEditandoId(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Gestión de Restaurantes</h2>
        <button
          className="btn btn-success px-4"
          data-bs-toggle="modal"
          data-bs-target="#modalRestaurante"
          onClick={resetFormulario}
        >
          Ingresar Restaurante
        </button>
      </div>

      <div className="card custom-card shadow p-3">
        <h4 className="text-center mb-3">Restaurantes Registrados</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Empresa</th>
                <th>Imagen</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {restaurantes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No hay restaurantes registrados</td>
                </tr>
              ) : (
                restaurantes.map((restaurante) => (
                  <tr key={restaurante.id_restaurante}>
                    <td>{restaurante.titulo_restaurante}</td>
                    <td>{restaurante.desc_restaurantes}</td>
                    <td>{restaurante.desc_estado || "N/A"}</td>
                    <td>{restaurante.nombre_empresa || "N/A"}</td>
                    <td>
                      {restaurante.img ? (
                        <img
                          src={`http://localhost/destinix/api/uploads/${restaurante.img}`}
                          alt="Restaurante"
                          width="80"
                          height="60"
                          className="img-thumbnail"
                        />
                      ) : "Sin imagen"}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(restaurante)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(restaurante.id_restaurante)}>
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
        id="modalRestaurante"
        tabIndex="-1"
        aria-labelledby="modalRestauranteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalRestauranteLabel">
                  {editando ? "Editar Restaurante" : "Registrar Restaurante"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Título del Restaurante</label>
                    <input
                      type="text"
                      className="form-control"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
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
                    <label className="form-label">Empresa</label>
                    <select
                      className="form-select"
                      value={empresaId}
                      onChange={(e) => setEmpresaId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione una empresa</option>
                      {empresas.map((e) => (
                        <option key={e.id_empresa} value={e.id_empresa}>
                          {e.nombre_empresa}
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
                  {editando ? "Actualizar Restaurante" : "Guardar Restaurante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantesForm;
