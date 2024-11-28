import React, { useEffect, useState } from "react";

const Dashboard = ({ token }) => {
  const [sites, setSites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchSites = async () => {
      const response = await fetch("http://localhost:3000/api/sites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSites(data);
    };
    const fetchNotifications = async () => {
      const response = await fetch("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNotifications(data);
    };

    fetchSites();
    fetchNotifications();
  }, [token]);

  return (
    <div>
      <h2>Monitored Sites</h2>
      {sites.map((site) => (
        <div key={site._id}>
          <h3>{site.url}</h3>
          <p>Status: {site.status}</p>
        </div>
      ))}

      <h2>Admin Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification._id}>
          <p>{notification.message}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;