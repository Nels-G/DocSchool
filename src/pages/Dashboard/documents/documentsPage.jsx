import React, { useContext } from 'react';
import './documentsPage.css';
import { SidebarContext, SidebarProvider } from '../../../Contexts/SidebarContext';
import AdminHeader from '../../../components/Dashboard/HeaderAdminComponent/AdminHeader';
import SidebarComponent from '../../../components/Dashboard/Sidebar/SidebarComponent';

const DocumentContent = () => {
  const { collapsed } = useContext(SidebarContext);
  
  return (
    <div className="documentsPage-layout">
      <SidebarComponent />
      <div className={`documentsPage-main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminHeader />
          {/* <DocumentComponent/> */}
      </div>
    </div>
  );
};

const DocumentsPage = () => {
  return (
    <SidebarProvider>
      <DocumentContent />
    </SidebarProvider>
  );
};

export default DocumentsPage;