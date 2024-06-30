import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, googleProvider } from "../../config/firebase";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, } from "firebase/auth";
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/account");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/account");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <main>
        <div data-testid="login-test" className="container-Login">
          <div className="Login-account-button">
            <button className="Login-button-option" onClick={signInWithGoogle}>Sign in with Google</button>
            <div className="Divider-login-buttons-container">
              <div className="Divider-login-buttons"></div>
              <p>of</p>
              <div className="Divider-login-buttons"></div>
            </div>
            <button id='cypress-test-register-button' className="Login-button-option" onClick={() => navigate("/register")}>Account aanmaken</button>
          </div>
          <div id="cypress-test-login-form-button" className="account-login Login-account-button">
            <h4>Heb je al een account?</h4>

            <button className="Login-button-option" onClick={() => document.getElementById('my_modal_2').showModal()}>Inloggen</button>
            <dialog id="my_modal_2" className="modal">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div className="modal-box">

                <h3 className="font-bold text-lg Inloggen-modal">Inloggen</h3>
                <div className="modal-action">
                  <form method="dialog" className='post-form'>
                    <div className="Login-input-fields">
                      <label htmlFor="email-address">Email address</label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="Login-input-fields">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="Login-modal-buttons">
                      <button id="cypress-test-login-form" onClick={onLogin}>Login</button>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          {/* <form>
            <div>
              <label htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button onClick={onLogin}>Login</button>
            </div>
          </form> */}
        </div>
      </main>
    </>
  );
};

export default Login;
