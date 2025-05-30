import React from 'react';
import CategoriaForm from '../components/Categoria/CategoriaForm.jsx';

const FormularioCategoriaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1>
      <CategoriaForm />
    </div>
  );
};

export default FormularioCategoriaPage;
