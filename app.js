const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const apiRouter = require("./routes/apiRoutes");
const viewsRouter = require("./routes/viewsRoutes");
const { checkUser } = require("./middelwares/authMiddelware");

dotenv.config();
const urlAtlasDB = `mongodb+srv://${process.env.user_admin_atlas}:${process.env.atlas_admin_password}@cluster0.4hbl5tb.mongodb.net/job-apply-tracker?retryWrites=true&w=majority&appName=Cluster0`;

const PORT = 3000;
const app = express();
mongoose
  .connect(urlAtlasDB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("*", checkUser);
app.get("/", (req, res) => res.redirect("/home"));

app.use("/api", apiRouter);
app.use(viewsRouter);
