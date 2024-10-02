const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  comment: { type: String, trim: true, required: true },
  blogId: { type: Schema.Types.ObjectId, ref: "blog" },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
});

module.exports = model("comment", commentSchema);
