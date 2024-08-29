import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routes/user";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error";
import transactionRouter from "./routes/transaction";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter)
app.use("/api/v1/transaction", transactionRouter)

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
