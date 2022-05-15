export default async function newPassword(user, data) {
  await fetch(`${process.env.REACT_APP_SERVER_URL}/account/new-password`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      authorization: "bearer " + user.tokens.access,
      refreshtoken: user.tokens.refresh,
      userid: user._id,
    },
    body: JSON.stringify(data),
  });
}
