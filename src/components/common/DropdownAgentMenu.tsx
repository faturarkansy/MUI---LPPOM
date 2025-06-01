import React, { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  isActive: boolean;
  onEditUser: () => void;
  onDeleteUser: () => void;
  onToggleStatus: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userName,
  userEmail,
  isActive,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <div className="user-card-container relative">
      <div className="user-card flex justify-between items-center p-4 rounded-lg border border-gray-200">
        <div className="user-info">
          <h3 className="text-lg font-medium">{userName}</h3>
          <p className="text-sm text-gray-600">{userEmail}</p>
          <span
            className={`text-sm ${
              isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isActive ? "Active" : "Non Active"}
          </span>
        </div>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="menu-button bg-gray-900 text-white rounded-lg p-2 flex items-center justify-center"
          aria-label="User menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleAction(onEditUser)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Edit User
            </button>
            <button
              onClick={() => handleAction(onToggleStatus)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              {isActive ? "Deactivate" : "Activate"} User
            </button>
            <button
              onClick={() => handleAction(onDeleteUser)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
              role="menuitem"
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Usage example component
const UserCardWithMenu: React.FC = () => {
  const handleEditUser = () => {
    console.log("Edit user clicked");
    // Implementasi untuk edit user
  };

  const handleDeleteUser = () => {
    console.log("Delete user clicked");
    // Implementasi untuk delete user
  };

  const handleToggleStatus = () => {
    console.log("Toggle status clicked");
    // Implementasi untuk toggle status
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <UserMenu
        userName="Hendi Yak"
        userEmail="hendi@email.com"
        isActive={false}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default UserCardWithMenu;
