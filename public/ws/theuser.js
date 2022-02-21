const theuser = document.getElementById("userset").dataset.user;
export default  theuser;
export const { id, idb,kind, username, email, picture } = JSON.parse(theuser);
   