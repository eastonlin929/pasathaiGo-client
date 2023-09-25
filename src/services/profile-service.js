import axios from "axios";
const API_URL = "https://pasathaigoapi.onrender.com/api/profile";

class ProfileService {
  post(nickname) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      { nickname: nickname },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  patch(nickname) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL,
      { nickname },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}
// eslint-disable-next-line
export default new ProfileService();
