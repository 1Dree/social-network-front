import { createContext, useContext, useEffect, useState } from "react";

import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";
import { useHome } from "./HomeContext";
import { duplicateVerifier, arrayStateSetterDuplicatePreventer } from "../lib";
import { onDefineProfileObj } from "../API/apiLib";
import useLoading from "../lib/useLoading";

export const AsideContext = createContext();

export const useAside = () => useContext(AsideContext);

export default function AsideContextProvider({ children }) {
  const { chosenFriend, setChosenFriend, clearChosenFriend } = useHome();

  const [contacts, setContacts] = useState([]);
  const [chatRoom, setChatRoom] = useState("");
  const [asideSearchContent, setAsideSearchContent] = useState("");
  const [contactsSearchContent, setContactsSearchContent] = useState("");

  const { socket } = useSocket();
  const { user, setUser, removeInvit } = useUser();

  const loadingData = useLoading();

  const removeContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(({ _id }) => _id !== contactId)
    );
  };

  const onInvitContactsEffect = item =>
    arrayStateSetterDuplicatePreventer(item, setContacts);

  const onInvitUserEffect = invitType => item => {
    setUser(prevState => {
      const effectSubject = invitType
        ? prevState.invitations[invitType]
        : prevState.friends;
      const effectUpdate = invitType
        ? {
            invitations: {
              ...prevState.invitations,
              received: [...effectSubject, item],
            },
          }
        : {
            friends: [...effectSubject, item],
          };

      if (duplicateVerifier(effectSubject, item._id)) return prevState;

      return {
        ...prevState,
        ...effectUpdate,
      };
    });
  };

  const onInvit = (itemKey, removeItem, stateUpdate) => async data => {
    try {
      let item = data[itemKey];
      const defineProfileObj = onDefineProfileObj(user.tokens.access);

      item = await defineProfileObj(item);

      if (removeItem) removeItem(item._id);

      stateUpdate(item);
    } catch (err) {
      console.log(err);
    }
  };

  const onContactUpdate =
    contactPropKey =>
    async ({ contact }) => {
      const { _id } = contact;
      const contactPlace = findContactPlace(_id);
      if (!contactPlace) return;
      let prop;

      if (contactPropKey === "profile") {
        const defineProfileObj = onDefineProfileObj(user.tokens.access);
        const { profile } = await defineProfileObj(contact);

        prop = profile;
      } else {
        prop = contact[contactPropKey];
      }

      const updateItem = item => {
        if (item._id === _id) item[contactPropKey] = prop;

        return item;
      };

      setChosenFriend(prevState => {
        if (prevState._id !== _id) return prevState;

        return { ...prevState, [contactPropKey]: prop };
      });

      switch (contactPlace) {
        case "contacts":
          setContacts(prevContacts => prevContacts.map(updateItem));
          break;

        case "friends":
          setUser(prevState => ({
            ...prevState,
            friends: prevState.friends.map(updateItem),
          }));

          break;

        default:
          setUser(prevState => ({
            ...prevState,
            invitations: {
              ...prevState.invitations,
              ...prevState.invitations[contactPlace].map(updateItem),
            },
          }));
      }

      return;
    };

  const findContactPlace = contactId => {
    const {
      invitations: { sended, received },
      friends,
    } = user;
    const possiblePlaces = Object.entries({
      contacts,
      sended,
      received,
      friends,
    });

    const [foundPlace] = possiblePlaces
      .map(([key, value]) => {
        if (value.some(item => item._id === contactId)) return key;

        return null;
      })
      .filter(value => value);

    return foundPlace;
  };

  const onFriendPresence = bool => friendId => {
    setUser(prevState => ({
      ...prevState,
      friends: prevState.friends.map(friend => {
        if (friend._id === friendId) {
          friend.online = bool;
        }

        return friend;
      }),
    }));

    setChosenFriend(prevState => {
      if (prevState._id !== friendId) return prevState;

      return { ...prevState, online: bool };
    });
  };

  useEffect(() => {
    let mount = true;

    if (!mount) return;

    socket.on("new_contact", onInvit("contact", null, onInvitContactsEffect));

    socket.on(
      "receive_invit",
      onInvit("inviter", removeContact, onInvitUserEffect("received"))
    );

    socket.on(
      "canceled_invit",
      onInvit("inviter", removeInvit("received"), onInvitContactsEffect)
    );

    socket.on(
      "rejected_invit",
      onInvit("invitee", removeInvit("sended"), onInvitContactsEffect)
    );

    socket.on(
      "accepted_invit",
      onInvit("friend", removeInvit("sended"), item =>
        setUser(prevState => {
          if (duplicateVerifier(prevState.friends, item._id)) return prevState;

          return {
            ...prevState,
            friends: [...prevState.friends, item],
          };
        })
      )
    );

    socket.on("contact_photo_update", onContactUpdate("profile"));

    socket.on("contact_name_update", onContactUpdate("name"));

    socket.on("friend_online", onFriendPresence(true));

    socket.on("friend_offline", onFriendPresence(false));

    return () => (mount = false);
  }, [socket]);

  useEffect(() => {
    socket.on("delete_contact", ({ contactId }) => {
      const contactPlace = findContactPlace(contactId);
      if (!contactPlace) return;

      const excludeItem = array => array.filter(({ _id }) => _id !== contactId);

      if (chosenFriend._id === contactId) clearChosenFriend();

      switch (contactPlace) {
        case "contacts":
          setContacts(excludeItem);
          break;

        case "friends":
          setUser(prevState => ({
            ...prevState,
            friends: excludeItem(prevState.friends),
          }));
          break;

        default:
          setUser(prevState => ({
            ...prevState,
            invitations: {
              ...prevState.invitations,
              [contactPlace]: excludeItem(prevState.invitations[contactPlace]),
            },
          }));
      }
    });
  }, [socket, chosenFriend]);

  const value = {
    contacts,
    setContacts,
    removeContact,
    chatRoom,
    setChatRoom,
    asideSearchContent,
    setAsideSearchContent,
    contactsSearchContent,
    setContactsSearchContent,
    loadingData,
  };

  return (
    <AsideContext.Provider value={value}>{children}</AsideContext.Provider>
  );
}
