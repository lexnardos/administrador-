import React from 'react';
import EmpresaForm from '../components/Empresa/EmpresaForm.jsx';

const FormularioEmpresaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Empresas</h1>
      <EmpresaForm />
    </div>
  );
};

export default FormularioEmpresaPage;
