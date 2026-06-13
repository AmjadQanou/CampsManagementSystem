import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./AuthProvider";
import { TokenContextProvider } from "./TokenContext";
import { DataContextProvider } from "./DataContext";
import ApiContextProvider from "./Context/ApiContext";
import { OrgStatusProvider } from "./Context/OrgStatusContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <TokenContextProvider>
        <OrgStatusProvider>
          <ApiContextProvider>
            <DataContextProvider>
              <App />
            </DataContextProvider>
          </ApiContextProvider>
        </OrgStatusProvider>
      </TokenContextProvider>
    </AuthProvider>
  </React.StrictMode>,
);
