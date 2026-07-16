const Record = require("../models/Record");

/**
 * Builds a MongoDB date filter based on a "range" query param.
 * Supported values: today, 7days, month, 6months, year, all
 */
const buildDateFilter = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "7days": {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    }
    case "month": {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    }
    case "6months": {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 6);
      break;
    }
    case "year": {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    }
    case "all":
    default:
      return {}; // no filter — return everything
  }

  return { timestamp: { $gte: startDate } };
};

/**
 * @desc   Create a new BP/pulse record
 * @route  POST /api/records
 */
const createRecord = async (req, res) => {
  try {
    const { systolic, diastolic, pulseRate, armSelection, comments, timestamp } = req.body;

    const record = await Record.create({
      systolic,
      diastolic,
      pulseRate,
      armSelection,
      comments,
      // If the client sends its local timestamp, use it. Otherwise fall back to server time.
      timestamp: timestamp ? new Date(timestamp) : Date.now(),
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    // Mongoose validation errors get a 400, anything else is a 500
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Get all records, optionally filtered by time range
 * @route  GET /api/records?range=today|7days|month|6months|year|all
 */
const getRecords = async (req, res) => {
  try {
    const { range } = req.query;
    const filter = buildDateFilter(range);

    const records = await Record.find(filter).sort({ timestamp: 1 }); // ascending for chart-friendly order

    // Compute quick summary stats server-side so the frontend doesn't have to.
    const stats = computeStats(records);

    res.status(200).json({
      success: true,
      count: records.length,
      stats,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Delete a record by ID
 * @route  DELETE /api/records/:id
 */
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Computes average/min/max for systolic, diastolic, and pulse rate.
 */
const computeStats = (records) => {
  if (!records.length) {
    return {
      avgSystolic: null,
      avgDiastolic: null,
      avgPulse: null,
      maxSystolic: null,
      minSystolic: null,
      maxDiastolic: null,
      minDiastolic: null,
      maxPulse: null,
      minPulse: null,
    };
  }

  const systolics = records.map((r) => r.systolic);
  const diastolics = records.map((r) => r.diastolic);
  const pulses = records.map((r) => r.pulseRate);

  const avg = (arr) => Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  return {
    avgSystolic: avg(systolics),
    avgDiastolic: avg(diastolics),
    avgPulse: avg(pulses),
    maxSystolic: Math.max(...systolics),
    minSystolic: Math.min(...systolics),
    maxDiastolic: Math.max(...diastolics),
    minDiastolic: Math.min(...diastolics),
    maxPulse: Math.max(...pulses),
    minPulse: Math.min(...pulses),
  };
};

module.exports = { createRecord, getRecords, deleteRecord };
