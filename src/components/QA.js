import React, { useState, useEffect, useRef, useCallback } from "react";
import QAService from "../services/QA-service";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGetMessages, useGetURLMessage } from "../customHooks/qaApi";
const QA = ({ currentUser, setCurrentUser }) => {
  const [newMessage, setNewMessage] = useState({ title: "", content: "" });
  const [isPosting, setIsPosting] = useState(null);
  const [isReading, setIsReading] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [newReply, setNewReply] = useState({ content: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [ellipsisClick, setEllipsisClick] = useState(false);
  const postBlockRef = useRef(null);
  const DetailsBlockRef = useRef(null);
  const [detailsRef, setDetailsRef] = useState(null);
  const ellipsisRef = useRef(null);
  const deleteConfirmRef = useRef(null);
  const [deletedMsg, setDeletedMsg] = useState("");
  const navigate = useNavigate();
  //首次render所有留言
  const { isErrorMsg, data: messages, errorMsg } = useGetMessages();

  //處理發布留言
  const handlePostMessage = () => {
    QAService.postMessage(newMessage.title, newMessage.content).then((data) => {
      // setMessages([...messages, data]);
      setNewMessage({ title: "", content: "" });
      setIsPosting(!isPosting);
    });
  };
  useEffect(() => {
    if (isPosting || isReading) {
      document.body.classList.add("overflowHidden");
    } else {
      document.body.classList.remove("overflowHidden");
    }
    return () => {
      document.body.classList.remove("overflowHidden");
    };
  }, [isPosting, isReading]);

  //處理新回覆
  const handlePostReply = (_id) => {
    QAService.postReply(_id, newReply.content)
      .then((data) => {
        setNewReply({ content: "" });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //處理時間顯示
  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;
    switch (true) {
      case secondsPast < 60:
        return "幾秒前";
      case secondsPast < 3600:
        return parseInt(secondsPast / 60) + " 分鐘";
      case secondsPast <= 86400:
        return parseInt(secondsPast / 3600) + " 小時";
      case secondsPast < 86400 * 7:
        return parseInt(secondsPast / 86400) + " 天";
      default:
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + "年" + month + "月" + day + "日";
    }
  }
  //處理輸入框外觀
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);
  useEffect(() => {
    return () => {
      window.addEventListener("popstate", onClose);
    };
  }, []);
  //處理點擊留言
  const { data: readMessage } = useGetURLMessage(messageId, messageId !== null);
  const handleClick = (_id) => {
    if (_id) {
      setMessageId(_id);
      setIsReading(true);
      window.history.pushState(null, "", "QA/" + _id);
    }
  };

  useEffect(() => {
    if (readMessage && DetailsBlockRef) {
      setDetailsRef(DetailsBlockRef);
    }
  }, [readMessage, DetailsBlockRef]);
  //處理QADetails關閉
  const onClose = () => {
    setIsPosting("");
    setIsReading(false);
    setMessageId(null);
    setEllipsisClick(false);
    setMessageId(null);
    window.history.replaceState(null, "", "/QA");
    setDetailsRef(null);
  };
  //處理點擊區塊外關閉
  const handleClickOutsideDetails = (e) => {
    if (
      isReading &&
      readMessage &&
      detailsRef &&
      !DetailsBlockRef.current.contains(e.target) &&
      !deleteConfirmRef.current
    ) {
      setIsReading(false);
      setMessageId(null);
      setEllipsisClick(false);
      window.history.replaceState(null, "", "/QA");
      setDetailsRef(null);
    } else {
      return;
    }
    if (ellipsisRef.current && !ellipsisRef.current.contains(e.target)) {
      setEllipsisClick(false);
    }
    if (
      deleteConfirmRef.current &&
      !deleteConfirmRef.current.contains(e.target)
    ) {
      setDeleteConfirm(false);
    }
  };
  // console.log("readMessage " + readMessage);
  // console.log("isReading " + isReading);
  useEffect(() => {
    if (detailsRef) {
      document.addEventListener("click", handleClickOutsideDetails);
    } else {
      document.removeEventListener("click", handleClickOutsideDetails);
    }
    return () => {
      document.removeEventListener("click", handleClickOutsideDetails);
    };
  }, [detailsRef]);

  const handleClickOutsidePosting = (e) => {
    if (
      isPosting &&
      postBlockRef.current &&
      !postBlockRef.current.contains(e.target)
    ) {
      setIsPosting(null);
    }
  };

  useEffect(() => {
    if (isPosting) {
      document.addEventListener("click", handleClickOutsidePosting);
    } else {
      document.removeEventListener("click", handleClickOutsidePosting);
    }
    return () => {
      document.removeEventListener("click", handleClickOutsidePosting);
    };
  }, [isPosting]);
  //刪除留言處理
  const handleDeleteConfirm = (_id, e) => {
    e.stopPropagation();
    setDeleteConfirm(_id);
    setEllipsisClick(false);
  };
  const handleDeleteMessage = useCallback((_id, e) => {
    e.stopPropagation();
    QAService.deleteMessage(_id).then((data) => {
      setDeletedMsg(data);
      setTimeout(() => {
        setDeletedMsg("");
      }, 5000);
    });
    setDeleteConfirm(false);
    setIsReading(null);
  }, []);
  useEffect(() => {
    if (deletedMsg) {
      QAService.getMessages()
        .then((data) => {
          if (data && data.length !== 0) {
            // setMessages(data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      navigate("/QA");
    }
  }, [deletedMsg]);
  // useEffect(() => {
  //   QAService.getMessages()
  //     .then((data) => {
  //       if (data && data.length !== 0) {
  //         // setMessages(data);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }, [handleDeleteMessage]);
  return (
    <div>
      <section className="QASearch">
        <textarea className="QASearch" placeholder="問題搜尋" />
        <button className="QASearch">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </section>
      <section className="QABlock">
        <div className="QABorder">
          <div className="QANav">
            <NavLink to="/QA" end>
              全部
            </NavLink>
            <NavLink to="/QA/track">追蹤</NavLink>
            <NavLink to="/QA/populate">熱門</NavLink>
          </div>
          <hr />
          <div className="post">
            <button
              onClick={(e) => {
                setIsPosting(!isPosting);
                e.stopPropagation();
              }}
            >
              有什麼想問嗎？ 立即發問
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
          <div className="postBlock">
            {isPosting && (
              <div className="QAPost" ref={postBlockRef}>
                {currentUser ? (
                  <div>
                    <button
                      className="xMark"
                      onClick={() => setIsPosting(!isPosting)}
                    >
                      <i className="fa-solid fa-xmark fa-2xl"></i>
                    </button>
                    <textarea
                      className="title"
                      type="text"
                      placeholder="標題"
                      value={newMessage.title}
                      onChange={(e) =>
                        setNewMessage({ ...newMessage, title: e.target.value })
                      }
                    />
                    <textarea
                      className="content"
                      type="text"
                      placeholder="內容"
                      value={newMessage.content}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          content: e.target.value,
                        })
                      }
                    />
                    <button className="post" onClick={handlePostMessage}>
                      發布
                    </button>
                  </div>
                ) : (
                  <div className="unAuth">
                    <button
                      className="xMark"
                      onClick={() => setIsPosting(!isPosting)}
                    >
                      <i className="fa-solid fa-xmark fa-2xl"></i>
                    </button>
                    <div className="redirectToAuth">
                      <Link to="/login">必須登入才能夠留言，點擊此處登入</Link>
                      <Link to="/register">還沒有會員嗎？點擊此處註冊</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {isReading && readMessage && (
            <div className="DetailsBlockBg">
              <div className="DetailsBlock" ref={DetailsBlockRef}>
                <div className="close">
                  <button className="xMark" onClick={onClose}>
                    <i className="fa-solid fa-xmark fa-2xl"></i>
                  </button>
                </div>
                <div className="messageSelf">
                  <div className="inform">
                    <div className="QAPoster">
                      {readMessage.user.nickname
                        ? readMessage.user.nickname
                        : readMessage.user.username}
                    </div>
                    <div
                      className="QATimer"
                      title={new Date(readMessage.time).toLocaleString(
                        "zh-TW",
                        {
                          hour12: true,
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          weekday: "long",
                        }
                      )}
                    >
                      {timeAgo(readMessage.time)}
                    </div>
                  </div>
                  <div className="QAModifyBlock">
                    <button
                      ref={ellipsisRef}
                      onClick={() => setEllipsisClick(!ellipsisClick)}
                    >
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    {ellipsisClick &&
                      (currentUser == null ||
                      currentUser.user._id !== readMessage.user._id ? (
                        <div className="modifyOption">
                          <button className="report">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            檢舉留言
                          </button>
                        </div>
                      ) : (
                        <div className="modifyOption">
                          <button
                            className="deleteBtn"
                            onClick={(e) =>
                              handleDeleteConfirm(readMessage._id, e)
                            }
                          >
                            刪除留言
                          </button>
                          <button className="editBtn">編輯留言</button>
                        </div>
                      ))}
                  </div>
                  <div className="QATitle">{readMessage.title}</div>
                  <div className="QAContent">{readMessage.content}</div>
                </div>
                {readMessage.replies.length > 0 ? (
                  <div className="replyBlock">
                    <p>全部留言</p>
                    <ul>
                      <hr />
                      {readMessage.replies.map((replies, index) => (
                        <li key={index}>
                          <div className="replyUser">
                            {replies.user.nickname
                              ? replies.user.nickname
                              : replies.user.username}
                          </div>
                          <div className="replyTimer">
                            {timeAgo(replies.time)}
                          </div>
                          <div className="replyContent">{replies.content}</div>
                          <hr />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="replyBlock">
                    <p>全部留言</p>
                    <ul>
                      <hr />
                      <div>目前沒有留言，趕緊搶頭香</div>
                    </ul>
                  </div>
                )}
                {currentUser ? (
                  <div className="postReply">
                    <textarea
                      className="reply"
                      placeholder="留言......"
                      type="text"
                      value={newReply.content}
                      onChange={(e) =>
                        setNewReply({ ...newReply, content: e.target.value })
                      }
                    />
                    <button onClick={() => handlePostReply(readMessage._id)}>
                      送出
                    </button>
                  </div>
                ) : (
                  <div className="postReply">
                    <Link to="/login">必須登入才能夠留言，點擊此處登入</Link>
                    <hr />
                    <Link to="/register">還沒有會員嗎？點擊此處註冊</Link>
                  </div>
                )}
              </div>
            </div>
          )}
          {messages && messages.length == 0 ? (
            <div style={{ margin: "2rem", textAlign: "center" }}>
              目前還沒有留言哦
            </div>
          ) : messages ? (
            <div className="QA">
              <div>
                <ul>
                  {messages.map((message, index) => (
                    <li key={index}>
                      <div
                        onClick={() => {
                          handleClick(message._id);
                        }}
                      >
                        <div className="inform">
                          <div className="QAPoster">
                            {message.user.nickname
                              ? message.user.nickname
                              : message.user.username}
                          </div>{" "}
                          <div
                            className="QATimer"
                            title={new Date(message.time).toLocaleString(
                              "zh-TW",
                              {
                                hour12: true,
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                weekday: "long",
                              }
                            )}
                          >
                            {timeAgo(message.time)}
                          </div>
                        </div>
                        <div className="QATitle">{message.title}</div>
                        <div className="QAContent">{message.content}</div>
                        <hr />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>加載中...</div>
          )}
          {isErrorMsg && <div>{errorMsg.message}</div>}
        </div>
      </section>
      <section className="confirmBlock">
        {deleteConfirm && (
          <div className="confirmBG">
            <div className="deleteConfirmBlock" ref={deleteConfirmRef}>
              <p>刪除後就不能復原，確定要刪除嗎？</p>
              <button
                className="deleteCancel"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(false);
                }}
              >
                取消
              </button>
              <button
                className="deleteCheck"
                onClick={(e) => handleDeleteMessage(readMessage._id, e)}
              >
                確認刪除
              </button>
            </div>
          </div>
        )}
      </section>
      {deletedMsg && (
        <div className={`deletedMsg ${deletedMsg ? " active" : ""}`}>
          {deletedMsg}
        </div>
      )}
    </div>
  );
};

export default QA;
