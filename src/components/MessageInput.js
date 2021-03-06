import { useState, useContext } from "react";
import { ChatClientContext } from "../ChatClientContext";
import { getOtherMember } from "../utils/getOtherMember";

export default function MessageInput({ channel }) {
  const chatClient = useContext(ChatClientContext);
  const [message, setMessage] = useState("");

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    message &&
      // There are many possible fields to include with channel.sendMessage()
      // We will simply send a text field
      //   https://getstream.io/chat/docs/javascript/send_message/?language=javascript
      channel
        .sendMessage({ text: message })
        .then(() => setMessage(""))
        .catch((err) => console.error(err));
  };

  const to = getOtherMember(channel, chatClient);

  return (
    <form onSubmit={handleSubmitMessage}>
      <input
        autoFocus
        value={message}
        type="text"
        className="message-input"
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Message ${to}...`}
      />
    </form>
  );
}
