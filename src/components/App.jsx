import React, { useState } from "react";
import AddSiteForm from "./AddSiteForm";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import "./styles.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      <header>
        <h1>Uptime Monitor</h1>
        {token && <button onClick={handleLogout}>Logout</button>}
      </header>
      {token ? (
        <div>
          <AddSiteForm token={token} />
          <Dashboard token={token} />
        </div>
      ) : (
        <Auth setToken={setToken} />
      )}
    </div>
  );
};

export default App;