const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const weatherService = require("../services/weatherService");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.dailyWeatherController = asyncHandler(async (req, res) => {
  const weather = await weatherService.dailyWeather(req);
  return SuccessHandler(
    res,
    `Weather data has been fetched successfully`,
    weather
  );
});

exports.currentWeatherController = asyncHandler(async (req, res) => {
  const weather = await weatherService.currentWeather(req);
  return SuccessHandler(
    res,
    `Weather data has been fetched successfully`,
    weather
  );
});
