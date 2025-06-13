import express from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const app = express();
app.use(express.json());

// Post call to upload a video
app.post("/process-video", (req, res) => {

  // Get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  // Error checking to ensure required fields are not null
  if (!inputFilePath || !outputFilePath) {
    res.status(400).send("Bad Request: Missing file path.");
    return;
  }

  // Covert input video to 360p regardless the original resolution
  ffmpeg(inputFilePath)
    // Process the video for 360p resolution
    .outputOptions("-vf", "scale=-1:360")
    // On end, notify user with 200 OK
    .on("end", () => {
      res.status(200).send("Video processing started.");
    })
    // On error, notify user with 500 error
    .on("error", (err) => {
      console.log(`An error occured: ${err.message}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
