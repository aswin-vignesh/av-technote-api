const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      // try userSchema direct ref here
      type: mongoose.Schema.Types.ObjectId, // i think this gets the userSchema , Note! we are importing mongoose.model not Schema
      required: true,
      ref: 'User' // actual refering
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      // for admins to immediately remove the access
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket", // ticket field created in note schema
  id: "ticketNums",    // also has id  // this will be created seperately in   "Counter"   collection
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
