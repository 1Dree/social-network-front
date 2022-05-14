import { DataAbsence } from "../../components";
import { useAside } from "../../contexts/AsideContext";

const InvitContainerContent = ({ uiInvits, invitType }) => {
  const { loadingData } = useAside();

  return (
    <>
      {loadingData.loading ? (
        <loadingData.LoadingComponent />
      ) : uiInvits.length ? (
        uiInvits
      ) : (
        <DataAbsence info={"No invitations " + invitType} />
      )}
    </>
  );
};

export default InvitContainerContent;
