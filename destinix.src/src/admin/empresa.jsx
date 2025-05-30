import React, { useEffect, useState } from "react";
import {
    getEmpresas,
    addEmpresa,
    updateEmpresa,
    deleteEmpresa,
} from "../services/api"; 
const Empresa = () => {
    const [empresas, setEmpresas] = useState([]);
    const [form, setForm] = useState({
        nombre_emp: "",
        direccion_emp: "",
        correo_empresa: "",
        telefono_empresa: "",
        persona_id_persona: "",
        id_categoria: "",
    });
    const [editando, setEditando] = useState(null);

    const cargarEmpresas = async () => {
        const data = await getEmpresas();
        setEmpresas(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando) {
            await updateEmpresa({ ...form, id_empresa: editando });
        } else {
            await addEmpresa(form);
        }
        setForm({
            nombre_emp: "",
            direccion_emp: "",
            correo_empresa: "",
            telefono_empresa: "",
            persona_id_persona: "",
            id_categoria: "",
        });
        setEditando(null);
        cargarEmpresas();
    };

    const handleEditar = (empresa) => {
        setForm({ ...empresa });
        setEditando(empresa.id_empresa);
    };

    const handleEliminar = async (id) => {
        await deleteEmpresa(id);
        cargarEmpresas();
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Empresas</h2>

            <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4">
                <input type="text" name="nombre_emp" value={form.nombre_emp} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" />
                <input type="text" name="direccion_emp" value={form.direccion_emp} onChange={handleChange} placeholder="Dirección" className="border p-2 rounded" />
                <input type="email" name="correo_empresa" value={form.correo_empresa} onChange={handleChange} placeholder="Correo" className="border p-2 rounded" />
                <input type="text" name="telefono_empresa" value={form.telefono_empresa} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded" />
                <input type="number" name="persona_id_persona" value={form.persona_id_persona} onChange={handleChange} placeholder="ID Persona" className="border p-2 rounded" />
                <input type="number" name="id_categoria" value={form.id_categoria} onChange={handleChange} placeholder="ID Categoría" className="border p-2 rounded" />
                <button type="submit" className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Dirección</th>
                        <th className="p-2 border">Correo</th>
                        <th className="p-2 border">Teléfono</th>
                        <th className="p-2 border">ID Persona</th>
                        <th className="p-2 border">ID Categoría</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((emp) => (
                        <tr key={emp.id_empresa}>
                            <td className="p-2 border">{emp.id_empresa}</td>
                            <td className="p-2 border">{emp.nombre_emp}</td>
                            <td className="p-2 border">{emp.direccion_emp}</td>
                            <td className="p-2 border">{emp.correo_empresa}</td>
                            <td className="p-2 border">{emp.telefono_empresa}</td>
                            <td className="p-2 border">{emp.persona_id_persona}</td>
                            <td className="p-2 border">{emp.id_categoria}</td>
                            <td className="p-2 border">
                                <button onClick={() => handleEditar(emp)} className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded">Editar</button>
                                <button onClick={() => handleEliminar(emp.id_empresa)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Empresa;
