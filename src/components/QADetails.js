import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QAService from "../services/QA-service";

const QADetails = () => {
  const [readMessage, setReadMessage] = useState([]);
  const { messageId } = useParams();
  const [reply, setReply] = useState([]);
  const [newReply, setNewReply] = useState({ content: "" });
  const navigate = useNavigate();
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
  //處理新回覆
  const handlePostReply = (_id) => {
    QAService.postReply(_id, newReply.content)
      .then((data) => {
        setReply(data);
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

  return (
    <div>
      {!readMessage.user ? (
        <div className="singleDetailsBlock">
          <div className="messageSelf">
            <div className="inform">
              <div className="QAPoster">載入中...</div>
            </div>
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
                  value={newReply.content}
                  onChange={(e) =>
                    setNewReply({ ...newReply, content: e.target.value })
                  }
                />
                <button onClick={() => handlePostReply(readMessage._id)}>
                  送出
                </button>
              </div>
            </div>
          )}
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
                <p>全部留言</p>
                <ul>
                  <hr />
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
                  value={newReply.content}
                  onChange={(e) =>
                    setNewReply({ ...newReply, content: e.target.value })
                  }
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
