import { useParams } from "react-router-dom";
import useUsers from "../hooks/useUsers";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const UserPost = () => {
    const [UsersProfileImg, setUsersProfileImg] = useState(null)
    const [UsersProfileName, setUsersProfileName] = useState(null)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [follow, setFollow] = useState(null);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const { allUsers } = useUsers();

    // Find the email associated with the user id
    const user = allUsers.find(u => u.uid === id);
    const email = user ? user.email : null;

    useEffect(() => {
        if (user) {
            setUsersProfileName(user.displayName);
            setUsersProfileImg(user.photoURL);
        }
    }, [user]);


    const fetchUsers = async () => {
        if (!email) return; // Skip if email is not found
        try {
            const usersCollectionRef = collection(db, 'users');
            const userQuery = query(usersCollectionRef, where("userEmail", "==", email));
            const data = await getDocs(userQuery);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [email]); // Depend on email and id to trigger fetchUsers\



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }



    return (
        <>
            <div className="Home">
                <div className="profile-header">
                    <img
                        src={UsersProfileImg}
                        className="profile-picture"
                        alt=""
                    />
                    <div className="profile-info">
                        <p className="profile-name">
                            @{UsersProfileName} <br /><br />
                            <button className={follow ? "instagram-follow-button" : "instagram-following-button"} onClick={() => setFollow(!follow)}>
                                {follow ? "Follow" : "Following"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>



            {!users.length && <div className="Home">No posts available</div>}


            {users.map((post) => (
                <div className="user-post-card" key={post.id}>
                    <div className="user-post-image-wrapper">
                        <img src={post.post} alt="" className="user-post-image" />
                        <div className="user-post-caption">{post.postTitle}</div>
                    </div>
                </div>
            ))}
        </>

    );
};

export default UserPost;
