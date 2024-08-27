import { Document, Model, Schema, model } from 'mongoose';

export interface Driver extends Document {
	id?: string;
	name: string;
	url: string;
	description: string;
}

interface DriverModel extends Model<Driver> {}

const schema = new Schema(
	{
		name: { type: String, required: true },
		url: { type: String, required: true },
		description: { type: String, required: false },
	},
	{
		strict: false,
		minimize: false,
		timestamps: true,
		collection: 'Driver',
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

export const DriverCrud = model<Driver, DriverModel>('Driver', schema);
