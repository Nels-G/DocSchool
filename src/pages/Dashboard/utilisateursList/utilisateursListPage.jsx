import React, { useContext } from 'react';
import './utilisateursListPage.css';
import { SidebarContext, SidebarProvider } from '../../../Contexts/SidebarContext';
import AdminHeader from '../../../components/Dashboard/HeaderAdminComponent/AdminHeader';
import SidebarComponent from '../../../components/Dashboard/Sidebar/SidebarComponent';
import UserListeComponent from '../../../components/Dashboard/utilisateursList/utilisateursListComponent';

const UtilisateursListContent = () => {
  const { collapsed } = useContext(SidebarContext);
  
  return (
    <div className="utilisateursListPage-layout">
      <SidebarComponent />
      <div className={`utilisateursListPage-main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminHeader />
          <UserListeComponent/>
      </div>
    </div>
  );
};

const UtilisateursListPage = () => {
  return (
    <SidebarProvider>
      <UtilisateursListContent />
    </SidebarProvider>
  );
};

export default UtilisateursListPage;