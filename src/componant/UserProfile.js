import React, { useContext, useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { deleteObject, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/default-img.jpg';
import { UserContext } from '../context/UserContext';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(auth.currentUser.displayName);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

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
            const imageRef = ref(storage, postUrl);
            await deleteObject(imageRef);

            const userDoc = doc(db, 'users', id);
            await deleteDoc(userDoc);

            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        }
    };

    const handleSubmit = async () => {
        try {
            if (username.trim() !== "") {
                let photoURL = auth.currentUser.photoURL; // Default to current photo URL
                if (previewPhoto) {
                    // Upload the image to Firebase Storage
                    const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
                    const snapshot = await uploadString(storageRef, previewPhoto, 'data_url');

                    // Get the download URL of the uploaded image
                    photoURL = await getDownloadURL(snapshot.ref);
                }

                await updateProfile(auth.currentUser, {
                    displayName: username,
                    photoURL: photoURL
                });
                setUser({ ...user, photoURL: photoURL });
                console.log('Profile updated successfully');
                setIsModalOpen(false); // Close the modal on successful update
            } else {
                console.error('Username cannot be empty');
                setError('Username cannot be empty');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        }
    };



    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPhoto(reader.result);
            };
            reader.readAsDataURL(file);
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
                        src={previewPhoto || auth.currentUser.photoURL || logo}
                        className="profile-picture"
                        alt=""
                    />
                    <div className="profile-info">
                        <p className="profile-email">{auth.currentUser.email}</p>
                        <p className="profile-name">
                            {auth.currentUser.displayName}
                            <i className="bx bx-edit edit-icon" onClick={() => setIsModalOpen(true)}></i>
                        </p>
                    </div>
                </div>
                <div className="post-grid">
                    {users.map((post) => (
                        <div className="post-card" key={post.id}>
                            <img src={post.post} alt="" className="post-image" />
                            <p className="post-caption">{post.postTitle}
                            <i class="bx bxs-heart" >{post.likes}</i></p>
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

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <input
                            placeholder="type your @username.."
                            value={auth.currentUser.displayName}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button className='submit' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
