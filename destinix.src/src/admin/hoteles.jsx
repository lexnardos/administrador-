import React, { useEffect, useState } from "react";
import {
    gethoteles,
    addHoteles,
    updatehoteles,
    deletehoteles
} from "../services/api";

const Hoteles = () => {
    const [hoteles, setHoteles] = useState([]);
    const [form, setForm] = useState({
        titulo_hotel: "",
        descripcion_hotel: "",
        estado_id_estado: "",
        empresa_id_empresa: "",
        img: null,
    });
    const [editando, setEditando] = useState(null);

    const cargarHoteles = async () => {
        const data = await gethoteles();
        setHoteles(data);
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
        const formData = new FormData();

        formData.append("titulo_hotel", form.titulo_hotel);
        formData.append("descripcion_hotel", form.descripcion_hotel);
        formData.append("estado_id_estado", form.estado_id_estado);
        formData.append("empresa_id_empresa", form.empresa_id_empresa);
        if (form.img) formData.append("img", form.img);

        if (editando) {
            await updatehoteles(editando, form);
        } else {
            await addHoteles(formData);
        }

        setForm({
            titulo_hotel: "",
            descripcion_hotel: "",
            estado_id_estado: "",
            empresa_id_empresa: "",
            img: null,
        });
        setEditando(null);
        cargarHoteles();
    };

    const handleEditar = (hotel) => {
        setForm({
            titulo_hotel: hotel.titulo_hotel,
            descripcion_hotel: hotel.descripcion_hotel,
            estado_id_estado: hotel.estado_id_estado,
            empresa_id_empresa: hotel.empresa_id_empresa,
            img: null,
        });
        setEditando(hotel.id_hoteles);
    };

    const handleEliminar = async (id) => {
        await deletehoteles(id);
        cargarHoteles();
    };

    useEffect(() => {
        cargarHoteles();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Hoteles</h2>

            <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4">
                <input type="text" name="titulo_hotel" value={form.titulo_hotel} onChange={handleChange} placeholder="Título del Hotel" className="border p-2 rounded" required />
                <input type="text" name="descripcion_hotel" value={form.descripcion_hotel} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" required />
                <input type="number" name="estado_id_estado" value={form.estado_id_estado} onChange={handleChange} placeholder="ID Estado" className="border p-2 rounded" required />
                <input type="number" name="empresa_id_empresa" value={form.empresa_id_empresa} onChange={handleChange} placeholder="ID Empresa" className="border p-2 rounded" required />
                <input type="file" name="img" onChange={handleChange} className="border p-2 rounded" accept="image/*" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Título</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">Imagen</th>
                        <th className="p-2 border">Estado ID</th>
                        <th className="p-2 border">Empresa ID</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {hoteles.map((hotel) => (
                        <tr key={hotel.id_hoteles}>
                            <td className="p-2 border">{hotel.id_hoteles}</td>
                            <td className="p-2 border">{hotel.titulo_hotel}</td>
                            <td className="p-2 border">{hotel.descripcion_hotel}</td>
                            <td className="p-2 border">
                                <img src={hotel.img} alt="hotel" className="w-20 h-20 object-cover" />
                            </td>
                            <td className="p-2 border">{hotel.estado_id_estado}</td>
                            <td className="p-2 border">{hotel.empresa_id_empresa}</td>
                            <td className="p-2 border">
                                <button onClick={() => handleEditar(hotel)} className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded">Editar</button>
                                <button onClick={() => handleEliminar(hotel.id_hoteles)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Hoteles;
