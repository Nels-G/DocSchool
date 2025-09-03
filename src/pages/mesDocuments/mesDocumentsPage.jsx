import React from 'react';
import './mesDocumentsPage.css';
import MesDocumentsComponent from '../../components/mesDocuments/mesDocumentsComponent';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

const MesDocumentsPage = () => {
  return (
    <div className="mesDocumentsPage">
        <Header/>
        <MesDocumentsComponent/>
        <Footer/>
    </div>
  );
};

export default MesDocumentsPage;