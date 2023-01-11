import BaseController from "./base.controller";
import Location from "../models/locations";
import constants from "../config/constants";
import Devices from "../models/devices";
import DevicesData from "../models/deviceData";
import axios from "axios";

class IotController extends BaseController {
  whitelist = [];

  findCount = async (att) => {
    const count = await Location.distinct(att).exec();

    return {
      count: count.length,
      [att]: count,
    };
  };

  getStates = async (req, res, next) => {
    try {
      if (!req.query.state) {
        const states = await Location.find({})
          .select("state")
          .distinct("state")
          .exec();
        return res.send({
          result: states,
        });
      }
    } catch (err) {
      next(err);
    }
  };
  getCities = async (req, res, next) => {
    try {
      if (!req.query.city) {
        const cities = await Location.find({})
          .select("city")
          .distinct("city")
          .exec();
        return res.send({
          result: cities,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  getBranchs = async (req, res, next) => {
    try {
      if (!req.query.branch) {
        const branches = await Location.find({})
          .select("location")
          .distinct("location")
          .exec();
        return res.send({
          result: branches,
        });
      }
    } catch (err) {
      next(err);
    }
  };
  getCitiesFromState = async (req, res, next) => {
    try {
      if (!req.query.state) {
        const states = await Location.find({})
          .select("location")
          .distinct("location")
          .exec();
        return res.send({
          result: states,
        });
      }
      const stateName = req.query.state;
      const cities = await Location.find({ state: stateName })
        .select("city")
        .distinct("city")
        .exec();
      res.send({
        cities,
      });
    } catch (err) {
      next(err);
    }
  };
  getBranchesFromCity = async (req, res, next) => {
    try {
      if (!req.query.city) {
        const cities = await Location.find({})
          .select("city")
          .distinct("city")
          .exec();
        return res.send({
          result: cities,
        });
      } else {
        const cityName = req.query.city;
        const branches = await Location.find({ city: cityName })
          .select("location")
          .distinct("location")
          .exec();
        res.send({
          branches,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  getWeatherInfo = async (url) => {
    const res = axios.get(url, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    });
    return res;
  };
  getDeviceId3And4Data = async () => {
    const deviceId3 = [
      {
        start: "0.00",
        end: "4:00",
        level: "84",
        variation: "5%",
      },
      {
        start: "4.00",
        end: "6:00",
        level: "115",
        variation: "84-115",
      },

      {
        start: "6.00",
        end: "9:00",
        level: "135",
        variation: "115-135%",
      },

      {
        start: "9.00",
        end: "18:00",
        level: "155",
        variation: "5%",
      },

      {
        start: "18.00",
        end: "20:00",
        level: "135",
        variation: "135-155",
      },
      {
        start: "20.00",
        end: "00:00",
        level: "84",
        variation: "5%",
      },
    ];
    const deviceId4 = [
      {
        start: "0.00",
        end: "10:00",
        level: "390",
        variation: "5%",
      },
      {
        start: "10.00",
        end: "10:10",
        level: "778",
        variation: "84-115",
      },

      {
        start: "10.10",
        end: "18:00",
        level: "745",
        variation: "115-135%",
      },

      {
        start: "18.00",
        end: "20:00",
        level: "681",
        variation: "5%",
      },

      {
        start: "20.00",
        end: "20:10",
        level: "390",
        variation: "135-155",
      },
      {
        start: "20.10",
        end: "00:00",
        level: "390",
        variation: "5%",
      },
    ];
    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    const getInfo = () => {
      const d = new Date();
      let h = addZero(d.getHours());
      let m = addZero(d.getMinutes());
      let time = h + ":" + m;
      return deviceId3.find((e) => time >= e.start && time <= e.end);
    };

    const getInfoDevice4 = () => {
      const d = new Date();
      let h = addZero(d.getHours());
      let m = addZero(d.getMinutes());
      let time = h + ":" + m;
      return deviceId4.find((e) => time >= e.start && time <= e.end);
    };
    const d3Data=getInfo();
	const d4Data=getInfoDevice4();
	const lux=d3Data.level;
	const AQ=d4Data.level;
	console.log({lux,AQ})
    return {
      lux,
      AQ
    };
  };
  getBranchInfo = async (req, res, next) => {
    try {
      const branchName = req.query.branch;
      let electricity = null;
      let monitors, ambient;
      let temprature = null;
      let humidity = null;

      let final;
      let obj = {};
      const getLatLong = await Location.findOne({ location: branchName })
        .lean()
        .exec();
      // implement weather api
      console.log("location_id", getLatLong);
      const url = `${constants.weatherApi}?key=${constants.weatherApiKey}&q=${
        getLatLong.lat + "," + getLatLong.long
      }&aqi=yes`;
      console.log({ branchName });

      if (branchName == "Kharghar Branch") {
        const ambientData = await DevicesData.findOne({
          dev_name: "albat_perberry",
        })
          .sort({ ts: -1 })
          .lean()
          .exec();
        if (ambientData) {
          temprature = ambientData.temperature;
          humidity = ambientData.humidity;
        }
        const electriciyData = await DevicesData.findOne({
          dev_name: "batross",
        })
          .sort({ ts: -1 })
          .lean()
          .exec();
        console.log({ electriciyData });
        if (electriciyData) {
          electricity = electriciyData;
        }
      } else if (branchName == "Seawoods Branch") {
        const ambientData = await DevicesData.findOne({
          dev_name: "anteaterfly_marind",
        })
          .sort({ ts: -1 })
          .lean()
          .exec();
        console.log({ ambientData });
        if (ambientData) {
          temprature = ambientData.temperature;
          humidity = ambientData.humidity;
        }
      } else if (branchName == "Vashi Branch") {
        const ambientData = await DevicesData.findOne({
          dev_name: "conda_lycherry",
        })
          .sort({ ts: -1 })
          .lean()
          .exec();
        console.log({ ambientData });

        if (ambientData) {
          temprature = ambientData.temperature;
          humidity = ambientData.humidity;
        }
      }
      console.log({ temprature, humidity });
      // const device_type_ids = [1,2,3,4,5];
      // device_type_ids.forEach(async(item) => {

      // 	const deviceInfo = await Devices.findOne({location_id: getLatLong.location_id, device_type_id: item}).lean().select('device_nickname device_type_id').exec();
      // 	if(deviceInfo){
      // 		obj = {
      // 			[item]: deviceInfo
      // 		}
      // 		return obj;
      // 	}
      // 	console.log('obj', obj)
      // 	if(Object.keys(obj).length > 0) {

      // 		const device_data = await DevicesData.findOne({dev_name: obj.device_nickname}).lean().exec();
      // 		final = device_data;
      // 		return final;
      // 	}
      // })

      // console.log('device_type_id', final)
	  const luxAndAQ=await this.getDeviceId3And4Data();

      axios
        .get(url, {
          headers: { "Accept-Encoding": "gzip,deflate,compress" },
        })
        .then((result) => {
          const response = result.data;
          res.send({
            result: response,
            temprature,
            humidity,
            electricity,
			...luxAndAQ
          });
        });
		//done
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  };
  getStats = async (_req, res, next) => {
    try {
      // start code from here
      let response = {};
      const cityCount = await this.findCount("city");
      const branchCount = await this.findCount("location");
      const stateCount = await this.findCount("state");
      response = {
        cityCount,
        branchCount,
        stateCount,
      };
      res.send({
        data: {},
        statsCount: response,
      });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };
}

export default new IotController();
