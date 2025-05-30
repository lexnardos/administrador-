import React, { useEffect, useState } from "react";
import {
    getRestaurantes,
    addRestaurante,
    updateRestaurante,
    deleteRestaurante
} from "../services/api"; // Asegúrate de que estos métodos estén implementados correctamente

const Restaurantes = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [form, setForm] = useState({
        titulo_restaurante: "",
        img: null,
        desc_restaurantes: "",
        estado_id_estado: "",
        empresa_id_empresa: "",
    });
    const [editando, setEditando] = useState(null);

    const cargarRestaurantes = async () => {
        const data = await getRestaurantes();
        setRestaurantes(data);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editando) {
            await updateRestaurante(editando, form);
        } else {
            await addRestaurante(form);
        }

        setForm({
            titulo_restaurante: "",
            img: null,
            desc_restaurantes: "",
            estado_id_estado: "",
            empresa_id_empresa: "",
        });
        setEditando(null);
        cargarRestaurantes();
    };

    const handleEditar = (restaurante) => {
        setForm({
            titulo_restaurante: restaurante.titulo_restaurante,
            img: null,
            desc_restaurantes: restaurante.desc_restaurantes,
            estado_id_estado: restaurante.estado_id_estado,
            empresa_id_empresa: restaurante.empresa_id_empresa,
        });
        setEditando(restaurante.id_restaurante);
    };

    const handleEliminar = async (id) => {
        await deleteRestaurante(id);
        cargarRestaurantes();
    };

    useEffect(() => {
        cargarRestaurantes();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Restaurantes</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    name="titulo_restaurante"
                    value={form.titulo_restaurante}
                    onChange={handleChange}
                    placeholder="Título del Restaurante"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="file"
                    name="img"
                    onChange={handleChange}
                    className="border p-2 rounded"
                    accept="image/*"
                    required={!editando}
                />
                <input
                    type="text"
                    name="desc_restaurantes"
                    value={form.desc_restaurantes}
                    onChange={handleChange}
                    placeholder="Descripción del Restaurante"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="estado_id_estado"
                    value={form.estado_id_estado}
                    onChange={handleChange}
                    placeholder="ID Estado"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="empresa_id_empresa"
                    value={form.empresa_id_empresa}
                    onChange={handleChange}
                    placeholder="ID Empresa"
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Título</th>
                        <th className="p-2 border">Imagen</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Estado</th>
                        <th className="p-2 border">Empresa</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurantes.map((rest) => (
                        <tr key={rest.id_restaurante}>
                            <td className="p-2 border">{rest.id_restaurante}</td>
                            <td className="p-2 border">{rest.titulo_restaurante}</td>
                            <td className="p-2 border">
                                <img
                                    src={rest.img}
                                    alt={rest.titulo_restaurante}
                                    className="w-16 h-16 object-cover"
                                />
                            </td>
                            <td className="p-2 border">{rest.desc_restaurantes}</td>
                            <td className="p-2 border">{rest.estado_id_estado}</td>
                            <td className="p-2 border">{rest.empresa_id_empresa}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleEditar(rest)}
                                    className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(rest.id_restaurante)}
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

export default Restaurantes;
