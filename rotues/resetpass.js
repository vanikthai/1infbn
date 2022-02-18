const dbuser = require("../controlers/dbtable.js");
module.exports =  (req, res) => {
  let key = req.params.key
  const sql = `SELECT * FROM mainpage where token = '${key}'`;
  try { 
    dbuser(sql)
      .then((data) => {
        data.forEach(row => {
            res.render("resetpass.ejs",{ user: req.user,data: row });
        });
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.render("data.ejs", { user: "",data: key });
    });
} catch {
    req.flash("error", error.message);
    res.render("data.ejs", { user: "",data: key });
  }
};
