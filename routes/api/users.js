const express = require("express");

const router = express.Router();
router.get("/list", (req, res) => {
  res.send({ data: [{ name: "usama" }] });
});

router.post("/", (req, res) => {
  res.send(req.body);
});
module.exports = router;
