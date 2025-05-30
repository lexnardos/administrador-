import React from 'react';
import RestaurantesForm from '../components/Restaurantes/RestaurantesForm.jsx'; // Asegúrate que la ruta sea correcta

const FormularioRestaurantesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Gestión de Restaurantes
      </h1>
      <RestaurantesForm />
    </div>
  );
};

export default FormularioRestaurantesPage;