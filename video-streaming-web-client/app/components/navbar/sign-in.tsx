import { Fragment } from "react";

import {
    signInWithGoogle,
    signOutGoogleAccount,
} from "@/app/util/firebase/firebase";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {
                user ? (
                    <button className={styles.signin} onClick={signInWithGoogle}>
                        Sign In
                    </button>
                ) : (
                    <button className={styles.signin} onClick={signOutGoogleAccount}>
                        Sign Out
                    </button>
                )
            }

        </Fragment>
    );
}
