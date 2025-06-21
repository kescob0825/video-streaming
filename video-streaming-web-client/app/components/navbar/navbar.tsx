import Image from "next/image";
import Link from "next/link";

import styles from "./navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.logoContainer}>
                <Image
                    width={40}
                    height={40}
                    src="/video-streaming-logo.png"
                    alt="Video Streaming Logo"
                />
                <h1>ideo Streaming</h1>
            </Link>
        </nav>
    );
}
