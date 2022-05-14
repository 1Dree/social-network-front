import MoreVertIcon from "@mui/icons-material/MoreVert";

import "./homeheader.css";
import { useHome } from "../../../../contexts/HomeContext";
import { useUser } from "../../../../contexts/UserContext";
import { Profile, IconWrapper } from "../../../../components";

export default function HomeHeader() {
  const { user } = useUser();
  const { activeHeaderOpts } = useHome();

  return (
    <header id="home-header">
      <div id="home-header-profile">
        <Profile src={user.login.profile.objectURL} />
      </div>

      <IconWrapper Icon={MoreVertIcon} onClick={activeHeaderOpts} />
    </header>
  );
}
