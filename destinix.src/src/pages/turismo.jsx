import React, { useState, useEffect } from "react";
import { getSitioTuristico, addComentario } from "../services/api";
import Card from '../components/cards';  // Importa el componente Card
import Swal from 'sweetalert2';

const SitioTuristico = () => {
    const [sitio, setSitio] = useState([]); // Usamos un array aquí
    const [comentarios, setComentarios] = useState([]); // Nuevo estado para los comentarios

    useEffect(() => {
        getSitioTuristico()
            .then(data => {
    
                // Verificar que 'data' es un array y tiene elementos
                if (Array.isArray(data) && data.length > 0) {
                    setSitio(data); // Establecer los datos en el estado
                } else {
                    console.warn("No se encontraron sitios turísticos.");
                    setSitio([]); // Asegurarse de que sitio sea un array vacío si no hay datos
                }
            })
            .catch(err => {
                console.error("Error al cargar sitios:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al cargar los sitios turísticos.',
                });
            });
    }, []);
    
    // Manejo de casos donde no hay datos disponibles
    if (!sitio || sitio.length === 0) {
        return <p>Cargando...</p>;
    }

    // Validación por si el sitio no tiene el formato correcto
    if (!sitio[0].id_sitio) {
        Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener el sitio turístico.',
        });
        return;
    }

    const enviarComentario = async (e, comentario, calificacion, usuario) => {
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
                setComentarios(prevComentarios => [
                    ...prevComentarios,
                    { comentario, calificacion }
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
            {sitio && sitio.length > 0 ? (
                sitio.map((s) => (
                    <Card
                        key={s.id_sitio}
                        sitio={s} // Pasa cada sitio como props
                        comentarios={comentarios}
                        setComentarios={setComentarios}
                        enviarComentario={enviarComentario}
                    />
                ))
            ) : (
                <p>No se encontraron sitios turísticos.</p>
            )}
        </div>
    );
};

export default SitioTuristico;
