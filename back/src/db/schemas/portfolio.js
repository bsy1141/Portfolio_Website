import { Schema, model, Types } from "mongoose";

const portfolioSchema = new Schema(
  {
    title : {
      type : String,
      required : true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    userId : {
        type : String,
        required : true,
    },
    projectId : {
        type : String,
        required : true,
    },    
    images : [{
      type : Schema.Types.ObjectId,
      ref : "Gallery"
    }],
    deployLink : {
        type : String,
    },
    githubLink : {
        type : String,
    },
    projectRole : {
        type : String,
    },
    details : {
      type : Array,
      default : [],
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
    }
  },
  {
    timestamps: true,
  }
);

const portfolioModel = model("Portfolio", portfolioSchema);

export { portfolioModel };
