import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const locationSchema = new Schema({
	city: {
		type: String,
		default: ''
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});

const Location = mongoose.model('locations', locationSchema);
export default Location;
