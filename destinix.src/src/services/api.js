export async function registerUser(data) {
    const response = await fetch("http://localhost/destinix/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message);
    }

    return result;
}

export const loginUser = async (email, contraseña) => {
    try {
        const response = await fetch("http://localhost/destinix/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password: contraseña }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("rol", data.rol_idRol);
        }

        return data;
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

export const Dashboard = async () => {
    try {
        const response = await fetch("http://localhost/destinix/dashboard.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en Dashboard:", error);
        throw error;
    }
};

const API_URL = "http://localhost/destinix/itinerario.php";

export const getItinerario = async () => {
    const response = await fetch(API_URL, {
        credentials: "include"
    });
    return response.json();
};

export const addEvento = async (evento) => {
    const response = await fetch("http://localhost/destinix/itinerario.php", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento),
    });

    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return { error: "Respuesta no válida del servidor" };
    }
};

export const deleteEvento = async (id) => {
    const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    return response.json();
};

export const logoutUser = async () => {
    try {
        const response = await fetch("http://localhost/destinix/logout.php", {
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
    }
};

export const addComentario = async (comentarioData) => {
    try {
        const response = await fetch("http://localhost/destinix/comentarios.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(comentarioData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al enviar comentario:", error);
        throw error;
    }
};

export async function getSitioTuristico() {
    try {
        const response = await fetch('http://localhost/destinix/sitios.php', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar sitios turísticos:', error);
        return [];
    }
}

export async function guardarComentario(data) {
    try {
        const datos = {
            persona_id_persona: data.persona_id_persona,
            contenido: data.contenido,
            id_calificacion: data.id_calificacion
        };

        const response = await fetch('http://localhost/destinix/comentarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error en la petición:", error);
        return { success: false, message: "Error de conexión." };
    }
}

export const getComentariosBySitio = async (id_sitio) => {
    try {
        const response = await fetch(`http://localhost/destinix/comentarios.php?id_sitio=${id_sitio}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return [];
    }
};

export const checkSession = async () => {
    try {
        const response = await fetch("http://localhost/destinix/session.php", {
            method: "GET",
            credentials: "include",  // Muy importante para enviar la cookie de sesión
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
        return { loggedIn: false };
    }
};


export const guardarComentarioSitio = async (data) => {
    const comentarioData = {
        persona_id_persona: data.persona_id_persona,
        contenido: data.contenido,
        id_calificacion: data.id_calificacion,
        id_sitio: data.id_sitio || null,
        id_hoteles: null,
        id_restaurante: null
    };
    return addComentario(comentarioData);
};

export const guardarComentarioHotel = async (data) => {
    const comentarioData = {
        persona_id_persona: data.persona_id_persona,
        contenido: data.contenido,
        id_calificacion: data.id_calificacion,
        id_hoteles: data.id_hoteles || null,
        id_sitio: null,
        id_restaurante: null
    };
    return addComentario(comentarioData);
};

export const guardarComentarioRestaurante = async (data) => {
    const comentarioData = {
        persona_id_persona: data.persona_id_persona,
        contenido: data.contenido,
        id_calificacion: data.id_calificacion,
        id_restaurante: data.id_restaurante || null,
        id_sitio: null,
        id_hoteles: null
    };
    return addComentario(comentarioData);
};

export const getRestaurantes = async () => {
    try {
        const response = await fetch("http://localhost/destinix/Restaurantes.php");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener restaurantes:", error);
        throw error;
    }
};

export const getHoteles = async () => {
    try {
        const response = await fetch("http://localhost/destinix/hoteles.php", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener hoteles:", error);
        return [];
    }
};

export const getSitiosPorTipo = async (tipo) => {
    try {
        const response = await fetch(`http://localhost/destinix/itinerario.php?tipo=${tipo}`);
        if (!response.ok) {
            throw new Error("Error al obtener sitios por tipo");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getSitiosPorTipo:", error);
        return [];
    }
};

export const editEvento = async (evento) => {
    const response = await fetch("http://localhost/destinix/itinerario.php", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento),
    });

    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return { error: "Respuesta no válida del servidor" };
    }
};

export const editUser = async (formData) => {
    const response = await fetch("http://localhost/destinix/usuario.php", {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error);
    }

    return result;
};


export const fetchUsuario = async () => {
    try {
        const response = await fetch("http://localhost/destinix/usuario.php", {
            method: "GET",
            credentials: "include", // 🔥 Para enviar las cookies de sesión
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        throw error;
    }
};

export const getPerfilAnunciante = async () => {
    try {
        const response = await fetch("http://localhost/destinix/perfilanunciante.php", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener perfil del anunciante:", error);
        throw error;
    }
};


export const getRolUsuario = async () => {
    const response = await fetch("http://localhost/destinix/usuario.php", {
        credentials: "include",
    });
    const data = await response.json();
    return data.rol_idRol; // o retorna todo si necesitas más datos
};

export const editPerfilAnunciante = async (formData) => {
    const response = await fetch("http://localhost/destinix/perfilanunciante.php", {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
};

export const registrarHotel = async (formData) => {
    const response = await fetch("http://localhost/destinix/registrarhotel.php", {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const text = await response.text(); // Obtiene la respuesta como texto
    try {
        const data = JSON.parse(text); // Intenta convertirla a JSON
        if (!response.ok || data.error) {
            throw new Error(data.error || "Error en la solicitud");
        }
        return data;
    } catch (error) {
        throw new Error("Error al registrar el hotel. Verifica los logs.");
    }
};

export const getComentariosByHotel = async (id_hoteles) => {
    try {
        const response = await fetch(`http://localhost/destinix/comentarios.php?id_hoteles=${id_hoteles}`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return { success: false, message: 'Error en la conexión.' };
    }
};

export const getComentariosByrestaurante = async (id_hoteles) => {
    try {
        const response = await fetch(`http://localhost/destinix/comentarios.php?id_hoteles=${id_hoteles}`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return { success: false, message: 'Error en la conexión.' };
    }
};

const CALIFICACION_URL = "http://localhost/destinix/calificacion.php";

export const getCalificaciones = async () => {
    const response = await fetch(CALIFICACION_URL);
    return await response.json();
};

export const addCalificacion = async (puntuacion) => {
    const formData = new FormData();
    formData.append("puntuacion", puntuacion);

    const response = await fetch(CALIFICACION_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const updateCalificacion = async (id, puntuacion) => {
    const response = await fetch(CALIFICACION_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_calificacion: id, puntuacion }),
    });
    return await response.json();
};

export const deleteCalificacion = async (id) => {
    const response = await fetch(`${CALIFICACION_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};

const CATEGORIA_URL = "http://localhost/destinix/categoria.php";


export const getCategoria = async () => {
    const response = await fetch(CATEGORIA_URL);
    return await response.json();
};


export const addCategoria = async (nombre_cate, desc_cate) => {
    const formData = new FormData();
    formData.append("nombre_cate", nombre_cate);
    formData.append("desc_cate", desc_cate);

    const response = await fetch(CATEGORIA_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};


export const updateCategoria = async (id, nombre_cate, desc_cate) => {
    const response = await fetch(CATEGORIA_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_categoria: id,
            nombre_cate,
            desc_cate,
        }),
    });
    return await response.json();
};


export const deleteCategoria = async (id) => {
    const response = await fetch(`${CATEGORIA_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};

const COMENTARIOS_URL = "http://localhost/destinix/comentarios.php";


export const getComentarios = async () => {
    const response = await fetch(COMENTARIOS_URL);
    return await response.json();
};


export const addComentarios = async (comentario) => {
    const formData = new FormData();
    formData.append("persona_id_persona", comentario.persona_id_persona);
    formData.append("id_sitio", comentario.id_sitio);
    formData.append("id_hoteles", comentario.id_hoteles);
    formData.append("id_restaurante", comentario.id_restaurante);
    formData.append("contenido", comentario.contenido);
    formData.append("fecha_comentario", comentario.fecha_comentario);
    formData.append("id_calificacion", comentario.id_calificacion);

    const response = await fetch(COMENTARIOS_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};


export const updateComentarios = async (id, comentario) => {
    const response = await fetch(COMENTARIOS_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_comentario: id,
            ...comentario,
        }),
    });
    return await response.json();
};

export const deleteComentarios = async (id) => {
    const response = await fetch(`${COMENTARIOS_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};

const EMPRESA_URL = "http://localhost/destinix/empresa.php";


export const getEmpresas = async () => {
    const response = await fetch(EMPRESA_URL);
    return await response.json();
};

export const addEmpresa = async (empresa) => {
    const formData = new FormData();
    formData.append("nombre_emp", empresa.nombre_emp);
    formData.append("direccion_emp", empresa.direccion_emp);
    formData.append("correo_empresa", empresa.correo_empresa);
    formData.append("telefono_empresa", empresa.telefono_empresa);
    formData.append("persona_id_persona", empresa.persona_id_persona);
    formData.append("id_categoria", empresa.id_categoria);

    const response = await fetch(EMPRESA_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};


export const updateEmpresa = async (empresa) => {
    const res = await fetch("http://localhost/destinix/empresa.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
    });
    return res.json();
};


export const deleteEmpresa = async (id) => {
    const res = await fetch(`http://localhost/destinix/empresa.php?id=${id}`, {
        method: "DELETE",
    });
    return res.json();
};


const ESTADO_URL = "http://localhost/destinix/estado.php";

export const getEstados = async () => {
    const response = await fetch(ESTADO_URL);
    return await response.json();
};

export const addEstado = async (desc_estado) => {
    const response = await fetch("http://localhost/destinix/estado.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ desc_estado }),
    });

    const raw = await response.text();
    console.log("Respuesta del backend:", raw);

    try {
        return JSON.parse(raw);
    } catch (e) {
        throw new Error("No es JSON válido. Verifica la consola.");
    }
};





export const updateEstado = async (id, desc_estado) => {
    const response = await fetch(ESTADO_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_estado: id,
            desc_estado,
        }),
    });
    return await response.json();
};

export const deleteEstado = async (id) => {
    const response = await fetch(`${ESTADO_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};


const HOTEL_URL = "http://localhost/destinix/hoteles.php";


export const gethoteles = async () => {
    const response = await fetch(HOTEL_URL);
    return await response.json();
};


export const addHoteles = async (formData) => {
    const data = new FormData();

    for (const key in formData) {
        if (formData[key] !== null) {
            data.append(key, formData[key]);
        }
    }

    const response = await fetch(HOTEL_URL, {
        method: "POST",
        body: data,
    });

    const raw = await response.text();
    console.log("Respuesta POST:", raw);

    try {
        return JSON.parse(raw);
    } catch (e) {
        throw new Error("Respuesta no es JSON válido. Revisa la consola.");
    }
};


export const updatehoteles = async (id, formData) => {
    const payload = {
        id_hotel: id,
        titulo_hotel: formData.titulo_hotel,
        desc_hoteles: formData.desc_hoteles,
        estado_id_estado: formData.estado_id_estado,
        empresa_id_empresa: formData.empresa_id_empresa,
        calificacion_id_calificacion: formData.calificacion_id_calificacion,
    };

    const response = await fetch(HOTEL_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const raw = await response.text();
    console.log("Respuesta PUT:", raw);

    try {
        return JSON.parse(raw);
    } catch (e) {
        throw new Error("Error al parsear JSON. Verifica la consola.");
    }
};


export const deletehoteles = async (id) => {
    const response = await fetch(HOTEL_URL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_hotel: id }),
    });

    const raw = await response.text();
    console.log("Respuesta DELETE:", raw);

    try {
        return JSON.parse(raw);
    } catch (e) {
        throw new Error("Respuesta no es JSON válido.");
    }
};



const PERSONA_URL = "http://localhost/destinix/usuario.php";

export const getPersonas = async () => {
    const response = await fetch(PERSONA_URL);
    return await response.json();
};


export const addPersona = async (persona) => {
    const formData = new FormData();
    formData.append("nombre_usu", persona.nombre_usu);
    formData.append("apellido_usu", persona.apellido_usu);
    formData.append("tipo_documento", persona.tipo_documento);
    formData.append("documento", persona.documento);
    formData.append("email_usu", persona.email_usu);
    formData.append("telefono_usu", persona.telefono_usu);
    formData.append("genero", persona.genero);
    formData.append("localidad", persona.localidad);
    formData.append("fecha_nacimiento", persona.fecha_nacimiento);
    formData.append("contraseña", persona.contraseña);

    const response = await fetch(PERSONA_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};
export const updatePersona = async (id, persona) => {
    const response = await fetch(PERSONA_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_persona: id,
            ...persona,
        }),
    });
    return await response.json();
};


export const deletePersona = async (id) => {
    const response = await fetch(`${PERSONA_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};


const RESERVA_URL = "http://localhost/destinix/reserva.php";


export const getreserva = async () => {
    const response = await fetch(RESERVA_URL);
    return await response.json();
};


export const addreserva = async (reserva) => {
    const formData = new FormData();
    formData.append("fecha_reserva", reserva.fecha_reserva);
    formData.append("fecha_visita", reserva.fecha_visita);
    formData.append("cantidad_personas", reserva.cantidad_personas);
    formData.append("restaurante_id", reserva.restaurante_id);
    formData.append("sitio_id", reserva.sitio_id);
    formData.append("hotel_id", reserva.hotel_id);
    formData.append("estado_id", reserva.estado_id);
    formData.append("empresa_id", reserva.empresa_id);
    formData.append("id_itinerario", reserva.id_itinerario);

    const response = await fetch(RESERVA_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};


export const updatereserva = async (id, reserva) => {
    const response = await fetch(RESERVA_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_reserva: id,
            ...reserva,
        }),
    });
    return await response.json();
};


export const deletereserva = async (id) => {
    const response = await fetch(`${RESERVA_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};

const RESTAURANTES_URL = "http://localhost/destinix/restaurantes.php";

export const getRestaurante = async () => {
    const response = await fetch(RESTAURANTES_URL);
    return await response.json();
};

export const addRestaurante = async (restaurante) => {
    const formData = new FormData();
    formData.append("titulo_restaurante", restaurante.titulo_restaurante);
    formData.append("img", restaurante.img); 
    formData.append("desc_restaurantes", restaurante.desc_restaurantes);
    formData.append("estado_id_estado", restaurante.estado_id_estado);
    formData.append("empresa_id_empresa", restaurante.empresa_id_empresa);

    const response = await fetch(RESTAURANTES_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const updateRestaurante = async (id, restaurante) => {
    const response = await fetch(RESTAURANTES_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_restaurante: id,
            titulo_restaurante: restaurante.titulo_restaurante,
            img: restaurante.img,
            desc_restaurantes: restaurante.desc_restaurantes,
            estado_id_estado: restaurante.estado_id_estado,
            empresa_id_empresa: restaurante.empresa_id_empresa,
        }),
    });
    return await response.json();
};

export const deleteRestaurante = async (id) => {
    const response = await fetch(`${RESTAURANTES_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};


const ROL_URL = "http://localhost/destinix/rol.php";

export const getrol = async () => {
    const response = await fetch(ROL_URL);
    return await response.json();
};

export const addrol = async (rol) => {
    const formData = new FormData();
    formData.append("Tipo_Rol", rol.Tipo_Rol);

    const response = await fetch(ROL_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const updaterol = async (id, rol) => {
    const response = await fetch(ROL_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idRol: id,
            ...rol,
        }),
    });
    return await response.json();
};

export const deleterol = async (id) => {
    const response = await fetch(`${ROL_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};

const SEGURIDAD_URL = "http://localhost/destinix/seguridad.php";

export const getseguridad = async () => {
    const response = await fetch(SEGURIDAD_URL);
    return await response.json();
};

export const addseguridad = async (data) => {
    const formData = new FormData();
    formData.append("email_usu", data.email_usu);
    formData.append("contra_usu", data.contra_usu);
    formData.append("token_reset", data.token_reset);
    formData.append("expira_reset", data.expira_reset);
    formData.append("verificado", data.verificado);
    formData.append("token_verificacion", data.token_verificacion);

    const response = await fetch(SEGURIDAD_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const updateseguridad = async (id, data) => {
    const response = await fetch(SEGURIDAD_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_seguridad: id,
            ...data,
        }),
    });
    return await response.json();
};

export const deleteseguridad = async (id) => {
    const response = await fetch(`${SEGURIDAD_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};


const SITIO_URL = "http://localhost/destinix/sitio_turistico.php";

export const getsitio_turistico = async () => {
    const response = await fetch(SITIO_URL);
    return await response.json();
};

export const addsitio_turistico = async (sitio) => {
    const formData = new FormData();
    formData.append("nombre_sitio", sitio.nombre_sitio);
    formData.append("img_sitio", sitio.img_sitio); // tipo File
    formData.append("ubicacion_sitio", sitio.ubicacion_sitio);
    formData.append("desc_sitio", sitio.desc_sitio);
    formData.append("persona_id_persona", sitio.persona_id_persona);
    formData.append("estado_id_estado", sitio.estado_id_estado);

    const response = await fetch(SITIO_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const updatesitio_turistico = async (id, sitio) => {
    const response = await fetch(SITIO_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_sitio: id,
            ...sitio,
        }),
    });
    return await response.json();
};

export const deletesitio_turistico = async (id) => {
    const response = await fetch(`${SITIO_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};
