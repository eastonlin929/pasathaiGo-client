import React, { useRef, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import AuthService from "../services/auth-service";
const Navigation = ({ currentUser, setCurrentUser }) => {
  const navbarRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const handleClickOutsideNavbar = (e) => {
    if (navbarRef.current && !navbarRef.current.contains(e.target)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideNavbar);
    return () => {
      document.removeEventListener("click", handleClickOutsideNavbar);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout(); //清空localStorage
    setCurrentUser(null);
  };
  return (
    <Navbar ref={navbarRef} expanded={expanded} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          <img
            src="/images/thai-learn-logo.png"
            width="40"
            className="d-inline-block align-bottom"
            style={{ marginRight: "0.5rem", marginLeft: "0.5rem" }}
            alt="Logo"
          />
          PaSaThai GO
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              首頁
            </Nav.Link>
            {!currentUser && (
              <Nav.Link
                as={Link}
                to="register"
                onClick={() => setExpanded(false)}
              >
                加入會員
              </Nav.Link>
            )}
            {!currentUser && (
              <Nav.Link as={Link} to="login" onClick={() => setExpanded(false)}>
                會員登入
              </Nav.Link>
            )}
            {currentUser && (
              <Nav.Link
                as={Link}
                to="profile"
                onClick={() => setExpanded(false)}
              >
                個人頁面
              </Nav.Link>
            )}{" "}
            {currentUser && <Nav.Link onClick={handleLogout}>登出</Nav.Link>}
            <Nav.Link as={Link} to="QA" onClick={() => setExpanded(false)}>
              問答區
            </Nav.Link>
            <NavDropdown title="學習資源" id="basic-nav-dropdown">
              <NavDropdown.Item
                as={Link}
                to="resource"
                onClick={() => setExpanded(false)}
              >
                推薦資源
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="alphabet"
                onClick={() => setExpanded(false)}
              >
                字母表
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="song"
                onClick={() => setExpanded(false)}
              >
                一起來聽歌
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
