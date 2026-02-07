// models/Subject.ts

import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: String,

  class: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Subject ||
  mongoose.model("Subject", subjectSchema);
