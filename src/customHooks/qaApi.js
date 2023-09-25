import { useQuery } from "@tanstack/react-query";
import QAService from "../services/QA-service";

export function useGetMessages() {
  return useQuery(["messages"], QAService.getMessages);
}

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
