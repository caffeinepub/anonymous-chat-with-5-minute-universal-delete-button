import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBackendClient } from './backendClient';
import type { Message } from '../backend';

const MESSAGES_QUERY_KEY = ['messages'];

export function useListMessages() {
  const { actor, isFetching: isActorFetching } = useBackendClient();

  return useQuery<Message[]>({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMessages();
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

export function useSendMessage() {
  const { sendMessage } = useBackendClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      return sendMessage(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
}

export function useDeleteMessage() {
  const { deleteMessage } = useBackendClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      return deleteMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
}
