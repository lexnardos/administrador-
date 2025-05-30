import React, { useState, useEffect } from 'react';
import '../styles/Cards.css';
import { checkSession, addComentario, getComentariosByrestaurante } from '../services/api';
import Swal from 'sweetalert2';

const CardRestaurante = ({ restaurante, comentarios = [], setComentarios }) => {
    const [showModal, setShowModal] = useState(false);
    const [comentario, setComentario] = useState('');
    const [calificacion, setCalificacion] = useState(0);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await checkSession();
            setUsuario(session.loggedIn ? session.id_persona : null);
        };
        fetchSession();
    }, []);

    const obtenerComentarios = async () => {
            try {
                const response = await getComentariosByrestaurante(restaurante.id_restaurante);
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
            id_restaurante: restaurante.id_restaurante, // ✅ Aquí usamos el ID del restaurante
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
                    {restaurante.img && (
                        <img className="card-img" src={restaurante.img} alt={restaurante.titulo_restaurante} />
                    )}
                    <div className="card-body">
                        <h5 className="card-title">{restaurante.titulo_restaurante || "Cargando..."}</h5>
                        <p className="card-description">{restaurante.desc_restaurantes}</p>
                        <button className="read-more-button" onClick={abrirModal}>
                            Leer más
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{restaurante.titulo_restaurante}</h2>
                        {restaurante.img && (
                            <img className="card-img" src={restaurante.img} alt={restaurante.titulo_restaurante} />
                        )}
                        <p className="modal-description">{restaurante.desc_restaurantes}</p>
                        <h3 className="modal-subtitle">Comentarios:</h3>
                        {comentarios.length > 0 ? (
                            <ul className="comment-list">
                                {comentarios.map((coment, index) => (
                                    <li key={index} className="comment-item">
                                        <strong>Calificación:</strong> {coment.calificacion} ★<br />
                                        <span>{coment.comentario}</span>
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

                        <button className="close-button" onClick={() => setShowModal(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardRestaurante;
