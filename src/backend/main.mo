import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  let messageStore = Map.empty<Nat, Message>();
  var nextMessageId = 0;

  type Message = {
    id : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  // Create a new message. (Max length 150 characters)
  public shared ({ caller }) func sendMessage(text : Text) : async Nat {
    if (text.size() > 150) {
      Runtime.trap("Text cannot contain more than 150 characters (currently " # text.size().toText() # ")" );
    };

    let newMessage = {
      id = nextMessageId;
      content = text;
      timestamp = Time.now();
    };

    messageStore.add(nextMessageId, newMessage);
    nextMessageId += 1;
    newMessage.id;
  };

  // List all messages (most recent first). Limit 500 messages.
  public query ({ caller }) func listMessages() : async [Message] {
    let messages = messageStore.values().toArray();
    let sortedMessages = messages.reverse();
    let limitedMessages = sortedMessages.sliceToArray(0, Nat.min(500, sortedMessages.size()));
    limitedMessages;
  };

  // Delete a message if it is at least 5 minutes old or does not exist.
  public shared ({ caller }) func deleteMessage(messageId : Nat) : async () {
    switch (messageStore.get(messageId)) {
      case (null) { () };
      case (?message) {
        let fiveMinutes = 5 * 60 * 1000000000;
        if (Time.now() - message.timestamp < fiveMinutes) {
          Runtime.trap("Message cannot be deleted before being at least 5 minutes old");
        };
        messageStore.remove(messageId);
      };
    };
  };

  // Clears old messages (older than 1 hour) and keeps only the latest 500 messages, or 1000 messages if not older than 1h.
  public shared ({ caller }) func trimMessages() : async () {
    let messagesToKeep = Nat.min(messageStore.size(), 500);

    if (nextMessageId == 0) { return () };

    let thresholdId = nextMessageId - 1 : Nat - messagesToKeep + 1;
    let oneHour = 60 * 60 * 1000000000 : Time.Time;

    let messagesToDelete = messageStore.toArray().filter(func((id, message)) { message.timestamp < (Time.now() - oneHour) });
    messagesToDelete.forEach(func((oldId, _)) { messageStore.remove(oldId) });

    for (id in Nat.range(0, thresholdId)) {
      messageStore.remove(id);
    };
  };
};
