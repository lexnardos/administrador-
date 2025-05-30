import React, { useEffect, useState } from "react";
import {
    getPersonas,
    addPersona,
    updatePersona,
    deletePersona
} from "../services/api"; // Asegúrate de que estos métodos estén implementados correctamente

const Persona = () => {
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
        id_seguridad: "",
        rol_idRol: "",
        foto_perfil: null,
    });
    const [editando, setEditando] = useState(null);

    const cargarPersonas = async () => {
        const data = await getPersonas();
        setPersonas(data);
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
            await updatePersona(editando, form);
        } else {
            await addPersona(form);
        }

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
            id_seguridad: "",
            rol_idRol: "",
            foto_perfil: null,
        });
        setEditando(null);
        cargarPersonas();
    };

    const handleEditar = (persona) => {
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
            id_seguridad: persona.id_seguridad,
            rol_idRol: persona.rol_idRol,
            foto_perfil: null,
        });
        setEditando(persona.id_persona);
    };

    const handleEliminar = async (id) => {
        await deletePersona(id);
        cargarPersonas();
    };

    useEffect(() => {
        cargarPersonas();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Personas</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" name="nombre_usu" value={form.nombre_usu} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" required />
                <input type="text" name="apellido_usu" value={form.apellido_usu} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" required />
                <input type="text" name="tipo_documento" value={form.tipo_documento} onChange={handleChange} placeholder="Tipo de Documento" className="border p-2 rounded" required />
                <input type="text" name="documento" value={form.documento} onChange={handleChange} placeholder="Documento" className="border p-2 rounded" required />
                <input type="email" name="email_usu" value={form.email_usu} onChange={handleChange} placeholder="Correo Electrónico" className="border p-2 rounded" required />
                <input type="text" name="telefono_usu" value={form.telefono_usu} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded" required />
                <input type="text" name="genero" value={form.genero} onChange={handleChange} placeholder="Género" className="border p-2 rounded" required />
                <input type="text" name="localidad" value={form.localidad} onChange={handleChange} placeholder="Localidad" className="border p-2 rounded" required />
                <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} className="border p-2 rounded" required />
                <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" className="border p-2 rounded" required />
                <input type="number" name="id_seguridad" value={form.id_seguridad} onChange={handleChange} placeholder="ID Seguridad" className="border p-2 rounded" required />
                <input type="number" name="rol_idRol" value={form.rol_idRol} onChange={handleChange} placeholder="ID Rol" className="border p-2 rounded" required />
                <input type="file" name="foto_perfil" onChange={handleChange} className="border p-2 rounded" accept="image/*" required={!editando} />
                <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Apellido</th>
                        <th className="p-2 border">Documento</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Teléfono</th>
                        <th className="p-2 border">Género</th>
                        <th className="p-2 border">Localidad</th>
                        <th className="p-2 border">Nacimiento</th>
                        <th className="p-2 border">Foto</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {personas.map((persona) => (
                        <tr key={persona.id_persona}>
                            <td className="p-2 border">{persona.id_persona}</td>
                            <td className="p-2 border">{persona.nombre_usu}</td>
                            <td className="p-2 border">{persona.apellido_usu}</td>
                            <td className="p-2 border">{persona.documento}</td>
                            <td className="p-2 border">{persona.email_usu}</td>
                            <td className="p-2 border">{persona.telefono_usu}</td>
                            <td className="p-2 border">{persona.genero}</td>
                            <td className="p-2 border">{persona.localidad}</td>
                            <td className="p-2 border">{persona.fecha_nacimiento}</td>
                            <td className="p-2 border">
                                {persona.foto_perfil && (
                                    <img src={persona.foto_perfil} alt="Perfil" className="w-12 h-12 object-cover rounded-full" />
                                )}
                            </td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleEditar(persona)}
                                    className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(persona.id_persona)}
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

export default Persona;
