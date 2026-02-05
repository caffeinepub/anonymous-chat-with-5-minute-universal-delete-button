import { useState, useEffect } from 'react';
import type { Message } from '../../backend';
import { useDeleteMessage } from '../queries';
import { isMessageDeletable, formatTimestamp, getTimeUntilDeletable } from '../time';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const [isDeletable, setIsDeletable] = useState(isMessageDeletable(message.timestamp));
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilDeletable(message.timestamp));
  const deleteMessage = useDeleteMessage();

  useEffect(() => {
    const interval = setInterval(() => {
      const deletable = isMessageDeletable(message.timestamp);
      const remaining = getTimeUntilDeletable(message.timestamp);
      
      setIsDeletable(deletable);
      setTimeRemaining(remaining);

      if (deletable) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [message.timestamp]);

  const handleDelete = async () => {
    try {
      await deleteMessage.mutateAsync(message.id);
      toast.success('Message deleted');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      
      if (errorMessage.includes('5 minutes')) {
        toast.error('This message cannot be deleted yet. Please wait until it is at least 5 minutes old.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTimestamp(message.timestamp)}</span>
            {!isDeletable && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                Deletable in {formatTimeRemaining(timeRemaining)}
              </span>
            )}
          </div>
        </div>

        {isDeletable && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                disabled={deleteMessage.isPending}
              >
                {deleteMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The message will be permanently removed from the chat.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
