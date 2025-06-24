import {getFunctions, httpsCallable} from "firebase/functions";

// Retrieve signed URL function from firebase functions. This is possible
// as firebase.ts within this folder contains the information of the project
// allowing us to retrieve the function with getFunctions().
const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");

export async function uploadVideo(file: File) {
    
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });

    // Upload the file via the signedUrl
    await fetch(response?.data?.url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        }
    });
    return;
};