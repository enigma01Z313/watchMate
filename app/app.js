const express = require("express");
const fs = require("fs");
const app = express();
var path = require("path");
const bodyParser = require("body-parser");
const router = require("./api/router");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);

// app.get("/video/1.mp4", (req, res) => {
//   const { range } = req.headers;
//   if (!range) return res.status(400).send("Requires Range Header");
//   const videoPath = __dirname + "/public/vids/1.mp4";
//   const videoSize = fs.statSync(videoPath).size;

//   const CHUNK_SIZE = 10 ** 6; // 100KB
//   // const start = Number(range.replace(/\D/g, ""));
//   const start = Math.max(Number(range.replace(/\D/g, "")), 9375164);
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
//   const contentLength = end - start + 1;
//   console.log(start);

//   const headers = {
//     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };

//   res.writeHead(206, headers);
//   const videoStream = fs.createReadStream(videoPath, { start, end });
//   videoStream.pipe(res);
// });



module.exports = app;
