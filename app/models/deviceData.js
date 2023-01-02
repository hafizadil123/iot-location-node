import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const deviceDataSchema = new Schema({
	device_type_id: {
		type: String,
		default: ''
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});

const DevicesData = mongoose.model('device_data', deviceDataSchema);
export default DevicesData;
