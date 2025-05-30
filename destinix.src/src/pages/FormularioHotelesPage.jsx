import React from 'react';
import HotelesForm from '../components/Hoteles/HotelesForm.jsx'; // Asegúrate de que la ruta sea correcta

const FormularioHotelesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Gestión de Hoteles
      </h1>
      <HotelesForm /> {/* Usamos el componente adaptado */}
    </div>
  );
};

export default FormularioHotelesPage;
