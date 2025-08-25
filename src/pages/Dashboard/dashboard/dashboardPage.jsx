import React, { useContext } from 'react';
import './dashboardPage.css';
import SidebarComponent from '../../../components/Dashboard/Sidebar/SidebarComponent';
import { SidebarProvider, SidebarContext } from '../../../Contexts/SidebarContext';
import AdminHeader from '../../../components/Dashboard/HeaderAdminComponent/AdminHeader';
import StatAdminComponent from '../../../components/Dashboard/StatAdmin/StatAdminComponent';
import UserListe from '../../../components/Dashboard/ProfStats/ProfListe';
// import ProfListe from '../../../components/Dashboard/ProfStats/ProfListe';

const DashboardContent = () => {
  const { collapsed } = useContext(SidebarContext);
  
  return (
    <div className="dashboard-layout">
      <SidebarComponent />
      <div className={`dashboard-main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader />
        <StatAdminComponent/>
        {/* <ProfListe/> */}
        <UserListe/>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default DashboardPage;