import React, { useState } from 'react';
import Icon from '../AppIcon';

const NavigationItem = ({ 
  item, 
  isCollapsed, 
  isActive, 
  hasActiveChild, 
  onNavigate, 
  userRole 
}) => {
  const [isExpanded, setIsExpanded] = useState(hasActiveChild(item?.children));

  const handleClick = () => {
    if (item?.path) {
      onNavigate(item?.path);
    } else if (item?.children) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleChildClick = (childPath) => {
    onNavigate(childPath);
  };

  const filteredChildren = item?.children?.filter(child => 
    child?.roles?.includes(userRole)
  );

  const itemIsActive = item?.path ? isActive(item?.path) : hasActiveChild(item?.children);

  return (
    <div className="space-y-1">
      {/* Main Item */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center p-3 rounded-md text-left
          transition-all duration-150 ease-out group
          ${itemIsActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-foreground hover:bg-muted hover:text-foreground'
          }
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}
        title={isCollapsed ? item?.tooltip || item?.label : undefined}
      >
        <div className="flex items-center space-x-3">
          <Icon 
            name={item?.icon} 
            size={20} 
            className={`
              ${itemIsActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
              transition-colors duration-150
            `}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm">{item?.label}</span>
          )}
        </div>
        
        {!isCollapsed && item?.children && filteredChildren?.length > 0 && (
          <Icon 
            name={isExpanded ? "ChevronDown" : "ChevronRight"} 
            size={16}
            className={`
              ${itemIsActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
              transition-all duration-150
            `}
          />
        )}
      </button>
      {/* Children Items */}
      {!isCollapsed && item?.children && filteredChildren?.length > 0 && (
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="ml-6 space-y-1 pt-1">
            {filteredChildren?.map((child, childIndex) => (
              <button
                key={childIndex}
                onClick={() => handleChildClick(child?.path)}
                className={`
                  w-full flex items-center p-2 rounded-md text-left
                  transition-all duration-150 ease-out group
                  ${isActive(child?.path)
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon 
                  name={child?.icon} 
                  size={16} 
                  className={`
                    mr-3
                    ${isActive(child?.path) ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                    transition-colors duration-150
                  `}
                />
                <span className="text-sm">{child?.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationItem;