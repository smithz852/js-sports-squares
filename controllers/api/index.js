const router = require("express").Router();

const userRoutes = require("./user-routes");
const nflAPI = require("./nflApiFetch")

router.use("/users", userRoutes);
router.use("/nflApiFetch", nflAPI)



module.exports = router;
