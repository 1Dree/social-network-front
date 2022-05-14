import "./invitation.css";
import "../../../styles/discardanimation.css";
import { Profile } from "../../../components";
import { useSocket } from "../../../contexts/SocketContext";

import { onDiscardAnimation } from "../../../lib";
import { useUser } from "../../../contexts/UserContext";

const invitInfo = (_id, name, profile, mailbox) => ({
  _id,
  name,
  profile,
  mailbox,
});

const useInvitSubjectInfo = () => {
  const { user } = useUser();

  return invitInfo(
    user._id,
    user.login.name,
    user.login.profile.path,
    user.mailbox
  );
};

const useSioHeader = (invitMailbox, roomEventPrefix) => {
  const { user, socketAuth } = useUser();

  return {
    senderRoom: user.mailbox,
    receiverRoom: invitMailbox,
    receiverRoomEvent: `${roomEventPrefix}_invit`,
    auth: socketAuth,
  };
};

export const SendedInvitation = invit => {
  const { socket } = useSocket();
  const { user, removeInvit } = useUser();
  const invitSubjectInfo = useInvitSubjectInfo();
  const header = useSioHeader(invit.mailbox, "canceled");

  const handleInvitCanceling = onDiscardAnimation(() => {
    removeInvit("sended")(invit._id);

    socket.emit("send_data", {
      header,
      payload: {
        toDB: {
          action: "cancelInvit",
          data: {
            inviterId: user._id,
            inviteeId: invit._id,
          },
        },
        receiverRoomData: {
          inviter: invitSubjectInfo,
        },
      },
    });
  });

  return (
    <div className="invit" key={invit._id}>
      <div className="invit-profile sended">
        <Profile src={invit.profile.objectURL} />
      </div>

      <div className="invit-info">
        <p className="invit-info-name">to {invit.name}</p>

        <p>Status:{invit.status}</p>
      </div>

      <div className="invit-actions">
        <button
          className="cancel-invit"
          onClick={e =>
            handleInvitCanceling(e, e.target.parentElement.parentElement)
          }
        >
          {invit.status === "rejected" ? "remove" : "cancel"}
        </button>
      </div>
    </div>
  );
};

export const ReceivedInvitation = invit => {
  const { socket } = useSocket();
  const { user, removeInvit } = useUser();

  const invitSubjectInfo = useInvitSubjectInfo();
  const [onRejectHeader, onAcceptHeader] = [
    useSioHeader(invit.mailbox, "rejected"),
    useSioHeader(invit.mailbox, "accepted"),
  ];

  const onRemoveInvit = removeInvit("received");

  const handleInvitRejection = onDiscardAnimation(() => {
    onRemoveInvit(invit._id);

    socket.emit("send_data", {
      header: onRejectHeader,
      payload: {
        toDB: {
          action: "rejectInvit",
          data: {
            inviteeId: user._id,
            inviterId: invit._id,
          },
        },
        receiverRoomData: {
          invitee: invitSubjectInfo,
        },
      },
    });
  });

  const handleInvitAcceptance = onDiscardAnimation(() => {
    onRemoveInvit(invit._id);

    socket.emit("send_data", {
      header: onAcceptHeader,
      payload: {
        toDB: {
          action: "acceptInvit",
          data: {
            invitee: invitSubjectInfo,
            inviter: invitInfo(
              invit._id,
              invit.name,
              invit.profile.path,
              invit.mailbox
            ),
          },
        },
        receiverRoomData: {
          friend: invitSubjectInfo,
        },
      },
    });
  });

  return (
    <div className="invit received" key={invit._id}>
      <div className="invit-info received">
        <p className="invit-info-name">From {invit.name}</p>
      </div>

      <div className="invit-profile received">
        <Profile src={invit.profile.objectURL} />
      </div>

      <div className="invit-actions">
        <button
          className="accept-invit"
          onClick={e =>
            handleInvitAcceptance(e, e.target.parentElement.parentElement)
          }
        >
          accept
        </button>

        <button
          className="reject-invit"
          onClick={e =>
            handleInvitRejection(e, e.target.parentElement.parentElement)
          }
        >
          reject
        </button>
      </div>
    </div>
  );
};
