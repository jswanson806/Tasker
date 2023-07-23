import React from 'react';
import Router from './Router.js';
import NavBar from './NavBar.js';
import './styles/App.css';
import { TokenProvider } from '../helpers/TokenContext.js';

/** App Component
 * 
 * Handles the rendering of the NavBar and Router components.
 * 
 * Uses TokenProvider to provide global access to the token
 * 
 */

function App() {

  return (
        <TokenProvider>
          <NavBar />
          <Router />
        </TokenProvider>
  );
}

export default App;