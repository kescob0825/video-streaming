"use client";

import Image from "next/image";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { User } from "firebase/auth";

import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../../util/firebase/firebase";

export default function Navbar() {

    // Initialize user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user: SetStateAction<User | null>) => {
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
            {
                // TODO: Upload button goes here.
            }
            <SignIn user={user}/>
        </nav>
    );
}
