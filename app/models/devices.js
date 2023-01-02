import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const devicesSchema = new Schema({
	device_type_id: {
		type: String,
		default: ''
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});

const Devices = mongoose.model('devices', devicesSchema);
export default Devices;
