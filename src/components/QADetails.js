import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QAService from "../services/QA-service";
import { usePostReply } from "../customHooks/qaApi";
import { toast } from "react-toastify";
const QADetails = () => {
  const [readMessage, setReadMessage] = useState([]);
  const { messageId } = useParams();
  const [reply, setReply] = useState([]);
  const navigate = useNavigate();
  const replyRef = useRef(null);

  //渲染詳細資料
  //首次渲染詳細留言內容
  useEffect(() => {
    QAService.getURLMessage(messageId)
      .then((data) => {
        setReadMessage(data);
        setReply(data.replies);
      })
      .catch((e) => {
        navigate("/404");
      });
  });
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

  return (
    <div>
      {!readMessage.user ? (
        <div className="singleDetailsBlock">
          <div className="messageSelf">
            <div className="inform">
              <div className="QAPoster">載入中...</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="singleDetailsBlock">
          <div className="messageSelf">
            <div className="inform">
              <div className="QAPoster">
                {readMessage.user.nickname
                  ? readMessage.user.nickname
                  : readMessage.user.username}
              </div>
              <div
                className="QATimer"
                title={new Date(readMessage.time).toLocaleString("zh-TW", {
                  hour12: true,
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  weekday: "long",
                })}
              >
                {timeAgo(readMessage.time)}
              </div>
            </div>
            <div className="QATitle">{readMessage.title}</div>
            <div className="QAContent">{readMessage.content}</div>
          </div>
          {reply && (
            <div>
              <div className="replyBlock">
                <ul>
                  {reply.map((replies, index) => (
                    <li key={index}>
                      <div className="replyUser">
                        {replies.user.nickname
                          ? replies.user.nickname
                          : replies.user.username}
                      </div>
                      <div className="replyTimer">{timeAgo(replies.time)}</div>
                      <div className="replyContent">{replies.content}</div>
                      <hr />
                    </li>
                  ))}
                </ul>
              </div>{" "}
              <div className="postReply">
                <textarea
                  className="reply"
                  placeholder="留言......"
                  type="text"
                  ref={replyRef}
                />
                <button onClick={() => handlePostReply(readMessage._id)}>
                  送出
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QADetails;
