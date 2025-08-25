import React, { useContext } from 'react';
import './professeursPage.css';
import SidebarComponent from '../../../components/Dashboard/Sidebar/SidebarComponent';
import { SidebarProvider, SidebarContext } from '../../../Contexts/SidebarContext';
import AdminHeader from '../../../components/Dashboard/HeaderAdminComponent/AdminHeader';
import AllProfComponent from '../../../components/Dashboard/AllProfComponent/AllProfComponent';

const ProfesseursContent = () => {
  const { collapsed } = useContext(SidebarContext);
  
  return (
    <div className="professeursPage-layout">
      <SidebarComponent />
      <div className={`professeursPage-main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader />
        <AllProfComponent/>
      </div>
    </div>
  );
};

const ProfesseursPage = () => {
  return (
    <SidebarProvider>
      <ProfesseursContent />
    </SidebarProvider>
  );
};

export default ProfesseursPage;