import { useContext } from "react";
import { ChatClientContext } from "../ChatClientContext";
import { getOtherMember } from "../utils/getOtherMember";
import { stringToHslColor } from "../utils/stringToHslColor";

export default function Avatar({ userOrChannel }) {
  const chatClient = useContext(ChatClientContext);
  let name = userOrChannel.id;
  if (userOrChannel.state) {
    name = getOtherMember(userOrChannel, chatClient);
  }

  function isOnline(user) {
    return user.online ? "online" : "";
  }

  return (
    <div
      className={`avatar ${isOnline(userOrChannel)}`}
      style={{
        backgroundColor: stringToHslColor(name, 50, 40),
      }}
    >
      {name[0].toUpperCase()}
    </div>
  );
}
