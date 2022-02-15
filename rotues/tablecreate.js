const dbtalbe = require("../controlers/dbtable");
module.exports = async (req, res) => {
  Promise.all([dbtalbe(tuser), dbtalbe(tuser1)])
    .then((data) => {
      req.flash("success_msg", `สร้างเรียร้อย ${data}`);
    })
    .catch((error) => {
      req.flash("error", error.message);
    });
};

const tuser = `
CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    uid varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    username varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    password varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    kind varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    online tinyint(1) NOT NULL,
    date varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    CONSTRAINT PK_Email PRIMARY KEY (email), INDEX(id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;
const tuser1 = `
CREATE TABLE users1 (
    id int(11) NOT NULL,
    uid varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    username varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    password varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    kind varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    online tinyint(1) NOT NULL,
    date varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
