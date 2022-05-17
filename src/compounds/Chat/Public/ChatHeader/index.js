import "./chatheader.css";
import { Profile } from "../../../../components";

export default function ChatHeader({ chosenFriend }) {
  return (
    <header id="chat-header">
      <div id="friend-profile">
        <Profile src={chosenFriend.profile.objectURL} />
      </div>

      <h3 id="friend-name">{chosenFriend.name} </h3>

      <p id="friend-presence"> {chosenFriend.online && "~online"}</p>
    </header>
  );
}
