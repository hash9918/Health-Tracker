const express = require("express");
const router = express.Router();
const { createRecord, getRecords, deleteRecord } = require("../controllers/recordController");

// POST /api/records        -> create a new reading
// GET  /api/records         -> list readings (supports ?range= filter)
router.route("/").post(createRecord).get(getRecords);

// DELETE /api/records/:id  -> remove a reading (used by the history table's delete action)
router.route("/:id").delete(deleteRecord);

module.exports = router;
