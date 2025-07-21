import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

const VideoCollectionId = "videos";

export interface Video {
    id?: string;
    uid?: string;
    filename?: string;
    status?: 'processing' | 'processed';
    title?: string;
    description?: string;
}

async function getVideo(videoId: string) {
    const snapshot = await firestore.collection(VideoCollectionId).doc(videoId).get();
    return (snapshot.data() as Video) || {};
}

export async function setVideo(videoId: string, video: Video) {
    firestore.collection(VideoCollectionId).doc(videoId).set(video, { merge: true });
}

export async function isVideoNew(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}