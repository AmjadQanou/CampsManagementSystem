import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './AuthProvider';
import {TokenContextProvider} from './TokenContext'    
import { DataContextProvider } from './DataContext';
import ApiContextProvider from './Context/ApiContext';
    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
          <AuthProvider>
           <TokenContextProvider>
            <ApiContextProvider>
            <DataContextProvider>
           
            <App />

            </DataContextProvider>
          </ApiContextProvider>
           </TokenContextProvider>
          </AuthProvider>
        </React.StrictMode>
      );