import "./invitations.css";
import { SendedInvitation, ReceivedInvitation } from "./Invitation";
import { Sidebar } from "../../components";
import { useUser } from "../../contexts/UserContext";
import InvitContainerContent from "./InvitContainerContent";
import InvitContainer from "./InvitContainer";

export default function Invitations() {
  const {
    user: { invitations },
  } = useUser();

  const invitMatrix = Component => props =>
    <Component {...props} key={props._id} />;

  const [uiSendedInvits, uiReceivedInvits] = [
    invitations.sended.map(invitMatrix(SendedInvitation)),
    invitations.received.map(invitMatrix(ReceivedInvitation)),
  ];

  return (
    <Sidebar title="Invitations" id="invitations">
      <div id="invits-content">
        <InvitContainer title="Sended">
          <InvitContainerContent uiInvits={uiSendedInvits} invitType="sended" />
        </InvitContainer>

        <InvitContainer title="Received">
          <InvitContainerContent
            uiInvits={uiReceivedInvits}
            invitType="received"
          />
        </InvitContainer>
      </div>
    </Sidebar>
  );
}
