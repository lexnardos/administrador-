// src/components/CategoriaForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;

const CategoriaForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(false);
  const [categoriaEditandoId, setCategoriaEditandoId] = useState(null);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = () => {
    axios
      .get("http://localhost/destinix/api/Categoria/CategoriaController.php")
      .then((res) => setCategorias(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error al obtener categorías:", err);
        setCategorias([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre_cate", nombre);
    formData.append("desc_cate", descripcion);

    try {
      if (editando) {
        formData.append("id_categoria", categoriaEditandoId);
        await axios.post(
          "http://localhost/destinix/api/Categoria/CategoriaController.php?editar=1",
          formData
        );
        alert("Categoría actualizada correctamente");
      } else {
        await axios.post(
          "http://localhost/destinix/api/Categoria/CategoriaController.php",
          formData
        );
        alert("Categoría registrada exitosamente");
      }

      resetFormulario();
      obtenerCategorias();
      document.getElementById("cerrarModal").click();
    } catch (error) {
      console.error("Error al enviar categoría:", error);
    }
  };

  const handleEditar = (categoria) => {
    setEditando(true);
    setCategoriaEditandoId(categoria.id_categoria);
    setNombre(categoria.nombre_cate);
    setDescripcion(categoria.desc_cate);

    const modalElement = document.getElementById("modalCategoria");
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await axios.delete(
          `http://localhost/destinix/api/Categoria/CategoriaController.php?id=${id}`
        );
        obtenerCategorias();
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    }
  };

  const resetFormulario = () => {
    setNombre("");
    setDescripcion("");
    setEditando(false);
    setCategoriaEditandoId(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Gestión de Categorías</h2>
        <button
          className="btn btn-success px-4"
          data-bs-toggle="modal"
          data-bs-target="#modalCategoria"
          onClick={resetFormulario}
        >
          Ingresar Categoría
        </button>
      </div>

      <div className="card shadow p-3">
        <h4 className="text-center mb-3">Categorías Registradas</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay categorías registradas
                  </td>
                </tr>
              ) : (
                categorias.map((categoria) => (
                  <tr key={categoria.id_categoria}>
                    <td>{categoria.nombre_cate}</td>
                    <td>{categoria.desc_cate}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditar(categoria)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(categoria.id_categoria)}
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
        id="modalCategoria"
        tabIndex="-1"
        aria-labelledby="modalCategoriaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalCategoriaLabel">
                  {editando ? "Editar Categoría" : "Registrar Categoría"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre de la Categoría</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="cerrarModal"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {editando ? "Actualizar Categoría" : "Guardar Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriaForm;
