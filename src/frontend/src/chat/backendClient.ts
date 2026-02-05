import { useActor } from '../hooks/useActor';
import type { Message } from '../backend';

export function useBackendClient() {
  const { actor, isFetching } = useActor();

  return {
    actor,
    isFetching,
    sendMessage: async (text: string): Promise<bigint> => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.sendMessage(text);
    },
    listMessages: async (): Promise<Message[]> => {
      if (!actor) return [];
      return actor.listMessages();
    },
    deleteMessage: async (messageId: bigint): Promise<void> => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMessage(messageId);
    },
  };
}
