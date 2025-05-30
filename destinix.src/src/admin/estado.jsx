import React, { useEffect, useState } from "react";
import {
    getEstados,
    addEstado,
    updateEstado,
    deleteEstado,
} from "../services/api"; // Asegúrate de que la ruta sea correcta

const Estado = () => {
    const [estados, setEstados] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    const cargarEstados = async () => {
        const data = await getEstados();
        setEstados(data);
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return; 
    if (editandoId) {
        await updateEstado(editandoId, descripcion);
    } else {
        await addEstado(descripcion);
    }

    setDescripcion("");
    setEditandoId(null);
    cargarEstados();
};


    const handleEditar = (estado) => {
        setDescripcion(estado.desc_estado);
        setEditandoId(estado.id_estado);
    };

    const handleEliminar = async (id) => {
        await deleteEstado(id);
        cargarEstados();
    };

    useEffect(() => {
        cargarEstados();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Estados</h2>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="border p-2 rounded w-64"
                    placeholder="Descripción del estado"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editandoId ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estados.map((estado) => (
                        <tr key={estado.id_estado}>
                            <td className="p-2 border">{estado.id_estado}</td>
                            <td className="p-2 border">{estado.desc_estado}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleEditar(estado)}
                                    className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(estado.id_estado)}
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

export default Estado;
