// Google Cloud Storage Interactions AND Local file interactions
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

const storage = new Storage();

const rawVideoBucketName = "kescob-raw-videos";
const processedVideoBucketName = "kescob-processed-video";

const rawVideoLocalPath = "./raw-videos";
const processedVideoLocalPath = "./processed-videos";

/**
 *  Creates the local directories for raw videos before it is processed
 *  and processed videos.
 */
export function setupDirectories() {
  checkDirectoryExistence(rawVideoLocalPath);
  checkDirectoryExistence(processedVideoLocalPath);
}

/**
 *  This function will contain the logic and error handling behind video processing.
 *  @param { string } rawVideoName - The name of the file to be converted, stored in
 *  {@link rawVideoLocalPath} directory.
 *  @param { string } processedVideoName - The name of the converted file after it is processed
 *  {@link processedVideoLocalPath}.
 *  @returns - A Promise that resolves when the video has been successfully converted.
 *  Rejects, if it fails in any way.
 */
export function processVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${rawVideoLocalPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360")
      .on("end", () => {
        console.log("Video processing started.");
        resolve();
      })
      .on("error", (err: Error) => {
        console.log(`Internal Server Error: ${err.message}`);
        reject(err);
      })
      .save(`${processedVideoLocalPath}/${processedVideoName}`);
  });
}

/**
 * This function will download raw video retrieved from Google Cloud Storage.
 * @param { string } fileName - The name of the file to download from the {@link rawVideoBucketName}
 * bucket into the {@link rawVideoLocalPath} directory.
 * @returns - A Promise that resolves when the video has been successfully downloaded.
 * Reject, if it fails in any way.
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${rawVideoLocalPath}/${fileName}` });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${rawVideoLocalPath}/${fileName}.`
  );
}

/**
 * This function will upload a processed video to the Google Cloud Storage.
 * @param { string } fileName - The name of the file to be uploaded from the {@link processedVideoLocalPath}
 * directory to the {@link processedVideoBucketName} bucket.
 * @return - A Promise that resolves when the video has been successfully uploaded.
 * Reject, if it fails in any way.
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${processedVideoLocalPath}/${fileName}`, {
    destination: `${processedVideoBucketName}/${fileName}`,
  });

  console.log(
    `${rawVideoLocalPath}/${fileName} uploaded to gs://${rawVideoBucketName}/${fileName}.`
  );

  await bucket.file(fileName).makePublic();
}

/**
 * This function will delete a file given a specified path.
 * @param filePath - The path of the file to be deleted.
 * @returns - A promise that resolves when the video has been successfully deleted.
 * Reject, if it fails in any way.
 */
function deleteFile(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log("File found, deleting initiated.");
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`File deletion failed at ${filePath}`, err);
          reject(`File deletion failed.`);
        } else {
          console.log(`File at ${filePath} has been successfully deleted.`);
          resolve();
        }
      });
    } else {
      console.log(
        `File cannot be found at ${filePath}, no deletion were executed.`
      );
      reject(`File does not exists at ${filePath}`);
    }
  });
}

/**
 * This function will delete the raw video from the local directory.
 * @param { string } fileName - The name of the file to be deleted from the
 * {@link rawVideoLocalPath} directory.
 * @returns - A promise that resolves when the video has been successfully
 * deleted. Reject, if it fails in any way.
 */
export function deleteRawVideo(fileName: string) {
  deleteFile(`${rawVideoLocalPath}/${fileName}`);
}

/**
 * This function will delete the processed video from the local directory.
 * @param { string } fileName - The name of the ifle to be deleted from the
 * {@link processedVideoLocalPath} directory.
 * @returns - A promise that resolves when the file has been successfully
 * deleted. Reject, if it fails in any way.
 */
export function deleteProcessedVideo(fileName: string) {
  deleteFile(`${processedVideoLocalPath}/${fileName}`);
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param { string } dirPath - The path of the directory that must be checked.
 */
function checkDirectoryExistence(dirPath: string) {
  const fullPath = path.join(process.cwd(), dirPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Directory created at ${dirPath}`);
  }
}
