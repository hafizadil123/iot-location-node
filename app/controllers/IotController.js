import BaseController from './base.controller';
import Location from '../models/locations';
import constants from '../config/constants';
import Devices from '../models/devices';
import DevicesData from '../models/deviceData';
import axios from 'axios';

class IotController extends BaseController {
	whitelist = [];


	findCount = async (att) => {
		const count = await Location.distinct(att).exec();

		return {
			count: count.length,
			[att]: count
		};
	}

   getStates = async (req, res, next) => {
	try {
		if(!req.query.state) {
			const states = await Location.find({}).select('state').distinct('state').exec();
		return res.send({
				result: states
			})
		}
	} catch (err) {
		next(err);
	}
   }
   getCities = async (req, res, next) => {
	try {
		if(!req.query.city) {
			const cities = await Location.find({}).select('city').distinct('city').exec();
		return res.send({
				result: cities
			})
		}
	} catch (err) {
		next(err);
	}
   }
   
   getBranchs = async(req, res, next) => {
	try {
		if(!req.query.branch) {
			const branches = await Location.find({}).select('location').distinct('location').exec();
		return res.send({
				result: branches
			})
		}
	} catch (err) {
		next(err);
	}
   }
	getCitiesFromState = async (req, res, next) => {
		try {
			if(!req.query.state) {
				const states = await Location.find({}).select('location').distinct('location').exec();
			return res.send({
					result: states
				})
			}
			const stateName = req.query.state;
			const cities = await Location.find({ state: stateName }).select('city').distinct('city').exec();
		 	res.send({
				cities
			})
		} catch (err) {
			next(err);
		}
	}
	getBranchesFromCity = async (req, res, next) => {
		try {
			if(!req.query.city) {
				const cities = await Location.find({}).select('city').distinct('city').exec();
			return res.send({
					result: cities
				})
			} else {
				const cityName = req.query.city;
				const branches = await Location.find({ city: cityName }).select('location').distinct('location').exec();
				res.send({
					branches
				})
			}
		
		} catch (err) {
			next(err)
		}

	}

	getWeatherInfo = async (url) => {
		const res = axios.get(url, {
			headers: { "Accept-Encoding": "gzip,deflate,compress" }
		});
		return res
	}
	getBranchInfo = async (req, res, next) => {
		try {
			const branchName = req.query.branch;
			let electricity, monitors, ambient = null;
			let final;
			let obj = {};
			const getLatLong = await Location.findOne({location: branchName}).lean().exec();
			// implement weather api 
			console.log('location_id', getLatLong)
			const url = `${constants.weatherApi}?key=${constants.weatherApiKey}&q=${getLatLong.lat+','+getLatLong.long}&aqi=yes`
			const device_type_ids = [1,2,3,4,5];
			device_type_ids.forEach(async(item) => {
				
				const deviceInfo = await Devices.findOne({location_id: getLatLong.location_id, device_type_id: item}).lean().select('device_nickname device_type_id').exec();
				if(deviceInfo){
					obj = {
						[item]: deviceInfo
					}
					return obj;
				}
				console.log('obj', obj)
				if(Object.keys(obj).length > 0) {

					const device_data = await DevicesData.findOne({dev_name: obj.device_nickname}).lean().exec();
					final = device_data;
					return final;
				}
			})
			
			
			
			console.log('device_type_id', final)
			
			axios.get(url, {
				headers: { "Accept-Encoding": "gzip,deflate,compress" }
			}).then(result => {
				const response = result.data;
				res.send({
					result: response,
					electricity,
					monitors,
					ambient
				})
			})
		} catch (err) {
			console.log('err', err)
			next(err)
		}

	}
	getStats = async (_req, res, next) => {

		try {
			// start code from here
			let response = {};
			const cityCount = await this.findCount('city');
			const branchCount = await this.findCount('location');
			const stateCount = await this.findCount('state');
			response = {
				cityCount,
				branchCount,
				stateCount
			}
			res.send({
				data: {},
				statsCount: response
			})
		} catch (err) {
			err.status = 400;
			next(err);
		}
	};

}

export default new IotController();
