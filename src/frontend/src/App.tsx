import { MessageFeed } from './chat/components/MessageFeed';
import { MessageComposer } from './chat/components/MessageComposer';
import { MessageSquare } from 'lucide-react';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Anonymous Chat</h1>
              <p className="text-sm text-muted-foreground">
                Share your thoughts freely. Messages become deletable after 5 minutes.
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-24 overflow-hidden">
          <img
            src="/assets/generated/anon-chat-header.dim_1600x400.png"
            alt="Chat header"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-4xl flex-1 space-y-6">
          {/* Message Feed */}
          <MessageFeed />

          {/* Message Composer */}
          <MessageComposer />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
