const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const weatherRoutes = [
    {
        method: METHOD.GET,
        path: PATH.WEATHER_DAILY,
        roles: [],
        handler: weatherController.dailyWeatherController,
    },
    {
        method: METHOD.GET,
        path: PATH.WEATHER_CURRENT,
        roles: [],
        handler: weatherController.currentWeatherController,
    },
];

weatherRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
