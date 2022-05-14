import { useSocket } from "../../../../../contexts/SocketContext";
import { useUser } from "../../../../../contexts/UserContext";
import { useHome } from "../../../../../contexts/HomeContext";
import API from "../../../../../API";

export default function useDeleteMsg(message) {
  const { socket } = useSocket();
  const { user, socketAuth } = useUser();
  const { chosenFriend } = useHome();

  const roomId = chosenFriend.chatRoom;

  return async () => {
    try {
      socket.emit("send_data", {
        header: {
          senderRoom: user.mailbox,
          receiverRoom: roomId,
          secondaryReceiverRoom: chosenFriend.mailbox,
          receiverRoomEvent: "delete_msg",
          auth: socketAuth,
        },
        payload: {
          receiverRoomData: {
            msgId: message._id,
          },
        },
      });

      await API.chat.deleteMsg({
        user,
        data: { roomId, messageInfo: message },
      });
    } catch (err) {
      console.log(err);
    }
  };
}
