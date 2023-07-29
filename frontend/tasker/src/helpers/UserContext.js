import React, { createContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider for the context
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user') || '');

  // Function to update the user in the state and localStorage
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
