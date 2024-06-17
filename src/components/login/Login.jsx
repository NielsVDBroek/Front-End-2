import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { auth, googleProvider } from "../../config/firebase";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

 
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            navigate("/")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }

    const signInWithGoogle = async () => {
        try{
        await signInWithPopup(auth, googleProvider);
        navigate("/");
        } catch(err) {
            console.log(err);
        }
    };
 
    return(
        <>
            <main >        
                <section>
                    <div>                                                                 
                                                       
                        <form>                                              
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                                                
                            <div>
                                <button                                    
                                    onClick={onLogin}                                        
                                >      
                                    Login                                                                  
                                </button>
                            </div>                               
                        </form>
                        <button onClick={signInWithGoogle}>Sign in with Google</button>
                       
                        <p className="text-sm text-white text-center">
                            <Link to={'/register'}>Nog geen account? Registreer hier.</Link>
                        </p>
                                                   
                    </div>
                </section>
            </main>
        </>
    )
}
 
export default Login