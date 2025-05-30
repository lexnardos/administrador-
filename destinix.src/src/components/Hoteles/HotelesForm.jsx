import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

const HotelesForm = () => {
  const [titulo, setTitulo] = useState("");
  const [img, setImg] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [estadoId, setEstadoId] = useState("");
  const [editando, setEditando] = useState(false);
  const [hotelEditandoId, setHotelEditandoId] = useState(null);

  const [empresas, setEmpresas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost/destinix/obtener_empresa.php")
      .then(res => setEmpresas(res.data))
      .catch(err => console.error("Error al obtener empresas:", err));

    axios.get("http://localhost/destinix/obtener_estado.php")
      .then(res => setEstados(res.data))
      .catch(err => console.error("Error al obtener estados:", err));

    obtenerHoteles();
  }, []);

  const obtenerHoteles = () => {
    axios.get("http://localhost/destinix/api/Hoteles/HotelesController.php")
      .then(res => setHoteles(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Error al obtener hoteles:", err);
        setHoteles([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo_hotel", titulo);
    formData.append("descripcion_hotel", descripcion);
    formData.append("empresa_id_empresa", empresaId);
    formData.append("estado_id_estado", estadoId);
    if (img) formData.append("img", img);

    try {
      if (editando) {
        formData.append("id_hoteles", hotelEditandoId);
        await axios.post("http://localhost/destinix/api/Hoteles/HotelesController.php?editar=1", formData);
        alert("Hotel actualizado correctamente");
      } else {
        await axios.post("http://localhost/destinix/api/Hoteles/HotelesController.php", formData);
        alert("Hotel registrado exitosamente");
      }

      resetFormulario();
      obtenerHoteles();

      const modalElement = document.getElementById("modalHotel");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    } catch (error) {
      console.error("Error al enviar hotel:", error);
    }
  };

  const handleEditar = (hotel) => {
    setEditando(true);
    setHotelEditandoId(hotel.id_hoteles);
    setTitulo(hotel.titulo_hotel);
    setDescripcion(hotel.descripcion_hotel);
    setEmpresaId(hotel.empresa_id_empresa);
    setEstadoId(hotel.estado_id_estado);
    setImg(null);

    const modalElement = document.getElementById("modalHotel");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este hotel?")) {
      try {
        await axios.delete(`http://localhost/destinix/api/Hoteles/HotelesController.php?id=${id}`);
        obtenerHoteles();
      } catch (error) {
        console.error("Error al eliminar el hotel:", error);
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
    setHotelEditandoId(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Gestión de Hoteles</h2>
        <button
          className="btn btn-success px-4"
          data-bs-toggle="modal"
          data-bs-target="#modalHotel"
          onClick={resetFormulario}
        >
          Ingresar Hotel
        </button>
      </div>

      <div className="card custom-card shadow p-3">
        <h4 className="text-center mb-3">Hoteles Registrados</h4>
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
              {hoteles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No hay hoteles registrados</td>
                </tr>
              ) : (
                hoteles.map((hotel) => (
                  <tr key={hotel.id_hoteles}>
                    <td>{hotel.titulo_hotel}</td>
                    <td>{hotel.descripcion_hotel}</td>
                    <td>{hotel.desc_estado || "N/A"}</td>
                    <td>{hotel.nombre_empresa || "N/A"}</td>
                    <td>
                      {hotel.img ? (
                        <img
                          src={`http://localhost/destinix/api/uploads/${hotel.img}`}
                          alt="Hotel"
                          width="80"
                          height="60"
                          className="img-thumbnail"
                        />
                      ) : "Sin imagen"}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(hotel)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(hotel.id_hoteles)}>
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
      <div className="modal fade" id="modalHotel" tabIndex="-1" aria-labelledby="modalHotelLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalHotelLabel">
                  {editando ? "Editar Hotel" : "Registrar Hotel"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Título del Hotel</label>
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
                      required={!editando}
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
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="cerrarModal">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {editando ? "Actualizar Hotel" : "Guardar Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelesForm;
