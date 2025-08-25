import React, { useContext } from 'react';
import './filierePage.css';
import { SidebarContext, SidebarProvider } from '../../../Contexts/SidebarContext';
import AdminHeader from '../../../components/Dashboard/HeaderAdminComponent/AdminHeader';
import SidebarComponent from '../../../components/Dashboard/Sidebar/SidebarComponent';
import FiliereComponent from '../../../components/Dashboard/filiereComponent/filiereComponent';

const FiliereContent = () => {
  const { collapsed } = useContext(SidebarContext);
  
  return (
    <div className="filierePage-layout">
      <SidebarComponent />
      <div className={`filierePage-main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminHeader />
          <FiliereComponent/>
      </div>
    </div>
  );
};

const FilierePage = () => {
  return (
    <SidebarProvider>
      <FiliereContent />
    </SidebarProvider>
  );
};

export default FilierePage;