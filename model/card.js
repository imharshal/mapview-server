const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const CardModel = mongoose.model("card", CardSchema);

module.exports = CardModel;
