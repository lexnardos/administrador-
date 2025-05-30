import React from 'react';
import RolForm from '../components/Rol/RolForm.jsx';

const FormularioRolPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Roles</h1>
      <RolForm />
    </div>
  );
};

export default FormularioRolPage;
