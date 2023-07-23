import React, { createContext, useState } from 'react';

// Create the context
const TokenContext = createContext();

// Create a provider for the context
const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Function to update the token in the state and localStorage
  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <TokenContext.Provider value={{ token, updateToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export { TokenContext, TokenProvider };
