const taskRoute = require("../../v1/router/task.route");
const usersRoute = require("../../v1/router/users.route");
const authMiddleware = require("../../../middlewares/auth.middleware");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/task", authMiddleware.requireAuth, taskRoute);
  app.use(version + "/users", usersRoute);
};
