import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth-service";

const Login = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async () => {
    try {
      let response = await AuthService.login(email, password);
      //可以把response的內容存在localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功，您現在將被導向至個人頁面");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            onChange={handleChangeEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handleChangePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div
          className="form-group"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>登入</span>
          </button>
          <a href="resetPassword" style={{ textDecoration: "none" }}>
            忘記密碼？
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          還沒有會員嗎？
          <a href="register" style={{ textDecoration: "none" }}>
            點此註冊
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
