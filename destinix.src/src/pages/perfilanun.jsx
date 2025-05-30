import React, { useEffect, useState } from "react";
import { getPerfilAnunciante, editPerfilAnunciante, registrarHotel, getHoteles } from "../services/api";
import LogoutButton from "../components/logout";
import Swal from 'sweetalert2';

import styles from "../styles/PerfilAnunciante.module.css";

const PerfilAnunciante = () => {
    const [perfil, setPerfil] = useState(null);
    const [hoteles, setHoteles] = useState([]);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({});
    const [hotelForm, setHotelForm] = useState({
        titulo_hotel: "",
        descripcion_hotel: "",
        img: null,
    });
    const [previewHotel, setPreviewHotel] = useState(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            const data = await getPerfilAnunciante();
            setPerfil(data);
            setFormData(data);
        };

        const fetchHoteles = async () => {
            try {
                const data = await getHoteles();
                setHoteles(data);
            } catch (error) {
                console.error("Error al obtener los hoteles:", error);
            }
        };

        fetchPerfil();
        fetchHoteles();
    }, []);

    const handleHotelChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setHotelForm({ ...hotelForm, [name]: files[0] });
            setPreviewHotel(URL.createObjectURL(files[0]));
        } else {
            setHotelForm({ ...hotelForm, [name]: value });
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmitHotel = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in hotelForm) {
            data.append(key, hotelForm[key]);
        }

        try {
            await registrarHotel(data);
            Swal.fire("¡Publicado!", "El hotel ha sido registrado correctamente.", "success");
            setHotelForm({ titulo_hotel: "", descripcion_hotel: "", img: null });
            setPreviewHotel(null);
        } catch (error) {
            console.error("Error al registrar hotel:", error);
            Swal.fire("Error", "Hubo un problema al registrar el hotel.", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        for (const key in formData) {
            updatedData.append(key, formData[key]);
        }

        try {
            const updatedPerfil = await editPerfilAnunciante(updatedData);

            Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado',
                text: 'Los cambios han sido guardados correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload();
            });

            setPerfil(updatedPerfil);
            setEditando(false);
        } catch (error) {
            console.error("Error actualizando:", error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: 'Hubo un problema al actualizar tu perfil.',
            });
        }
    };

    if (!perfil) return <p>Cargando perfil...</p>;
    if (perfil.error) return <p>{perfil.error}</p>;

    return (
        <div className={styles.perfilContainer}>
            {/* Sección del perfil */}
            <div className={styles.seccionPerfil}>
                <h2 className={styles.titulo}>Perfil de <p>{perfil.nombre_usu} {perfil.apellido_usu}</p></h2>
                <img src={perfil.foto_perfil} alt="Perfil" className={styles.imgPerfil} />
                {!editando ? (
                    <>
                        <div className={styles.infoBloque}>
                            <p><strong>Nombre:</strong> {perfil.nombre_usu} {perfil.apellido_usu}</p>
                            <p><strong>Email:</strong> {perfil.email_usu}</p>
                            <p><strong>Teléfono:</strong> {perfil.telefono_usu}</p>
                        </div>

                        <h3>Empresa</h3>
                        <div className={styles.infoBloque}>
                            <p><strong>Nombre:</strong> {perfil.nombre_emp}</p>
                            <p><strong>Dirección:</strong> {perfil.direccion_emp}</p>
                            <p><strong>Email empresa:</strong> {perfil.correo_empresa}</p>
                            <p><strong>Teléfono empresa:</strong> {perfil.telefono_empresa}</p>
                            <p><strong>Categoría:</strong> {perfil.nombre_cate || "Sin categoría"}</p>
                        </div>

                        <button onClick={() => setEditando(true)} className={styles.botonEditar}>Editar perfil</button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.formEditar}>
                        <h3>Información personal</h3>
                        <input type="text" name="nombre_usu" value={formData.nombre_usu || ''} onChange={handleChange} placeholder="Nombre" />
                        <input type="text" name="apellido_usu" value={formData.apellido_usu || ''} onChange={handleChange} placeholder="Apellido" />
                        <input type="email" name="email_usu" value={formData.email_usu || ''} onChange={handleChange} placeholder="Email" />
                        <input type="text" name="telefono_usu" value={formData.telefono_usu || ''} onChange={handleChange} placeholder="Teléfono" />
                        <input type="file" name="foto_perfil" onChange={handleChange} />

                        <h3>Información de la empresa</h3>
                        <input type="text" name="nombre_emp" value={formData.nombre_emp || ''} onChange={handleChange} placeholder="Nombre empresa" />
                        <input type="text" name="direccion_emp" value={formData.direccion_emp || ''} onChange={handleChange} placeholder="Dirección" />
                        <input type="email" name="correo_empresa" value={formData.correo_empresa || ''} onChange={handleChange} placeholder="Email empresa" />
                        <input type="text" name="telefono_empresa" value={formData.telefono_empresa || ''} onChange={handleChange} placeholder="Teléfono empresa" />

                        <div className={styles.botones}>
                            <button type="submit" className={styles.botonGuardar}>Guardar</button>
                            <button type="button" onClick={() => setEditando(false)} className={styles.botonCancelar}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Sección para registrar nuevo hotel */}
            <div className={styles.seccionFormulario}>
                <h3>Publicar nuevo hotel</h3>
                <form onSubmit={handleSubmitHotel} className={styles.formHotel}>
                    <input
                        type="text"
                        name="titulo_hotel"
                        placeholder="Título del hotel"
                        value={hotelForm.titulo_hotel}
                        onChange={handleHotelChange}
                        required
                    />
                    <textarea
                        name="descripcion_hotel"
                        placeholder="Descripción del hotel"
                        value={hotelForm.descripcion_hotel}
                        onChange={handleHotelChange}
                        required
                    />
                    <input type="file" name="img" accept="image/*" onChange={handleHotelChange} required />

                    {previewHotel && (
                        <div className={styles.preview}>
                            <h4>Previsualización</h4>
                            <img src={previewHotel} alt="Previsualización del hotel" />
                            <p><strong>{hotelForm.titulo_hotel}</strong></p>
                            <p>{hotelForm.descripcion_hotel}</p>
                        </div>
                    )}

                    <button type="submit">Publicar hotel</button>
                </form>
            </div>

            {/* Sección de hoteles publicados */}
            <div className={styles.seccionHoteles}>
                <h3>Hoteles publicados</h3>
                <div className={styles.listaHoteles}>
                    {hoteles.length > 0 ? (
                        hoteles.map((hotel) => (
                            <div key={hotel.id_hotel} className={styles.hotelItem}>
                                <img src={hotel.img} alt={hotel.titulo_hotel} />
                                <h4>{hotel.titulo_hotel}</h4>
                                <p>{hotel.descripcion_hotel}</p>
                            </div>
                        ))
                    ) : (
                        <p>No has publicado hoteles aún.</p>
                    )}
                </div>
            </div>

            <LogoutButton />
        </div>
    );
};

export default PerfilAnunciante;
