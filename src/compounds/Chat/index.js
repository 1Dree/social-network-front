import "./chat.css";
import {
  ChatHeader,
  ChatContent,
  ChatMsgBox,
  ChatFileUploader,
} from "./Public";
import { useChat } from "../../contexts/ChatContext";
import { useHome } from "../../contexts/HomeContext";

import Picker from "emoji-picker-react";

export default function Chat() {
  const { chosenFriend } = useHome();
  const { showEmojiPicker, setChatInputValue } = useChat();

  const onEmojiClick = (event, emojiObject) => {
    setChatInputValue(prevState => prevState + emojiObject.emoji);
  };

  return (
    <div id="chat" className={showEmojiPicker ? "picker" : ""}>
      <ChatFileUploader />

      <ChatHeader chosenFriend={chosenFriend}/>
      <ChatContent />
      <ChatMsgBox />
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
}
