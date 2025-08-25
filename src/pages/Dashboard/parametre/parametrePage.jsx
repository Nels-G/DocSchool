import React, { useContext } from 'react';
import './parametrePage.css';
import SidebarComponent from '../../../components/Dashboard/Sidebar/SidebarComponent';
import { SidebarProvider, SidebarContext } from '../../../Contexts/SidebarContext';
import AdminHeader from '../../../components/Dashboard/HeaderAdminComponent/AdminHeader';

const ParametreContent = () => {
  const { collapsed } = useContext(SidebarContext);
  
  return (
    <div className="parametrePage-layout">
      <SidebarComponent />
      <div className={`parametrePage-main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="parametrePage-header-wrapper">
          <AdminHeader />
        </div>
        <div className="parametrePage-content-wrapper">
          {/* Votre contenu de paramètres ici */}
        </div>
      </div>
    </div>
  );
};

const ParametrePage = () => {
  return (
    <SidebarProvider>
      <ParametreContent />
    </SidebarProvider>
  );
};

export default ParametrePage;