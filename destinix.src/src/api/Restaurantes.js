const API_BASE = "http://localhost/destinix/api/RestaurantesMetodos";

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Error HTTP ${response.status}`);
  }
  return data;
};

// GET: Obtener todos los restaurantes
export const obtenerRestaurantes = async () => {
  const response = await fetch(`${API_BASE}/ObtenerRestaurante.php`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
};

// POST: Crear restaurante
export const createRestaurante = async (formData) => {
  const response = await fetch(`${API_BASE}/CrearRestaurante.php`, {
    method: 'POST',
    body: formData // Si es FormData, no pongas headers de Content-Type
  });
  return handleResponse(response);
};

// PUT: Actualizar restaurante
export const updateRestaurante = async (id, formData) => {
  formData.append('id', id);
  const response = await fetch(`${API_BASE}/ActualizarRestaurante.php`, {
    method: 'POST',
    body: formData
  });
  return handleResponse(response);
};

// DELETE: Eliminar restaurante
export const deleteRestaurante = async (id) => {
  const formData = new FormData();
  formData.append('id', id);
  const response = await fetch(`${API_BASE}/EliminarRestaurante.php`, {
    method: 'POST',
    body: formData
  });
  return handleResponse(response);
};

// Obtener estados desde PHP
export const getEstados = async () => {
  try {
    const response = await fetch("http://localhost/destinix/api/estados/ObtenerEstados.php", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};

// Obtener empresas desde PHP
export const getEmpresas = async () => {
  try {
    const response = await fetch("http://localhost/destinix/api/empresa/ObtenerEmpresas.php", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};
