import { Document, Model, Schema, model } from 'mongoose';

export interface Workflow extends Document {
	id?: string;
	name: string;
	driver?: string;
	inputs: object;
	outputs: object;
	steps: object;
	cwlJobInputs: object;
	status: string;
	plugins: Array<object>;
	dateCreated: string;
	dateFinished: string;
	owner?: string;
	driverWorkflowId?: string;
}

interface WorkflowModel extends Model<Workflow> {}

const schema = new Schema(
	{
		name: { type: String, required: true },
		driver: { type: String, required: true },
		inputs: { type: Object, required: true },
		outputs: { type: Object, required: true },
		steps: { type: Object, required: true },
		cwlJobInputs: { type: Object, required: true },
		status: { type: String, required: true, default: 'Submitted' },
		plugins: { type: Array, required: true },
		dateCreated: { type: Date },
		dateFinished: { type: Date },
		owner: { type: String },
		driverWorkflowId: { type: String },
	},
	{
		strict: false,
		minimize: false,
		timestamps: true,
		collection: 'Workflow', //  todo: from config
	},
);

schema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

export const WorkflowCrud = model<Workflow, WorkflowModel>('Workflow', schema);
