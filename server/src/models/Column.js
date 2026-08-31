const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Column title is required"],
      trim: true,
      minlength: [1, "Column title cannot be empty"],
      maxlength: [100, "Column title cannot exceed 100 characters"],
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Board reference is required"],
      index: true,
    },

    position: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Position cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

columnSchema.index({ board: 1, position: 1 });

const Column = mongoose.model("Column", columnSchema);

module.exports = Column;
