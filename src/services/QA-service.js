import axios from "axios";
const API_URL = "https://pasathaigoapi.onrender.com/api/messages";

class MessageService {
  getMessages() {
    return axios
      .get(API_URL, {})
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  //獲得特定留言
  getURLMessage(_id) {
    return axios
      .get(API_URL + "/" + _id, {})
      .then((response) => {
        return response.data[0];
      })
      .catch((e) => {
        console.log(e);
      });
  }
  //獲得使用者留言
  getUserMessages(user_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios
      .get(API_URL + "/userReply/" + user_id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  //新增留言
  postMessage(title, content) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios
      .post(
        API_URL,
        { title: title, content: content },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  //刪除留言
  deleteMessage(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios
      .delete(API_URL + "/" + _id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        return response.data.msg;
      })
      .catch((e) => {
        return e.response.data;
      });
  }
  //新增回覆
  postReply(_id, content) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios
      .post(
        API_URL + "/" + _id + "/reply",
        { content: content },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
// eslint-disable-next-line
export default new MessageService();
