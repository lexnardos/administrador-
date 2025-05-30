import React, { useEffect, useState } from "react";
import {
    getCategoria,
    addCategoria,
    updateCategoria,
    deleteCategoria,
} from "../services/api";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreCate, setNombreCate] = useState("");
    const [descCate, setDescCate] = useState("");
    const [editando, setEditando] = useState(null);        

    const cargarCategorias = async () => {
        const data = await getCategoria();
        setCategorias(data);    
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editando) {
            await updateCategoria(editando, nombreCate, descCate);
        } else {
            await addCategoria(nombreCate, descCate);
        }

        setNombreCate("");
        setDescCate("");
        setEditando(null);
        cargarCategorias();
    };

    const handleEditar = (categoria) => {
        setNombreCate(categoria.nombre_cate);
        setDescCate(categoria.desc_cate);
        setEditando(categoria.id_categoria);
    };

    const handleEliminar = async (id) => {
        await deleteCategoria(id);
        cargarCategorias();
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Categorías</h2>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
                <input
                    type="text"
                    value={nombreCate}
                    onChange={(e) => setNombreCate(e.target.value)}
                    className="border p-2 rounded w-40"
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    value={descCate}
                    onChange={(e) => setDescCate(e.target.value)}
                    className="border p-2 rounded w-60"
                    placeholder="Descripción"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((cat) => (
                        <tr key={cat.id_categoria}>
                            <td className="p-2 border">{cat.id_categoria}</td>
                            <td className="p-2 border">{cat.nombre_cate}</td>
                            <td className="p-2 border">{cat.desc_cate}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleEditar(cat)}
                                    className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(cat.id_categoria)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Categorias;
