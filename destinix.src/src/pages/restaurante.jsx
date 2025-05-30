import React, { useState, useEffect } from "react";
import { getRestaurantes, addComentario } from "../services/api";
import CardRestaurante from '../components/cardrestaurantes';
import Swal from 'sweetalert2';

const Restaurantes = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        getRestaurantes()
            .then(data => {
              
                setRestaurantes(data);
            })
            .catch(err => {
                console.error("Error al cargar restaurantes:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al cargar los restaurantes.',
                });
            });
    }, []);

    const enviarComentario = async (e, comentario, calificacion, usuario, id_restaurante) => {
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
            id_restaurante: id_restaurante,
            contenido: comentario,
            id_calificacion: calificacion,
        };

        try {
            const response = await addComentario(nuevoComentario);
            if (response.success) {
                setComentarios(prev => [
                    ...prev,
                    { comentario, calificacion, id_restaurante }
                ]);
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
        <div className="sitio-turistico-container">
            {restaurantes.length > 0 ? (
                restaurantes.map(rest => (
                    <CardRestaurante
                        key={rest.id_restaurante}
                        restaurante={rest}
                        comentarios={comentarios}
                        setComentarios={setComentarios}
                        enviarComentario={enviarComentario}
                    />
                ))
            ) : (
                <p>No se encontraron restaurantes.</p>
            )}
        </div>
    );
};

export default Restaurantes;
