import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import React, { useState } from "react";
import "./styles/App.css";
import Homepage from "./components/Homepage";
import QA from "./components/QA";
import Resource from "./components/Resource";
import Alphabet from "./components/Alphabet";
import Song from "./components/Song";
import Login from "./components/login";
import Register from "./components/register";
import authService from "./services/auth-service";
import Profile from "./components/Profile";
import ResetPassword from "./components/ResetPassword";
import QADetails from "./components/QADetails";
import Page404 from "./components/Page404";
const App = () => {
  let [currentUser, setCurrentUser] = useState(authService.getCurrentUser);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<Homepage />} />
          <Route path="register" element={<Register />} />
          <Route
            path="login"
            element={
              <Login
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="QA"
            element={
              <QA currentUser={currentUser} setCurrentUser={setCurrentUser} />
            }
          >
            <Route
              path="track"
              element={
                <QA currentUser={currentUser} setCurrentUser={setCurrentUser} />
              }
            />
            <Route
              path="populate"
              element={
                <QA currentUser={currentUser} setCurrentUser={setCurrentUser} />
              }
            />
          </Route>
          <Route path="QA/:messageId" element={<QADetails />} />
          <Route path="resource" element={<Resource />}>
            <Route path="jr" element={<Resource />} />
            <Route path="mid" element={<Resource />} />
            <Route path="sr" element={<Resource />} />
          </Route>
          <Route path="alphabet" element={<Alphabet />} />
          <Route path="song" element={<Song />} />
          <Route
            path="profile"
            element={
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route path="resetpassword" element={<ResetPassword />} />
          <Route path="*" element={<Page404 />} />
          <Route path="404" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
