import { useState } from 'react';
import { useSendMessage } from '../queries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function MessageComposer() {
  const [message, setMessage] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error('Please enter a message');
      return;
    }

    if (trimmedMessage.length > 150) {
      toast.error('Message cannot exceed 150 characters');
      return;
    }

    try {
      await sendMessage.mutateAsync(trimmedMessage);
      setMessage('');
      toast.success('Message sent');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > 150;

  return (
    <div className="sticky bottom-0 border-t border-border bg-card p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts anonymously..."
            className="min-h-[100px] resize-none pr-16"
            disabled={sendMessage.isPending}
          />
          <div
            className={`absolute bottom-3 right-3 text-xs ${
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {characterCount}/150
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={sendMessage.isPending || !message.trim() || isOverLimit}
            className="gap-2"
          >
            {sendMessage.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
