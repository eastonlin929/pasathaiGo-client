import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  useDeleteMsg,
  useGetMessages,
  useGetURLMessage,
  usePostMessage,
  usePostReply,
} from "../customHooks/qaApi";
import { toast } from "react-toastify";
const QA = ({ currentUser, setCurrentUser }) => {
  const [isPosting, setIsPosting] = useState(null);
  const [isReading, setIsReading] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [ellipsisClick, setEllipsisClick] = useState(false);
  const postBlockRef = useRef(null);
  const DetailsBlockRef = useRef(null);
  const [detailsRef, setDetailsRef] = useState(null);
  const ellipsisRef = useRef(null);
  const deleteConfirmRef = useRef(null);
  const replyRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  //內容為空的錯誤訊息設置
  const toastContentError = () =>
    toast.error("內容不能為空", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      closeButton: false,
      theme: "colored",
    });
  const toastTitleError = () =>
    toast.error("標題不能為空", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      closeButton: false,
      theme: "colored",
    });

  //首次render所有留言
  const { isErrorMsg, data: messages, errorMsg } = useGetMessages();

  //處理發布留言
  const postMessageMutation = usePostMessage();
  const handlePostMessage = async () => {
    if (titleRef.current.value.trim() === "") {
      toastTitleError();
    } else if (contentRef.current.value.trim() === "") {
      toastContentError();
    } else {
      await postMessageMutation.mutateAsync({
        title: titleRef.current.value,
        content: contentRef.current.value,
      });
      setIsPosting(!isPosting);
    }
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
  const postReplyMutation = usePostReply();
  const handlePostReply = async (_id) => {
    if (replyRef.current.value.trim() === "") {
      toastContentError();
    } else {
      await postReplyMutation.mutateAsync({
        _id: _id,
        content: replyRef.current.value,
      });
      replyRef.current.value = "";
      toast.dismiss();
    }
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

  //處理點擊留言
  const { data: readMessage } = useGetURLMessage(messageId, messageId !== null);
  const handleClickMsg = (_id) => {
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
    window.history.pushState(null, "", "/QA");
    setDetailsRef(null);
    window.removeEventListener("popstate", onClose);
  };
  useEffect(() => {
    if (isReading) {
      window.addEventListener("popstate", onClose);
    } else {
      window.removeEventListener("popstate", onClose);
    }
    // eslint-disable-next-line
  }, [isReading]);

  //處理點擊區塊外關閉
  const handleClickOutsideDetails = (e) => {
    let currentElement = e.target;
    while (currentElement) {
      if (
        currentElement.classList.contains("Toastify__toast-container") ||
        currentElement.classList.contains("Toastify__toast") ||
        currentElement.classList.contains("Toastify__close-button")
      ) {
        return; // 如果是 toast 相關元件，直接返回
      }
      currentElement = currentElement.parentElement;
    }
    if (
      isReading &&
      readMessage &&
      detailsRef &&
      !DetailsBlockRef?.current?.contains(e.target) &&
      !deleteConfirmRef.current
    ) {
      setIsReading(false);
      setMessageId(null);
      setEllipsisClick(false);
      window.history.pushState(null, "", "/QA");
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
    // eslint-disable-next-line
  }, [detailsRef]);

  const handleClickOutsidePosting = (e) => {
    let currentElement = e.target;
    while (currentElement) {
      if (
        currentElement.classList.contains("Toastify__toast-container") ||
        currentElement.classList.contains("Toastify__toast") ||
        currentElement.classList.contains("Toastify__close-button")
      ) {
        return; // 如果是 toast 相關元件，直接返回
      }
      currentElement = currentElement.parentElement;
    }
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
    // eslint-disable-next-line
  }, [isPosting]);

  //刪除完成訊息通知
  const toastDeleteMsg = () =>
    toast.success("刪除成功！", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      closeButton: false,
      theme: "colored",
    });
  //刪除留言處理
  const handleDeleteConfirm = (_id, e) => {
    e.stopPropagation();
    setDeleteConfirm(_id);
    setEllipsisClick(false);
  };
  const deleteMsgMutation = useDeleteMsg();
  const handleDeleteMessage = async (_id, e) => {
    e.stopPropagation();
    await deleteMsgMutation.mutateAsync({ _id });
    navigate("/QA");
    setDeleteConfirm(false);
    setIsReading(null);
    toastDeleteMsg();
  };

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
                      ref={titleRef}
                    />
                    <textarea
                      className="content"
                      type="text"
                      placeholder="內容"
                      ref={contentRef}
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
                      ref={replyRef}
                    />
                    <button
                      onClick={() => {
                        handlePostReply(readMessage._id);
                      }}
                    >
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
          {messages && messages.length === 0 ? (
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
                          handleClickMsg(message._id);
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
            <div style={{ textAlign: "center" }}>加載中...</div>
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
    </div>
  );
};

export default QA;
