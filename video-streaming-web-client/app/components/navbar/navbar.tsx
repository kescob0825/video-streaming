"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import Upload from "./upload";
import { onAuthStateChangedHelper } from "../../util/firebase/firebase";

export default function Navbar() {

    // Initialize user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user)
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
    });

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
            <div className={styles.uploadAndSignInContainer}>
                {
                    user && <Upload />
                }
                <SignIn user={user} />
            </div>
        </nav>
    );
}
