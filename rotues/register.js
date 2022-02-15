const { uuid, thaiDate } = require("../controlers/uuid.js");
const dbuser = require("../controlers/dbtable");
const passhash = require("password-hash");
const con = require("../controlers/dbcon.js");
module.exports = async (req, res) => {
  // var salt = bcrypt.genSaltSync(5)
  function get_random(list) {
    return list[Math.floor(Math.random() * list.length)];
  }
  var pic = await get_random([1, 2, 3, 4, 5, 6, 7, 8]);
  var password = req.body.password;
  var hash = passhash.generate(password);
  const user = {
    uid: await uuid(),
    username: req.body.username,
    email: req.body.email,
    password: hash,
    pictures: `avatars/avatar${pic}.png`,
    date: await thaiDate(),
  };
  // res.send(user)
  const sql = `
  INSERT INTO users (uid,username,email,password,kind,picture,date) VALUES(
  '${user.uid}','${user.username}','${user.email}',
  '${user.password}','user','${user.pictures}','${user.date}')
  `;
  try {
    dbuser(sql)
      .then((data) => {
        req.flash("success_msg", "ลงทะเบียนเรียบร้อย กรุณา Login");
        res.redirect("/login");
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.redirect("/register");
      });
  } catch {}
};
