// import { useLocation } from "react-router-dom";

import "./home.css";
import Friends from "../Friends";
import HeaderOpts from "./Public/HeaderOpts";
import HomeHeader from "./Public/HomeHeader";
import Contacts from "../Contacts";
import Invitations from "../Invitations";
import Chat from "../Chat";
import { SearchBar, Intro } from "../../components";
import { useHome } from "../../contexts/HomeContext";
import ChatContextProvider from "../../contexts/ChatContext";
import AsideContextProvider from "../../contexts/AsideContext";

export default function Home() {
  const { chosenFriend } = useHome();

  return (
    <div id="home">
      <AsideContextProvider>
        <aside>
          <Contacts />
          <Invitations />

          <HomeHeader />
          <HeaderOpts />
          <SearchBar localization="aside" />
          <Friends />
        </aside>
      </AsideContextProvider>

      <main id="home-main">
        {chosenFriend._id ? (
          <ChatContextProvider>
            <Chat />
          </ChatContextProvider>
        ) : (
          <Intro />
        )}
      </main>
    </div>
  );
}
