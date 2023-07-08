import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { ProfileDataProvider } from "./contexts/ProfileDataContext";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrentUserProvider>
          <ProfileDataProvider>
            <App />
          </ProfileDataProvider>
        </CurrentUserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
