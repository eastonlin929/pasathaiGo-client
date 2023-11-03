import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import QAService from "../services/QA-service";

//取得所有訊息
export function useGetMessages() {
  return useQuery(["messages"], QAService.getMessages);
}
//取得特定URL的訊息
export function useGetURLMessage(_id, isId) {
  return useQuery({
    queryKey: ["readMessages", _id],
    queryFn: async () => {
      const data = await QAService.getURLMessage(_id);
      return data;
    },
    enabled: isId,
  });
}
//取得使用者的訊息
export function useGetUserMessages(user_id, isId) {
  return useQuery({
    queryKey: ["userMessages", user_id],
    queryFn: async () => {
      const data = await QAService.getUserMessages(user_id);
      return data;
    },
    enabled: isId,
  });
}
//發布問題
export function usePostMessage() {
  const queryClient = useQueryClient();
  const postMessageMutation = useMutation(
    (data) => {
      return QAService.postMessage(data.title, data.content);
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.setQueryData(["messages", data._id], data);
        queryClient.invalidateQueries(["messages"], { exact: true });
      },
    }
  );
  return postMessageMutation;
}
//發布回答
export function usePostReply() {
  const queryClient = useQueryClient();
  const postReplyMutation = useMutation(
    (data) => QAService.postReply(data._id, data.content),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["readMessages", data.id], data);
        queryClient.invalidateQueries(["readMessages"]);
      },
    }
  );
  return postReplyMutation;
}
//刪除留言or回覆
export function useDeleteMsg() {
  const queryClient = useQueryClient();
  const deleteMsgMutation = useMutation(
    (data) => QAService.deleteMessage(data._id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["messages"]);
      },
    }
  );
  return deleteMsgMutation;
}
