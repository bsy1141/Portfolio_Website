import { Schema, model } from "mongoose";

const gallerySchema = new Schema(
  {
    id: {
        type: String,
        required: true,
      },
    projectId : {
        type : String,
    },
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    active : {
      type: Boolean,
      required : true,
      default : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    expiredAt : {
        type : Date,
        expires:0
    },
    saveFileName: {
        type: String,
        required: true,
    },
    saveFilePath: {
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const galleryModel = model("Gallery", gallerySchema);

export { galleryModel };
