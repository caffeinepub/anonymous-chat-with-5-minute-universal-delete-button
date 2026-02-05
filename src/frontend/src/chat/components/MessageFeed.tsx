import { useListMessages } from '../queries';
import { MessageItem } from './MessageItem';
import { Loader2, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MessageFeed() {
  const { data: messages, isLoading, error } = useListMessages();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load messages. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
        <img
          src="/assets/generated/empty-chat-state.dim_512x512.png"
          alt="No messages"
          className="mb-6 h-48 w-48 opacity-50"
        />
        <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No messages yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </h2>
      </div>
      <div className="space-y-3">
        {messages.map((message) => (
          <MessageItem key={message.id.toString()} message={message} />
        ))}
      </div>
    </div>
  );
}
