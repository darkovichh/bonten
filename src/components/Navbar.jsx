import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket;

export default function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("/api/socket"); // API route’u başlat

    socket = io(undefined, { path: "/api/socket_io" });

    socket.on("connect", () => console.log("Socket bağlandı:", socket.id));
    socket.on("activeUsers", (count) => setActiveUsers(count));

    return () => socket.disconnect();
  }, []);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="left-section">
          <a href="#" className="logo">Bonten</a>

          <div className={`nav-links-container ${menuActive ? "active" : ""}`}>
            <ul className="nav-links">
              <li><a className="active" href="#">Home</a></li>
              <li><a href="#">Add Paste</a></li>
              <li><a href="#">Upgrades</a></li>
              <li><a href="#">Users</a></li>
              <li><a href="#">Support</a></li>
            </ul>

            {windowWidth <= 768 && (
              <ul className="auth-links">
                <li style={{ color: "#00ff7f" }}>Aktif: {activeUsers}</li>
                <li><a href="#">Login</a></li>
                <li><a href="#">Register</a></li>
              </ul>
            )}
          </div>
        </div>

        {windowWidth > 768 && (
          <div className="auth-links-container">
            <ul className="auth-links">
              <li style={{ color: "#00ff7f" }}>Aktif: {activeUsers}</li>
              <li><a href="#">Login</a></li>
              <li><a href="#">Register</a></li>
            </ul>
          </div>
        )}

        {windowWidth <= 768 && (
          <button className="mobile-menu-btn" onClick={toggleMenu}>☰</button>
        )}
      </div>
    </nav>
  );
}
