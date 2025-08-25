import React, { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = ({ title = "Tableau de bord", user = { name: "JD", avatar: null } }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, message: "Nouvelle commande reçue", time: "Il y a 2 min", unread: true },
    { id: 2, message: "Rapport mensuel disponible", time: "Il y a 1h", unread: true },
    { id: 3, message: "Maintenance programmée", time: "Il y a 3h", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="AdminHeader">
      <div className="AdminHeader-container">
        <div className="AdminHeader-left">
          <h1 className="AdminHeader-title">{title}</h1>
        </div>
        
        <div className="AdminHeader-right">
          {/* Notifications */}
          <div className="AdminHeader-notification-wrapper">
            <button 
              className="AdminHeader-notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="AdminHeader-notification-icon" />
              {unreadCount > 0 && (
                <span className="AdminHeader-notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="AdminHeader-notification-dropdown">
                <div className="AdminHeader-notification-header">
                  <h3>Notifications</h3>
                  <span className="AdminHeader-notification-count">{unreadCount} nouvelles</span>
                </div>
                <div className="AdminHeader-notification-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`AdminHeader-notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <div className="AdminHeader-notification-content">
                        <p className="AdminHeader-notification-message">{notification.message}</p>
                        <span className="AdminHeader-notification-time">{notification.time}</span>
                      </div>
                      {notification.unread && <div className="AdminHeader-notification-dot"></div>}
                    </div>
                  ))}
                </div>
                <div className="AdminHeader-notification-footer">
                  <button className="AdminHeader-notification-view-all">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="AdminHeader-user-wrapper">
            <button 
              className="AdminHeader-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="AdminHeader-user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="AdminHeader-avatar-image" />
                ) : (
                  <span className="AdminHeader-avatar-text">{user.name}</span>
                )}
              </div>
              <ChevronDown className="AdminHeader-user-chevron" />
            </button>
            
            {showUserMenu && (
              <div className="AdminHeader-user-dropdown">
                <div className="AdminHeader-user-info">
                  <div className="AdminHeader-user-avatar large">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="AdminHeader-avatar-image" />
                    ) : (
                      <span className="AdminHeader-avatar-text">{user.name}</span>
                    )}
                  </div>
                  <div className="AdminHeader-user-details">
                    <p className="AdminHeader-user-name">John Doe</p>
                    <p className="AdminHeader-user-role">Administrateur</p>
                  </div>
                </div>
                <div className="AdminHeader-user-menu">
                  <button className="AdminHeader-user-menu-item">
                    <span>Mon profil</span>
                  </button>
                  <button className="AdminHeader-user-menu-item">
                    <span>Paramètres</span>
                  </button>
                  <button className="AdminHeader-user-menu-item">
                    <span>Aide</span>
                  </button>
                  <hr className="AdminHeader-user-divider" />
                  <button className="AdminHeader-user-menu-item logout">
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;