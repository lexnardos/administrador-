import React, { useState, useEffect } from 'react';
import '../styles/Cards.css';
import { checkSession, addComentario } from '../services/api';
import Swal from 'sweetalert2';  // Importa SweetAlert

const Card = ({ sitio, comentarios = [], setComentarios }) => {
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
            id_sitio: sitio.id_sitio,
            contenido: comentario,
            id_calificacion: calificacion,
        };

        try {
            const response = await addComentario(nuevoComentario);

            if (response.success) {
                setComentarios(prev => [...prev, { comentario, calificacion }]);
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
                    {sitio.img_sitio && (
                        <img className="card-img" src={sitio.img_sitio} alt={sitio.nombre_sitio} />
                    )}
                    <div className="card-body">
                        <h5 className="card-title">{sitio.nombre_sitio || "Cargando..."}</h5>
                        <p className="card-description">{sitio.desc_sitio}</p>
                        <button className="read-more-button" onClick={() => setShowModal(true)}>
                            Leer más
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{sitio.nombre_sitio}</h2>
                        {sitio.img_sitio && (
                            <img className="card-img" src={sitio.img_sitio} alt={sitio.nombre_sitio} />
                        )}
                        <p className="modal-description">{sitio.desc_sitio}</p>
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

export default Card;
