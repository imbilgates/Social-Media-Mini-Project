import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, runTransaction } from 'firebase/firestore';
import logo from '../assets/img/default-img.jpg'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Update status to "online" or "offline"
    const updateStatus = async (currentUser, status) => {
        if (currentUser) {
            const userRef = doc(db, "users-log", currentUser.uid);
            await runTransaction(db, async (transaction) => {
                transaction.set(userRef, {
                    displayName: currentUser.displayName || "user",
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || logo,
                    uid: currentUser.uid,
                    status: status, // Set status to "online" or "offline"
                    lastLogin: new Date().toISOString(),
                }, { merge: true });
            });
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
                updateStatus(user, 'offline');
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
