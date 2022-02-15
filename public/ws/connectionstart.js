function connecedstart(socketid,id, idb, username, email, picture,indexdb) {
    const user = {
      socket_id: socketid,
      uid: id,
      idb,
      username,
      email,
      picture,
      online: "online",
      onlinetime: datetime(),
    };
    socket.emit("user_connected", user);
    indexdb.deleteUid("users", id);
    indexdb.showall("users");
    indexdb.showMessageUser("senduser");
    /// checking in private Chat or not
    indexdb.showLastMsg("message");
  }

export default  connecedstart