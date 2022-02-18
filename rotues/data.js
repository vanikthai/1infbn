const dbuser = require("../controlers/dbtable.js");
module.exports =  (req, res) => {
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
