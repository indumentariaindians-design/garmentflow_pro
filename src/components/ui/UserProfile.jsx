import React, { useState } from 'react';
import Icon from '../AppIcon';

const UserProfile = ({ isCollapsed, userRole }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userRoleLabels = {
    admin: 'Administrator',
    manager: 'Production Manager',
    ventas: 'Sales Representative',
    station: 'Station Worker'
  };

  const userInitials = {
    admin: 'AD',
    manager: 'PM',
    ventas: 'SR',
    station: 'SW'
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isCollapsed) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="relative border-t border-border">
      {/* User Profile Button */}
      <button
        onClick={toggleDropdown}
        className={`
          w-full p-4 flex items-center space-x-3
          text-foreground hover:bg-muted
          transition-colors duration-150
          ${isCollapsed ? 'justify-center' : 'justify-start'}
        `}
        title={isCollapsed ? userRoleLabels?.[userRole] : undefined}
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-secondary-foreground">
            {userInitials?.[userRole]}
          </span>
        </div>

        {!isCollapsed && (
          <>
            {/* User Info */}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">
                {userRoleLabels?.[userRole]}
              </p>
              <p className="text-xs text-muted-foreground">
                {userRole === 'admin' ? 'System Admin' : 
                 userRole === 'manager' ? 'Floor Manager' :
                 userRole === 'ventas' ? 'Sales Team' : 'Production Floor'}
              </p>
            </div>

            {/* Dropdown Arrow */}
            <Icon 
              name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} 
              size={16}
              className="text-muted-foreground"
            />
          </>
        )}
      </button>
      {/* Dropdown Menu */}
      {!isCollapsed && isDropdownOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-md shadow-elevated z-50">
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                console.log('Profile settings');
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-2 text-left text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
            >
              <Icon name="User" size={16} className="text-muted-foreground" />
              <span>Profile Settings</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Preferences');
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-2 text-left text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
            >
              <Icon name="Settings" size={16} className="text-muted-foreground" />
              <span>Preferences</span>
            </button>
            
            <div className="border-t border-border my-1"></div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-2 text-left text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors duration-150"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;