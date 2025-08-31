import userRoute from "./User.routes.js";
import expenseRoute from "./Expense.routes.js";
import tenantRoute from "./Tanant.routes.js";
import notificationRoute from "./Notification.routes.js";
import authRoute from "./Authentication.routes.js";

const routes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/tenant", tenantRoute);
  app.use("/api/v1/expense", expenseRoute);
  app.use("/api/v1/notification", notificationRoute);
};

export default routes;
