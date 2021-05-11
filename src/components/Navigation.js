import { ChatClientContext } from "../ChatClientContext";
import { useContext } from "react";

export default function Navigation({ setView, view }) {
  const chatClient = useContext(ChatClientContext);

  const handleViewClick = async (room) => {
    setView(room);
    room === "login" && (await chatClient.disconnectUser());
  };

  return (
    view !== "login" && (
      <div>
        <button
          onClick={() => handleViewClick("login")}
          className="lobby-logout-users"
        >
          Logout
        </button>
        {view !== "lobby" && (
          <button
            onClick={() => handleViewClick("lobby")}
            className="lobby-logout-users"
          >
            Lobby
          </button>
        )}
        {view !== "users" && (
          <button
            onClick={() => handleViewClick("users")}
            className="lobby-logout-users"
          >
            Search
          </button>
        )}
        {view !== "contacts" && (
          <button
            onClick={() => handleViewClick("contacts")}
            className="lobby-logout-users"
          >
            Contacts
          </button>
        )}
      </div>
    )
  );
}
