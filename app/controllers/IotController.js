import BaseController from "./base.controller";
import Location from "../models/locations";
import constants from "../config/constants";
import Devices from "../models/devices";
import DevicesData from "../models/deviceData";
import axios from "axios";
import moment from "moment";
import { readFile, writeFile } from "fs";

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
  getDevice3Data = () => {};
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
        end: "23:59",
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
        end: "23:59",
        level: "390",
        variation: "5%",
      },
    ];

    const getInfo = () => {
      const d = new Date();
      let h = this.addZero(d.getHours());
      let m = this.addZero(d.getMinutes());
      let time = h + ":" + m;
      console.log({ time });
      return deviceId3.find((e) => {
        let formattedTime = moment(time, "HH:mm").format("HH:mm");
        let _startTime = moment(e.start, "HH:mm").format("HH:mm");
        let _endTime = moment(e.end, "HH:mm").format("HH:mm");
        // var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
        var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

        if (
          parseInt(formattedTime.replace(regExp, "$1$2$3")) >= parseInt(_startTime.replace(regExp, "$1$2$3"))   &&
          parseInt(formattedTime.replace(regExp, "$1$2$3")) <= parseInt(_endTime.replace(regExp, "$1$2$3"))
        ) {
          console.log("----------------------------------------------------------------------------------------------");
         return e
        }
        // if(endTime.isBefore(formattedTime) && startTime.isAfter(formattedTime) ){
        //   return e;
        // }
      });
    };

    const getInfoDevice4 = () => {
      const d = new Date();
      let h = this.addZero(d.getHours());
      let m = this.addZero(d.getMinutes());
      let time = h + ":" + m;
      return deviceId4.find((e) =>{

        let formattedTime = moment(time, "HH:mm").format("HH:mm");
        let _startTime = moment(e.start, "HH:mm").format("HH:mm");
        let _endTime = moment(e.end, "HH:mm").format("HH:mm");
        // var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
        var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

        if (
          parseInt(formattedTime.replace(regExp, "$1$2$3")) >= parseInt(_startTime.replace(regExp, "$1$2$3"))   &&
          parseInt(formattedTime.replace(regExp, "$1$2$3")) <= parseInt(_endTime.replace(regExp, "$1$2$3"))
        ) {
          console.log("----------------------------------------------------------------------------------------------");
         return e
        }
        
      });
    };
    const d3Data = getInfo();
    const d4Data = getInfoDevice4();
    console.log({ d3Data, d4Data });
    const lux = d3Data.level || '0';
    const AQ = d4Data.level || '0';
    console.log({ lux, AQ });
    return {
      lux,
      AQ,
    };
  };
  addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };
  getDevice6Data = () => {
    const deviceId6 = [
      {
        start: "0.00",
        end: "9:00",
        level: "79",
        variation: "0",
      },
      {
        start: "9.00",
        end: "18:02",
        level: "44",
        variation: "44-79",
      },

      {
        start: "18:02",
        end: "23:59",
        level: "79",
        variation: "0",
      },
    ];
    const getInfoDeviceId6 = () => {
      const d = new Date();
      let h = this.addZero(d.getHours());
      let m = this.addZero(d.getMinutes());
      let time = h + ":" + m;
      console.log({ time });
      return deviceId6.find((e) => {
        let formattedTime = moment(time, "HH:mm").format("HH:mm");
        let _startTime = moment(e.start, "HH:mm").format("HH:mm");
        let _endTime = moment(e.end, "HH:mm").format("HH:mm");
        // var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
        var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

        if (
          parseInt(formattedTime.replace(regExp, "$1$2$3")) >= parseInt(_startTime.replace(regExp, "$1$2$3"))   &&
          parseInt(formattedTime.replace(regExp, "$1$2$3")) <= parseInt(_endTime.replace(regExp, "$1$2$3"))
        ) {
          console.log("----------------------------------------------------------------------------------------------");
         return e
        }
      });
    };
    const deviceId6Data = getInfoDeviceId6();
    console.log({ deviceId6Data });
    return deviceId6Data.level;
  };
  getDevice7Data = () => {
    const deviceId7 = [
      {
        start: "0.00",
        end: "9:00",
        level: "0",
        variation: "0",
      },
      {
        start: "9.00",
        end: "16:12",
        level: "84",
        variation: "44-79",
      },

      {
        start: "16:12",
        end: "16:12",
        level: "0",
        variation: "0",
      },

      {
        start: "16:12",
        end: "20:06",
        level: "28",
        variation: "5%",
      },
      {
        start: "20:06",
        end: "23:59",
        level: "0",
        variation: "5%",
      },
    ];
    const getInfoDeviceId7 = () => {
      const d = new Date();
      let h = this.addZero(d.getHours());
      let m = this.addZero(d.getMinutes());
      let time = h + ":" + m;
      console.log({ time });
      return deviceId7.find((e) => {
        let formattedTime = moment(time, "HH:mm").format("HH:mm");
        let _startTime = moment(e.start, "HH:mm").format("HH:mm");
        let _endTime = moment(e.end, "HH:mm").format("HH:mm");
        // var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
        var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

        if (
          parseInt(formattedTime.replace(regExp, "$1$2$3")) >= parseInt(_startTime.replace(regExp, "$1$2$3"))   &&
          parseInt(formattedTime.replace(regExp, "$1$2$3")) <= parseInt(_endTime.replace(regExp, "$1$2$3"))
        ) {
          console.log("----------------------------------------------------------------------------------------------");
         return e
        }
      });
    };
    const deviceId7Data = getInfoDeviceId7();
    console.log({ deviceId7Data });
    return deviceId7Data.level;
  };
  getDevice5Data = async () => {
    // return data;
    return new Promise((resolve, reject) => {
      readFile(`./app/data/device5.json`, "utf8", function (err, data) {
        if (err) {
          console.log({ err });
        }
        // Display the file content
        const device5Data = JSON.parse(data);
        const { startDate, endDate, divisionFactor = 1 } = device5Data;
        const _startDate = new Date();
        const _endDate = new Date(endDate);
        const diffTime = _endDate - _startDate;

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log({ diffDays });
        if (diffDays < 1) {
          //we'll write the file again
          const date = new Date();
          const dataToStore = JSON.stringify({
            startDate: date,
            endDate: new Date(date.setDate(date.getDate() + 45)),
            divisionFactor: "2.22222222",
          });

          writeFile("./app/data/device5.json", dataToStore, function (error) {
            if (error) {
              console.log("sss", error);
            }
            resolve(100);
          });
        } else {
          const level = Math.floor(
            100 - (45 - diffDays) * Number(divisionFactor)
          );
          resolve(level);
        }
      });
    });
  };
  getDevice8Data = async () => {
    // return data;
    return new Promise((resolve, reject) => {
      readFile(`./app/data/device8.json`, "utf8", function (err, data) {
        if (err) {
          console.log({ err });
        }
        // Display the file content
        const device5Data = JSON.parse(data);
        const { endDate } = device5Data;
        const _startDate = new Date();
        const _endDate = new Date(endDate);
        const diffTime = _endDate - _startDate;

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log({ diffDays });
        if (diffDays < 1) {
          //we'll write the file again
          const date = new Date();
          const dataToStore = JSON.stringify({
            startDate: date,
            endDate: new Date(date.setDate(date.getDate() + 180)),
          });

          writeFile("./app/data/device8.json", dataToStore, function (error) {
            if (error) {
              console.log("sss", error);
            }
            resolve(180);
          });
        } else {
          resolve(diffDays);
        }
      });
    });
  };
  getDevice9Data = async () => {
    // return data;
    return new Promise((resolve, reject) => {
      readFile(`./app/data/device9.json`, "utf8", function (err, data) {
        if (err) {
          console.log({ err });
        }
        // Display the file content
        const device5Data = JSON.parse(data);
        const { endDate } = device5Data;
        const _startDate = new Date();
        const _endDate = new Date(endDate);
        const diffTime = _endDate - _startDate;

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log({ diffDays });
        if (diffDays < 1) {
          //we'll write the file again
          const date = new Date();
          const dataToStore = JSON.stringify({
            startDate: date,
            endDate: new Date(date.setDate(date.getDate() + 90)),
          });

          writeFile("./app/data/device9.json", dataToStore, function (error) {
            if (error) {
              console.log("sss", error);
            }
            resolve(180);
          });
        } else {
          resolve(diffDays);
        }
      });
    });
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
      const luxAndAQ = await this.getDeviceId3And4Data();
      const handWashLevel = await this.getDevice6Data();
      const garbageMonitor = await this.getDevice7Data();
      const airNuetrelizer = await this.getDevice5Data();
      const DGSetServiceDue = await this.getDevice8Data();
      const acServiceDue = await this.getDevice9Data();
      console.log({ airNuetrelizer, DGSetServiceDue });

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
            ...luxAndAQ,
            airNuetrelizer,
            DGSetServiceDue,
            acServiceDue,
            handWashLevel,
            garbageMonitor,
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
