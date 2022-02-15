const dbuser = require("../controlers/dbtable");
module.exports = async (req, res) => {
  dbuser(`DROP TABLE ${req.body.table}`)
    .then((data) => {
      req.flash("success_msg", `ลบตารางเรียบร้อย ${data}`);
      res.redirect('/setting')
    })
    .catch((error) => {
      req.flash("error", error.message);
      res.redirect('/setting')
    });
};
