//const { uuid, thaiDate } = require("../controlers/uuid.js");
const dbuser = require("../controlers/dbtable.js");
//const passhash = require("password-hash");
//const con = require("../controlers/dbcon.js");
module.exports =  (req, res) => {
  // var salt = bcrypt.genSaltSync(5)
  //let key = req.params.key
  // res.send(user)
  let key = req.params.key
  const sql = `SELECT * FROM mainpage where token = '${key}'`;
  
  try {
    dbuser(sql)
      .then((data) => {
        data.forEach(row => {
          if(row.vlock==="pass") {
              req.flash("error", "กรุณาใส่รหัสผ่าน");
              res.render("datapass.ejs", { user: "",data: key,msg: "have password" });
          } else {
            res.render("data.ejs",{ user: "",data: row });
          }
        });
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.render("data.ejs", { user: "",data: error.message });
      });
  } catch {
    res.render("data.ejs", { user: "",data: "Error" });
  }
};
