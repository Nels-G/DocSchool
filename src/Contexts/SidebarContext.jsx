import React, { createContext, useState, useEffect } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Fonction pour obtenir les styles du contenu principal
  const getMainContentStyles = () => {
    const baseStyles = {
      marginLeft: collapsed ? '80px' : '250px',
      width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
      transition: 'margin-left 0.3s ease, width 0.3s ease'
    };

    if (isMobile) {
      return {
        ...baseStyles,
        marginLeft: '70px',
        width: 'calc(100% - 70px)'
      };
    }

    return baseStyles;
  };

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      isMobile, 
      toggleCollapse,
      getMainContentStyles
    }}>
      {children}
    </SidebarContext.Provider>
  );
};