import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarContext } from '../../../Contexts/SidebarContext';
import { Tooltip } from 'react-tooltip';
import './SidebarComponent.css';
import {
  FaSignOutAlt,
  FaTable,
  FaUsers,
  FaFileAlt,
  FaGraduationCap,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaTrash
} from 'react-icons/fa';

const SidebarComponent = () => {
  const { collapsed, isMobile, toggleCollapse } = useContext(SidebarContext);
  const [parametresOpen, setParametresOpen] = useState(false);
  const location = useLocation();

  // Fermer le sous-menu des paramètres si on change de page
  useEffect(() => {
    if (!location.pathname.startsWith('/parametres')) {
      setParametresOpen(false);
    }
  }, [location.pathname]);

  const handleParametresClick = (e) => {
    e.preventDefault();
    setParametresOpen(!parametresOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Logique de déconnexion
    console.log('Déconnexion...');
  };

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <div className={`tahaca-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <Tooltip
          id="sidebar-tooltip"
          place="right"
          effect="solid"
          delayShow={300}
          className="sidebar-tooltip"
          float={true}
          positionStrategy="fixed"
          noArrow={false}
          offset={10}
        />

        <div className="tahaca-sidebar__logo-container">
          <div className="tahaca-sidebar__logo-wrapper">
            {/* <img
              // src="/icon-512.svg"
              // alt="ESGIS Logo"
              className="tahaca-sidebar__logo"
            /> */}
            {!collapsed && <span className="tahaca-sidebar__logo-text">DocSchool</span>}
          </div>
        </div>

        <nav className="tahaca-sidebar__nav">
          <ul className="tahaca-sidebar__menu">
            {/* Tableau de bord */}
            <li className="tahaca-sidebar__menu-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => 
                  `tahaca-sidebar__menu-link ${isActive || location.pathname === '/dashboard' ? 'active dashboard' : ''}`
                }
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content="Tableau de bord"
              >
                <FaTable className="tahaca-sidebar__icon" />
                <span className="tahaca-sidebar__menu-text">Tableau de bord</span>
              </NavLink>
            </li>

            {/* Utilisateurs */}
            <li className="tahaca-sidebar__menu-item">
              <NavLink
                to="/utilisateurs"
                className={({ isActive }) => `tahaca-sidebar__menu-link ${isActive ? 'active' : ''}`}
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content="Utilisateurs"
              >
                <FaUsers className="tahaca-sidebar__icon" />
                <span className="tahaca-sidebar__menu-text">Utilisateurs</span>
              </NavLink>
            </li>

            {/* Documents */}
            <li className="tahaca-sidebar__menu-item">
              <NavLink
                to="/documents"
                className={({ isActive }) => `tahaca-sidebar__menu-link ${isActive ? 'active' : ''}`}
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content="Documents"
              >
                <FaFileAlt className="tahaca-sidebar__icon" />
                <span className="tahaca-sidebar__menu-text">Documents</span>
              </NavLink>
            </li>

            {/* Filières */}
            <li className="tahaca-sidebar__menu-item">
              <NavLink
                to="/filieres"
                className={({ isActive }) => `tahaca-sidebar__menu-link ${isActive ? 'active' : ''}`}
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content="Filières"
              >
                <FaGraduationCap className="tahaca-sidebar__icon" />
                <span className="tahaca-sidebar__menu-text">Filières</span>
              </NavLink>
            </li>

            {/* Paramètres */}
            <li className={`tahaca-sidebar__menu-item ${parametresOpen ? 'submenu-active' : ''}`}>
              <a
                href="#"
                className={`tahaca-sidebar__menu-link ${
                  parametresOpen || isActiveLink('/parametres') ? 'active' : ''
                }`}
                onClick={handleParametresClick}
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content="Paramètres"
              >
                <FaCog className="tahaca-sidebar__icon" />
                <span className="tahaca-sidebar__menu-text">Paramètres</span>
                {!collapsed && (
                  <FaChevronDown 
                    className={`tahaca-sidebar__submenu-arrow ${parametresOpen ? 'open' : ''}`} 
                  />
                )}
              </a>

              {parametresOpen && (
                <ul className="tahaca-sidebar__submenu">
                  <li className="tahaca-sidebar__submenu-item">
                    <NavLink
                      to="/parametres/corbeille"
                      className={({ isActive }) => `tahaca-sidebar__submenu-link ${isActive ? 'active' : ''}`}
                      data-tooltip-id="sidebar-tooltip"
                      data-tooltip-content="Corbeille"
                    >
                      <FaTrash className="tahaca-sidebar__submenu-icon" />
                      <span>Corbeille</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="tahaca-sidebar__footer">
          <button
            className="tahaca-sidebar__logout-btn"
            onClick={handleLogout}
            data-tooltip-id="sidebar-tooltip"
            data-tooltip-content="Déconnexion"
          >
            <FaSignOutAlt className="tahaca-sidebar__icon" />
            {!collapsed && <span className="tahaca-sidebar__menu-text">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Bouton de collapse externe */}
      {!isMobile && (
        <button
          className={`tahaca-sidebar__collapse-btn-external ${collapsed ? 'collapsed' : ''}`}
          onClick={toggleCollapse}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      )}
    </>
  );
};

export default SidebarComponent;