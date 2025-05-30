import React, { useState, useEffect } from 'react';
import '../styles/Cards.css';
import { checkSession, addComentario, getComentariosByHotel } from '../services/api';
import Swal from 'sweetalert2';

const CardHotel = ({ hotel }) => {
    const [showModal, setShowModal] = useState(false);
    const [comentario, setComentario] = useState('');
    const [calificacion, setCalificacion] = useState(0);
    const [usuario, setUsuario] = useState(null);
    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await checkSession();
            setUsuario(session.loggedIn ? session.id_persona : null);
        };
        fetchSession();
    }, []);

    const obtenerComentarios = async () => {
        try {
            const response = await getComentariosByHotel(hotel.id_hoteles);
            if (response.success && Array.isArray(response.data)) {
                setComentarios(response.data);
            }
        } catch (error) {
            console.error("Error al obtener comentarios:", error);
        }
    };

    const abrirModal = async () => {
        await obtenerComentarios();
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    const enviarComentario = async (e) => {
        e.preventDefault();

        if (!usuario) {
            Swal.fire({
                icon: 'error',
                title: 'Debes iniciar sesión para comentar.',
            });
            return;
        }

        const nuevoComentario = {
            persona_id_persona: usuario,
            id_hoteles: hotel.id_hoteles,
            contenido: comentario,
            id_calificacion: calificacion,
        };

        try {
            const response = await addComentario(nuevoComentario);

            if (response.success) {
                await obtenerComentarios(); // Recargar comentarios desde backend
                setComentario('');
                setCalificacion(0);

                Swal.fire({
                    icon: 'success',
                    title: 'Comentario enviado correctamente.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar comentario.',
                    text: response.message || 'Hubo un problema al procesar tu comentario.',
                });
            }
        } catch (error) {
            console.error("Error enviando comentario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error al enviar tu comentario.',
            });
        }
    };

    return (
        <>
            <div className="card-container">
                <div className="card">
                    {hotel.img && (
                        <img className="card-img" src={hotel.img} alt={hotel.titulo_hotel} />
                    )}
                    <div className="card-body">
                        <h5 className="card-title">{hotel.titulo_hotel || "Cargando..."}</h5>
                        <p className="card-description">{hotel.descripcion_hotel}</p>
                        <button className="read-more-button" onClick={abrirModal}>
                            Leer más
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{hotel.titulo_hotel}</h2>
                        {hotel.img && (
                            <img className="card-img" src={hotel.img} alt={hotel.titulo_hotel} />
                        )}
                        <p className="modal-description">{hotel.descripcion_hotel}</p>
                        <h3 className="modal-subtitle">Comentarios:</h3>
                        {comentarios.length > 0 ? (
                            <ul className="comment-list">
                                {comentarios.map((coment, index) => (
                                    <li key={index} className="comment-item">
                                        <strong>Calificación:</strong> {coment.id_calificacion} ★<br />
                                        <span>{coment.contenido}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay comentarios aún.</p>
                        )}

                        <form onSubmit={enviarComentario} className="comment-form">
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Escribe tu comentario"
                                required
                            ></textarea>

                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= calificacion ? "filled" : ""}`}
                                        onClick={() => setCalificacion(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <button className="read-more-button" type="submit">
                                Enviar Comentario
                            </button>
                        </form>

                        <button className="close-button" onClick={cerrarModal}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardHotel;
