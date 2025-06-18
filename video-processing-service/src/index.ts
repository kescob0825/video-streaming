import express, { Request, Response } from "express";
import {
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  processVideo,
  setupDirectories,
  uploadProcessedVideo,
} from "./storage.js";

setupDirectories();

const app = express();
app.use(express.json());

// Post call to upload a video
app.post(
  "/process-video",
  async (req: Request, res: Response): Promise<void> => {
    let data;
    try {
      const message = Buffer.from(req.body.message.data, "base64").toString(
        "utf8"
      );
      data = JSON.parse(message);
      if (!data.name) {
        throw new Error("Invalid message payload recieved.");
      }
    } catch (error) {
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
    } catch (err) {
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
  }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

