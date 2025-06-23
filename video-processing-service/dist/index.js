import express from "express";
<<<<<<< HEAD
import { deleteProcessedVideo, deleteRawVideo, downloadRawVideo, processVideo, setupDirectories, uploadProcessedVideo, } from "./storage.js";
setupDirectories();
const app = express();
app.use(express.json());
// Post call to upload a video
app.post("/process-video", async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, "base64").toString("utf8");
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error("Invalid message payload recieved.");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad Request: Missing file name.");
        return;
    }
    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    // Download raw video from Cloud Storage
    await downloadRawVideo(inputFileName);
    // Upload processed video from Cloud Storage
    try {
        await processVideo(inputFileName, outputFileName);
    }
    catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName),
        ]);
        console.error(err);
        res.status(500).send("Internal Server Error: video processing failed.");
    }
    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName),
    ]);
    res.status(200).send("Video processing successful");
    return;
=======
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
>>>>>>> 065d4e24e5bee62035698ddf0f90719fc350d48b
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
