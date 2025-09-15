import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import BookAdd from '../modal/bookAdd';
import api from '../../services/api';

const Header = ({
  logo = { doc: 'Doc', school: 'School' },
  navigationItems = [],
  onLogout = () => { },
  onModalOpen = () => { },
  onModalClose = () => { }
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBookAddOpen, setIsBookAddOpen] = useState(false);
  const [headerData, setHeaderData] = useState({
    user: null,
    logo: logo,
    navigationItems: navigationItems.length > 0 ? navigationItems : [
      { id: 1, name: 'Mon Profil', icon: 'user', path: '/user/profil' },
      { id: 2, name: 'Mes documents', icon: 'documents', path: '/user/document' },
      { id: 3, name: 'Favoris', icon: 'favorites', path: '/user/favoris' },
      { id: 4, name: 'Téléchargés', icon: 'downloads', path: '/user/telechargement' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  const formatUserRole = (user) => {
    if (!user) return 'Utilisateur';
    let role = user.est_admin ? 'Administrateur' : 'Étudiant';
    if (user.filiere_nom && user.niveau_nom) {
      role += ` ${user.niveau_nom} ${user.filiere_nom}`;
    } else if (user.niveau_nom) {
      role += ` ${user.niveau_nom}`;
    } else if (user.filiere_nom) {
      role += ` ${user.filiere_nom}`;
    }
    return role;
  };

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        try {
          const response = await api.get(`/users/${userData.id}/`);
          const currentUserData = response.data;
          localStorage.setItem('user', JSON.stringify(currentUserData));

          setHeaderData(prevData => ({
            ...prevData,
            user: {
              name: currentUserData.nom_complet,
              role: formatUserRole(currentUserData),
              initials: getInitials(currentUserData.first_name, currentUserData.last_name),
              matricule: currentUserData.matricule,
              email: currentUserData.email,
              photoUrl: currentUserData.photo_profil_url
                ? `http://127.0.0.1:8000${currentUserData.photo_profil_url}`
                : null,
              rawData: currentUserData
            }
          }));
        } catch (apiError) {
          setHeaderData(prevData => ({
            ...prevData,
            user: {
              name: userData.nom_complet,
              role: formatUserRole(userData),
              initials: getInitials(userData.first_name, userData.last_name),
              matricule: userData.matricule,
              email: userData.email,
              photoUrl: userData.photo_profil_url
                ? `http://127.0.0.1:8000${userData.photo_profil_url}`
                : null,
              rawData: userData
            }
          }));
        }
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Erreur lors du chargement des données utilisateur');
      console.error('Erreur:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isBookAddOpen) {
      document.body.classList.add('modal-open');
      onModalOpen();
    } else {
      document.body.classList.remove('modal-open');
      onModalClose();
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isBookAddOpen, onModalOpen, onModalClose]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleAddDocument = () => {
    setIsBookAddOpen(true);
  };

  const handleCloseBookAdd = () => {
    setIsBookAddOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    onLogout();
    closeSidebar();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/accueil');
  };

  const renderUserAvatar = () => {
    if (headerData.user?.photoUrl) {
      return (
        <div className="headerComponent-user-avatar" title={`${headerData.user.name} (${headerData.user.matricule})`}>
          <img
            src={headerData.user.photoUrl}
            alt={`Photo de ${headerData.user.name}`}
            className="headerComponent-user-avatar-img"
            onError={(e) => {
              console.log('Erreur chargement image pour:', headerData.user.name);
              e.target.style.display = 'none';
              // Afficher les initiales quand l'image échoue
              const initialsElement = e.target.nextElementSibling;
              if (initialsElement) {
                initialsElement.style.display = 'flex';
              }
            }}
          />
          <div className="headerComponent-user-avatar-initials" style={{display: 'none'}}>
            {headerData.user.initials}
          </div>
        </div>
      );
    } else {
      return (
        <div className="headerComponent-user-avatar" title={`${headerData.user.name} (${headerData.user.matricule})`}>
          {headerData.user.initials}
        </div>
      );
    }
  };

  const renderSidebarAvatar = () => {
    if (headerData.user?.photoUrl) {
      return (
        <div className="headerComponent-sidebar-user-avatar">
          <img
            src={headerData.user.photoUrl}
            alt={`Photo de ${headerData.user.name}`}
            className="headerComponent-sidebar-user-avatar-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const initialsElement = e.target.nextElementSibling;
              if (initialsElement) {
                initialsElement.style.display = 'flex';
              }
            }}
          />
          <div className="headerComponent-sidebar-user-avatar-initials" style={{ display: 'none' }}>
            {headerData.user.initials}
          </div>
        </div>
      );
    } else {
      return (
        <div className="headerComponent-sidebar-user-avatar">
          {headerData.user.initials}
        </div>
      );
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      user: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      documents: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      favorites: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      downloads: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      logout: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9L12 6H19C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    };
    return icons[iconName] || icons.user;
  };

  if (loading) {
    return <div className="headerComponent-loading-container"></div>;
  }

  if (error) {
    return (
      <div className="headerComponent-error-container">
        <div>Erreur: {error}</div>
        <button onClick={() => navigate('/login')}>Se reconnecter</button>
      </div>
    );
  }

  if (!headerData.user) {
    return null;
  }

  return (
    <>
      <header className="headerComponent-header"></header>

      <div className="headerComponent-menu-footer-band">
        <div className="headerComponent-header-content">
          <h1 className="headerComponent-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span className='headerComponent-doc-span'>{headerData.logo.doc}</span>
            <span className='headerComponent-school-span'>{headerData.logo.school}</span>
          </h1>
          <div className="headerComponent-header-actions">
            <button
              className="headerComponent-add-document-btn"
              onClick={handleAddDocument}
            >
              Ajouter un document
            </button>
            {renderUserAvatar()}
            <button className="headerComponent-burger-menu" onClick={toggleSidebar} aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      <div className="headerComponent-sidebar-container">
        {isSidebarOpen && <div className="headerComponent-sidebar-overlay" onClick={closeSidebar}></div>}

        <div className={`headerComponent-sidebar ${isSidebarOpen ? 'headerComponent-sidebar-open' : ''}`}>
          <div className="headerComponent-sidebar-header">
            <div className="headerComponent-user-info">
              {renderSidebarAvatar()}
              <div className="headerComponent-user-details">
                <h3>{headerData.user.name}</h3>
                <p>{headerData.user.role}</p>
                <small>{headerData.user.matricule} • {headerData.user.email}</small>
              </div>
            </div>
            <button className="headerComponent-close-btn" onClick={closeSidebar} aria-label="Fermer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="headerComponent-sidebar-nav">
            {headerData.navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`headerComponent-nav-item ${item.enabled === false ? 'headerComponent-nav-item-disabled' : ''}`}
                onClick={closeSidebar}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {renderIcon(item.icon)}
                {item.name}
                {item.badge && (
                  <span className="headerComponent-nav-item-badge">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div
              className="headerComponent-nav-item"
              onClick={handleLogout}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogout();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Se déconnecter"
            >
              {renderIcon('logout')}
              Déconnexion
            </div>
          </nav>
        </div>
      </div>

      <BookAdd
        isOpen={isBookAddOpen}
        onClose={handleCloseBookAdd}
        user={headerData.user?.rawData}
      />
    </>
  );
};

export default Header;