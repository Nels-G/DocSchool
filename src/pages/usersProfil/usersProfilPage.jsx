import React from 'react';
import './usersProfilPage.css';
import ProfilComponent from '../../features/users/component/profil/profilComponent';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

const UsersProfilPage = () => {
  return (
    <div className="users-profil-page">
      <div className="header-container">
        <Header/>
      </div>
      <div className="main-content">
        <ProfilComponent/>
      </div>
      <div className="footer-container">
        <Footer/>
      </div>
    </div>
  );
};

export default UsersProfilPage;