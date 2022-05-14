import "./friends.css";
import { ScrollContainer } from "../../components";
import Friend from "./Friend";
import { useAside } from "../../contexts/AsideContext";
import { useUser } from "../../contexts/UserContext";
import { DataAbsence } from "../../components";

export default function Friends() {
  const {
    user: { friends },
  } = useUser();
  const { asideSearchContent } = useAside();

  const friendMatrix = props => <Friend {...props} key={props._id} />;
  const uiFriends = friends
    .filter(friend =>
      friend.name.toLowerCase().includes(asideSearchContent.toLowerCase())
    )
    .map(friendMatrix);

  return (
    <ScrollContainer firstName="friends" style={{ height: "86%" }}>
      {uiFriends.length ? (
        uiFriends
      ) : asideSearchContent ? (
        <DataAbsence info="No results" />
      ) : (
        <DataAbsence info="You have no friends yet." />
      )}
    </ScrollContainer>
  );
}
