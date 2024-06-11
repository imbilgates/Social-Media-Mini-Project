import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const usersCollectionRef = collection(db, 'users');
            const userQuery = query(usersCollectionRef, where("userEmail", "==", auth.currentUser.email));
            const data = await getDocs(userQuery);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id, postUrl) => {
        try {
            // Delete the image from Firebase Storage
            const imageRef = ref(storage, postUrl);
            await deleteObject(imageRef);

            // Delete the Firestore document
            const userDoc = doc(db, 'users', id);
            await deleteDoc(userDoc);

            // Refetch users
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="user-profile">
                <div className="profile-header">
                    <img
                        src={auth.currentUser.photoURL}
                        className="profile-picture"
                        alt=""
                    />
                    <div className="profile-info">
                        <p className="profile-email">{auth.currentUser.email}</p>
                        <p className="profile-name">{auth.currentUser.displayName}</p>
                    </div>
                </div>
                <div className="post-grid">
                    {users.map((post) => (
                        <div className="post-card" key={post.id}>
                            <img src={post.post} alt="" className="post-image" />
                            <div className="post-info">
                                <p className="post-caption">Caption: {post.postTitle}</p>
                            </div>
                            <div className="post-actions">
                                <i
                                    className="bx bx-edit edit-icon"
                                    onClick={() => navigate(`/crud/update/${post.id}`)}
                                ></i>
                                <i
                                    className="bx bx-trash delete-icon"
                                    onClick={() => deleteUser(post.id, post.post)}
                                ></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
