const dbuser = require("../controlers/dbtable.js");
const passhash = require("password-hash");
module.exports = (req, res) => {
  let key = req.body.tokenid;
  let password = req.body.password;
  const sql = `SELECT * FROM mainpage where token = '${key}'`;
  try {
    dbuser(sql)
      .then((data) => {
        data.forEach((row) => {
          try {
            let match = passhash.verify(password, row.password);
            if (match) {
              res.render("data.ejs", { user: "", data: row, msg: "cuccess" });
            } else {
              req.flash("error", "กรุณาใส่รหัสผ่าน");
              res.render("datapass.ejs", {
                user: "",
                data: key,
                msg: "error password",
              });
            }
          } catch (error) {
            req.flash("error", error.message);
            res.render("datapass.ejs", {
              user: "",
              data: key,
              msg: error.message,
            });
          }
        });
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.render("datapass.ejs", { user: "", data: key, msg: error.message });
      });
  } catch {
    res.redirect("/login");
  }
};

// let {message} = JSON.parse(document.getElementById("data").dataset.message)
// let inmessage = document.getElementById("message")
// let title = document.getElementById("title")
// let intime = document.getElementById("intime")
// let userpic = document.getElementById("userpic")
// let card = document.getElementById("card")
// let  msg = JSON.parse(message)
// let  pic= msg.pictrueSend

// title.innerHTML = msg.from.username
// intime.innerHTML = msg.time
// userpic.src= msg.from.picture
// inmessage.innerHTML = decodeURIComponent(msg.message)

// pic.forEach(epic => {
//     let spic = document.createElement('img')
//     spic.src=epic
//     spic.className ="card-img-bottom"
//     card.appendChild(spic)
// });
