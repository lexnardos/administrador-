import axios from 'axios';

const API = 'http://localhost/api/sitios/SitiosController.php';

export const getSitios = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const deleteSitio = async (id) => {
  return await axios.delete(API, { data: { id } });
};

export const addSitio = async (formData) => {
  return await axios.post(API, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
