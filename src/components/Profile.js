import { useState, useEffect } from "react";
import profileService from "../services/profile-service";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserMessages } from "../customHooks/qaApi";
const Profile = ({ currentUser, setCurrentUser }) => {
  let [nickname, setNickname] = useState("");
  let [isModifying, setIsModifying] = useState(true);
  let [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser && currentUser.user.nickname) {
      setNickname(currentUser.user.nickname);
    }
    if (currentUser) {
      setCurrentUserId(currentUser.user._id);
    }
  }, [currentUser]);
  const { data: userMessages } = useGetUserMessages(
    currentUserId,
    currentUserId !== null
  );
  useEffect(() => {
    if (userMessages == []) {
      return false;
    }
  }, [userMessages]);
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const modifyNickname = () => {
    const userId = currentUser.user._id;
    const newNicknameValue = nickname;
    if (!currentUser.user.nickname) {
      // 如果暱稱不存在，執行 POST 請求
      profileService
        .post(nickname)
        .then(() => {
          setCurrentUser((prevUser) => ({
            ...prevUser,
            user: {
              ...prevUser.user,
              nickname,
            },
          }));
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      // 如果暱稱已存在，執行 PATCH 請求
      profileService
        .patch({ userId, newNickname: newNicknameValue })
        .then(() => {
          setCurrentUser((prevUser) => ({
            ...prevUser,
            user: {
              ...prevUser.user,
              nickname: newNicknameValue,
            },
          }));
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };
  //處理時間顯示
  function timeAgo(dateString) {
    const date = new Date(dateString);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    return year + "年" + month + "月";
  }
  return (
    <div>
      {!currentUser && (
        <div>
          <p>在獲取您的個人資料之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            點擊此處登入
          </button>
        </div>
      )}
      {currentUser && (
        <div className="profileContent">
          <section className="userData">
            <h2>會員資料：</h2>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <strong>用戶名稱：{currentUser.user.username}</strong>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ width: "auto" }}>暱稱：</strong>
                    {isModifying ? (
                      <strong style={{ width: "auto" }}>{nickname}</strong>
                    ) : (
                      <input
                        type="text"
                        value={nickname}
                        onChange={handleNicknameChange}
                        style={{ width: "auto" }}
                      />
                    )}
                    <button
                      className="btn btn-primary btn-block"
                      style={{ width: "auto", marginLeft: "auto" }}
                      onClick={() => {
                        if (!isModifying) {
                          modifyNickname();
                        }
                        setIsModifying(!isModifying);
                      }}
                    >
                      {isModifying ? "修改暱稱" : "儲存暱稱"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>您的電子信箱: {currentUser.user.email}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className="messagePosted">
            <h2>您發布過的留言：</h2>
            <div className="postedBlock">
              <ul>
                {!userMessages ? (
                  <p>您尚未發布過留言</p>
                ) : (
                  userMessages.map((msg, index) => (
                    <div key={index}>
                      <p className="timer">{timeAgo(msg.time)}</p>
                      <div className="postedListBlock">
                        <li key={index}>
                          <Link to={`/QA/${msg._id}`}>{msg.title}</Link>
                        </li>
                      </div>
                    </div>
                  ))
                )}
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Profile;
