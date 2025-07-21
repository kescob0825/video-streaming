import { useSearchParams } from "next/navigation";

export default function Watch() {

    const videPrefix = 'https://storage.googleapis.com/kescob-processed-videos/';
    const videoSrc = useSearchParams().get('v');
    return (
        <div>
            <h1>Watch Page</h1>
            <video controls src={videPrefix + videoSrc}/>
        </div>
    );
}