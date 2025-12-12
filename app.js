import express from "express";
import "dotenv/config"; 
import collectionsRoute from "./routes/collections.js";
import sliderRoute from "./routes/slider.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
}));

app.get("/", (req, res) => {
  res.send("API běží");
});

app.use("/albums", collectionsRoute);

app.use("/slider", sliderRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT);
