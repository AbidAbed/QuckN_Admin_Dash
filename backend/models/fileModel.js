const mongoose = require("mongoose")


const fileSchema = new mongoose.Schema(
    {
      filename: {
        type: String,
      },
      path: {
        type: String,
      },
      createdName: { type: String },
      type: { type: String },
      numberOfPages: { type: mongoose.Schema.Types.Number },
    },
    { timestamps: true }
  )

const File = mongoose.model("files" , fileSchema)


module.exports = File
