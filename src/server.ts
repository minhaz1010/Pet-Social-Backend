import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { NextFunction, Request, Response } from "express";
// import config from "./app/config";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    server = app.listen(config.PORT, () => {
      console.log("app is listening on port ", config.PORT);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
const HTTP_SERVER_ERROR = 500;
app.use(function (err:any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || HTTP_SERVER_ERROR).render("500");
});

// process.on("unhandledRejection", () => {
//   console.log("😈 unahandledRejection is detected , shutting down ...");
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });

process.on("uncaughtException", () => {
  console.log("😈 uncaughtException is detected , shutting down ...");
  process.exit(1);
});
