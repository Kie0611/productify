import express from "express";
import cors from "cors"

import { ENV } from "./config/env";
import { clerkMiddleware, ClerkMiddleware } from "@clerk/express";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }))
app.use(clerkMiddleware()); // auth obj will be attached to the req
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })) // parses form data (like html forms)

app.get("/", (req, res) => {
  res.json({ success: true });
});
 
app.listen(ENV.PORT, () => {
  console.log("Server is running on PORT:", ENV.PORT);
});
