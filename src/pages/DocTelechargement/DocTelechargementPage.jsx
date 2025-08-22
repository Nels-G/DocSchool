import React from 'react';
import './docTelechargementPage.css';
import DocTelechargementComponent from '../../components/docTelechargement/DocTelechargementComponent';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

const DocTelechargementPage = () => {
  return (
    <div className="docTelechargementPage">
        <Header/>
        <DocTelechargementComponent/>
        <Footer/>
    </div>
  );
};

export default DocTelechargementPage;