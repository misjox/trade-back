const { Router } = require("express");
const router = Router();
const {
  create,
  getOne,
  getStatus,
  cancel,
  setStatus,
  acceptTrade,
} = require("../controllers/offer");

router.post("/", getOne);
router.post("/status", getStatus);
router.post("/create", create);
router.patch("/cancel", cancel);
router.patch("/acceptTrade", acceptTrade);
router.patch("/setStatus", setStatus);

module.exports = router;
