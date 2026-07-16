const mongoose = require("mongoose");

/**
 * Record Schema
 * Represents a single blood pressure / pulse rate reading.
 */
const recordSchema = new mongoose.Schema(
  {
    systolic: {
      type: Number,
      required: [true, "Systolic value is required"],
      min: [40, "Systolic value seems too low to be valid"],
      max: [300, "Systolic value seems too high to be valid"],
    },
    diastolic: {
      type: Number,
      required: [true, "Diastolic value is required"],
      min: [20, "Diastolic value seems too low to be valid"],
      max: [200, "Diastolic value seems too high to be valid"],
    },
    pulseRate: {
      type: Number,
      required: [true, "Pulse rate is required"],
      min: [20, "Pulse rate seems too low to be valid"],
      max: [250, "Pulse rate seems too high to be valid"],
    },
    // Defaults to the moment the record is saved on the server,
    // but the client sends its own local timestamp so the reading
    // reflects the device time it was actually taken.
    timestamp: {
      type: Date,
      default: Date.now,
    },
    armSelection: {
      type: String,
      enum: {
        values: ["Left", "Right"],
        message: "Arm selection must be either 'Left' or 'Right'",
      },
      required: [true, "Arm selection is required"],
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [280, "Comments cannot exceed 280 characters"],
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt for auditing purposes
  }
);

// Index on timestamp speeds up the time-range filtered queries used by the analytics view.
recordSchema.index({ timestamp: -1 });

module.exports = mongoose.model("Record", recordSchema);
