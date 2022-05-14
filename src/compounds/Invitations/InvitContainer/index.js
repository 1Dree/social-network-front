import { useState } from "react";
import "./invitContainer.css";
import { IconWrapper } from "../../../components";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function InvitContainer({ title, id, children }) {
  const [hideInvits, setHideInvits] = useState(true);

  const hideInvitsSwitch = () => setHideInvits(prevState => !prevState);

  return (
    <div className={`invitations ${hideInvits ? "" : "show"}`}>
      <header className="invits-header ">
        <h3>{title}</h3>

        <IconWrapper
          className="invits-header-icon"
          Icon={hideInvits ? ArrowDropDownIcon : ArrowDropUpIcon}
          onClick={e => {
            e.stopPropagation();
            hideInvitsSwitch();
          }}
        />
      </header>

      <div className="invits-container">{children}</div>
    </div>
  );
}
