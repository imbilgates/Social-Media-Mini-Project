import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, runTransaction } from 'firebase/firestore';
import logo from '../assets/img/default-img.jpg';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateStatus = async (currentUser, status) => {
        if (currentUser) {
            const userRef = doc(db, "users-log", currentUser.uid);
            await runTransaction(db, async (transaction) => {
                transaction.set(userRef, {
                    displayName: currentUser.displayName || "user",
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || logo,
                    uid: currentUser.uid,
                    status: status,
                    lastLogin: new Date().toISOString(),
                }, { merge: true });
            });
        }
    };

    const updateStatusSync = (currentUser, status) => {
        if (currentUser) {
            const url = `${process.env.REACT_APP_FIREBASE_FUNCTION_URL}/updateStatus`;
            const data = JSON.stringify({
                uid: currentUser.uid,
                status: status,
                lastLogin: new Date().toISOString()
            });

            navigator.sendBeacon(url, data);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                updateStatus(currentUser, 'online');
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && user) {
                updateStatus(user, 'offline');
            } else if (document.visibilityState === 'visible' && user) {
                updateStatus(user, 'online');
            }
        };

        const handleBeforeUnload = () => {
            if (user) {
                updateStatusSync(user, 'offline');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (user) {
                updateStatus(user, 'offline');
            }
        };
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, isModalOpen, setIsModalOpen }}>
            {children}
        </UserContext.Provider>
    );
};
