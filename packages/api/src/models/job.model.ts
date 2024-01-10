import { Document, Model, Schema, model } from "mongoose";

export interface Job extends Document {
  id?: string;
  workflowId: string;
  driver: string;
  stepName: string;
  scriptPath?: string;
  commandLineTool?: object;
  inputs: object;
  outputs: object;
  status: string;
  dateCreated?: string;
  dateFinished?: string;
  owner?: string;
}

interface JobModel extends Model<Job> { }

const schema = new Schema(
  {
    workflowId: { type: String, required: true },
    driver: { type: String, required: true },
    stepName: { type: String, required: true },
    scriptPath: { type: String },
    commandLineTool: { type: Object },
    inputs: { type: Object, required: true },
    outputs: { type: Object, required: true },
    status: { type: String, required: true, default: "Submitted" },
    dateCreated: { type: Date },
    dateFinished: { type: Date },
    owner: { type: String },
  },
  {
    strict: false,
    minimize: false,
    timestamps: true,
    collection: "Job", //  todo: from config
  }
);

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export const JobCrud = model<Job, JobModel>("Job", schema);