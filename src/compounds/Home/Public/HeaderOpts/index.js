import "./headeropts.css";
import { useHome } from "../../../../contexts/HomeContext";
import { useUser } from "../../../../contexts/UserContext";
import { useAside } from "../../../../contexts/AsideContext";
import { Link } from "react-router-dom";
import API from "../../../../API";

const HeaderOpts = () => {
  const { toggleClass, activeHeaderOpts } = useHome();
  const { user, setUser } = useUser();
  const { setContacts, loadingData } = useAside();

  const optAction = (id, className) => async () => {
    activeHeaderOpts();
    toggleClass(id, className);

    loadingData.loadingStateSwitch();
    try {
      if (id.includes("contacts")) {
        await API.getters.onGetContacts(setUser, user, setContacts);
      } else {
        await API.getters.onGetInvits(setUser, user);
      }
    } catch (err) {
      console.log(err);
      alert("There was an error on fetching. Try again later.");
    } finally {
      loadingData.loadingStateSwitch();
    }
  };

  return (
    <ul id="home-header-options-modal">
      <li onClick={optAction("#contacts", "slide")}>Contacts</li>
      <li onClick={optAction("#invitations", "slide")}>Invitations</li>
      <li>
        <Link to="/account">Account</Link>
      </li>
    </ul>
  );
};

export default HeaderOpts;
