import BaseController from './base.controller';
import Location from '../models/locations';
import constants from '../config/constants';
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
			// implement weather api 

			const url = `${constants.weatherApi}?key=${constants.weatherApiKey}&q=${branchName}&aqi=yes`
			axios.get(url, {
				headers: { "Accept-Encoding": "gzip,deflate,compress" }
			}).then(result => {
				const response = result.data;
				res.send({
					branchInfo: response
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
