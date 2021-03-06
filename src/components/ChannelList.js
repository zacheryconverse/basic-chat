import { useState, useEffect, useContext } from "react";
import { ChatClientContext } from "../ChatClientContext";
import { List } from "react-content-loader";
import UserOrChannel from "./UserOrChannel";

export default function UserList({ setChannel, setView }) {
  const chatClient = useContext(ChatClientContext);
  const [channelList, setChannelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(10);
  const [renderGetMore, setRenderGetMore] = useState(true);

  useEffect(() => {
    const getChannels = async () => {
      /**
        There are 4 built-in Channel Types - 'livestream', 'messaging', 'team', & 'commerce'
          https://getstream.io/chat/docs/javascript/channel_features/?language=javascript
        Query for channels with 'messaging' Type that the client is a member 'In' ($in)
          https://getstream.io/chat/docs/javascript/query_syntax/?language=javascript
        queryChannels() will only return channels that the user can read
        Permissions vary by many factors including 'channel type', 'role', and 'channel_membership'
          https://getstream.io/chat/docs/javascript/channel_permission_policies/?language=javascript
        Sort channels by last_message_at date - optional
        Limit the response to the 10 channels with most recently sent messages
          https://getstream.io/chat/docs/javascript/query_users/?language=javascript
        By default, queryChannels() will start watching all channels it returns
      */
      const filter = {
        type: "messaging",
        members: { $in: [chatClient.userID] },
      };

      const sort = { last_message_at: -1 };
      const options = { limit: 10 };

      const response = await chatClient.queryChannels(filter, sort, options);

      if (!response.length) setRenderGetMore(false);
      else setChannelList(response);
      setLoading(false);
    };

    getChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetMoreUsersClick = async () => {
    const filter = {
      type: "messaging",
      members: { $in: [chatClient.userID] },
    };

    const sort = { last_message_at: -1 };
    // Offset can be used for pagination by skipping the first <offset> (10, then 20...) users
    //   and then return the next 10 users
    const options = {
      offset,
      limit: 10,
    };

    const response = await chatClient.queryChannels(filter, sort, options);
    setOffset(offset + 10);
    const len = channelList.length;

    if (len === 10) setChannelList([...channelList, ...response]);
    if (channelList[len - 1]?.id !== response[response.length - 1]?.id)
      setChannelList([...channelList, ...response]);
    else setRenderGetMore(false);
  };

  return (
    <div className="User-list">
      <h1 className="user-list-contacts_header">{`${chatClient.userID}'s Contacts`}</h1>
      {loading ? (
        <List className="loading" />
      ) : (
        <ul>
          <p className="people">Friends</p>
          {channelList.length ? (
            channelList.map((channel, i) => (
              <UserOrChannel
                key={channel.data.created_at}
                channel={channel}
                setView={setView}
                setChannel={setChannel}
              />
            ))
          ) : (
            <p className="instructions">
              "It looks like you don't have any contacts, yet - click Search and
              start a conversation with someone to be able to add a contact and
              view a list of contacts to choose from"
            </p>
          )}
          {channelList.length % 10 === 0 && renderGetMore && (
            <button
              onClick={handleGetMoreUsersClick}
              className="lobby-logout-users"
            >
              Get More Users
            </button>
          )}
        </ul>
      )}
    </div>
  );
}
