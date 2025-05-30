import React, { useState, useEffect } from "react";
import { fetchUsuario, editUser } from "../services/api";
import Swal from 'sweetalert2';
import "../styles/PerfilUsu.css";

const PerfilUsu = () => {
    const [usuario, setUsuario] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nombre_usu: "",
        apellido_usu: "",
        email_usu: "",
        localidad: "",
        telefono_usu: "", // ➕ Nuevo campo
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const data = await fetchUsuario();
                setUsuario(data);
                setFormData({
                    nombre_usu: data.nombre_usu,
                    apellido_usu: data.apellido_usu,
                    email_usu: data.email_usu,
                    localidad: data.localidad,
                    telefono_usu: data.telefono_usu || "", // ➕
                });
            } catch (error) {
                console.error("Error cargando usuario:", error);
            }
        };

        cargarUsuario();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSave = async () => {
        try {
            const dataToSend = new FormData();
            dataToSend.append('nombre_usu', formData.nombre_usu);
            dataToSend.append('apellido_usu', formData.apellido_usu);
            dataToSend.append('email_usu', formData.email_usu);
            dataToSend.append('localidad', formData.localidad);
            dataToSend.append('telefono_usu', formData.telefono_usu);
            if (selectedFile) {
                dataToSend.append('foto_perfil', selectedFile);
            }
    
            

            if (!/^\d{10}$/.test(formData.telefono_usu)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Número inválido',
                    text: 'El número debe tener exactamente 9 dígitos.',
                    confirmButtonColor: '#d33',
                });
                return;
            }
    
            const result = await editUser(dataToSend);
    


            if (result.error) {
                throw new Error(result.error);
            }

            setUsuario({
                ...usuario,
                ...formData,
                foto_perfil: result.foto_perfil !== null ? result.foto_perfil : usuario.foto_perfil
            });

            setEditMode(false);
            setSelectedFile(null);

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Perfil actualizado correctamente.',
                confirmButtonColor: '#3085d6',
            });
        } catch (error) {
            console.error("Error editando usuario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al actualizar el perfil.',
                confirmButtonColor: '#d33',
            });
        }
    };

    if (!usuario) {
        return <p>Cargando perfil...</p>;
    }

    const fotoPerfilUrl = usuario.foto_perfil
        ? usuario.foto_perfil
        : "https://via.placeholder.com/150";

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <img src={fotoPerfilUrl} alt="Foto de perfil" className="perfil-foto" />
                <h2>Perfil de Usuario</h2>

                {editMode ? (
                    <>
                        <input
                            type="text"
                            name="nombre_usu"
                            value={formData.nombre_usu}
                            onChange={handleChange}
                            placeholder="Nombres"
                            className="perfil-input"
                        />
                        <input
                            type="text"
                            name="apellido_usu"
                            value={formData.apellido_usu}
                            onChange={handleChange}
                            placeholder="Apellidos"
                            className="perfil-input"
                        />
                        <input
                            type="email"
                            name="email_usu"
                            value={formData.email_usu}
                            onChange={handleChange}
                            placeholder="Correo"
                            className="perfil-input"
                        />
                        <input
                            type="text"
                            name="telefono_usu"
                            value={formData.telefono_usu}
                            onChange={handleChange}
                            placeholder="Número de Teléfono"
                            className="perfil-input"
                        />
                        <input
                            type="text"
                            name="localidad"
                            value={formData.localidad}
                            onChange={handleChange}
                            placeholder="Localidad"
                            className="perfil-input"
                        />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="perfil-input"
                        />

                        <div className="botones-accion">
                            <button onClick={handleSave} className="guardar-btn">Guardar</button>
                            <button onClick={() => setEditMode(false)} className="cancelar-btn">Cancelar</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong>Nombre:</strong> {usuario.nombre_usu} {usuario.apellido_usu}</p>
                        <p><strong>Correo:</strong> {usuario.email_usu}</p>
                        <p><strong>📞 Número:</strong> {usuario.telefono_usu}</p>
                        <p><strong>Localidad:</strong> {usuario.localidad}</p>

                        <button onClick={() => setEditMode(true)} className="editar-btn">Editar Perfil</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PerfilUsu;
