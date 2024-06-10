import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

function Account() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <button onClick={logout}>Logout</button>
    );
}

export default Account;
