import React, { useRef, useState, useEffect } from 'react'
import "./LoginSignUp.css"
import Loader from "../layout/loader/Loader"
import { Link } from "react-router-dom"
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from 'react-redux'
import { login, register } from '../../actions/userActions'
import { useAlert } from "react-alert"
import { clearErrors } from '../../actions/productActions'
import MetaData from '../layout/MetaData'
const LoginSingUp = ({ history,location }) => {

  const dispatch = useDispatch();
  const alert = useAlert();


  const { error, loading, isAuthenticated } = useSelector(state => state.user)

  // location.search return entire query String after ? of url as we have used location not any url variablNmae.search
  //location.search.split('=')[1]-->this will give /shipping as output id present if not then give /account
  const redirect = location.search ? location.search.split('=')[1] : '/account'

  // agar start m hi koi error aa gya toh isliye useEffect k andar hmne alert use kiya h
  useEffect(() => {
    if (error) {
      // inspite of just returning alert.error(error) use clearErrors after showing alert in store
      alert.error(error);
      dispatch(clearErrors())
    }
    if (isAuthenticated) {
      history.push(redirect)
    }
  }, [dispatch, error, alert, history, isAuthenticated,redirect])


  const loginTab = useRef(null);// to target DOm elemets like document.querySelector('.loginForm')
  const registerTab = useRef(null);
  const switcherTab = useRef(null); // switcherTab ek button ko refer kr rha h jisse hm as a border k tarah use karenge

  const [loginEmail, setLoginEmail] = useState("");// will be use in Login FORM niot in signUp form
  const [loginPassword, setLoginPassword] = useState("");

  const [currTab, setCurrTab] = useState("Login");// will be use in Login FORM niot in signUp form
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("/Profile.png");// public wale folder ki cheeze direclty / krke access kr skte h
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // login kne pr hi mujhe login ka vlaidation vagera dekhna h
  const [isShown, setIsSHown] = useState(false);

  // This function is called when the checkbox is checked or unchecked
  const togglePassword = () => {
    setIsSHown((isShown) => !isShown);
  };
  const loginSubmit = (e) => {
    e.preventDefault();

    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    // form ka data bna kr bhejenge poora

    // const myForm = new FormData();

    // myForm.set("name", name); // name field me name ayge (useState wala)
    // myForm.set("email", email);// email field me email ayge (useState wala)
    // myForm.set("password", password);
    // myForm.set("avatar", avatar);
    // rather sneding as an form send it as json bcz if u use form to send data then u won't be able to uplaod image of karger tha 750kb size
    const data={
      "name":name,
      "email":email,
      "password":password,
      "avatar":avatar
    }
    dispatch(register(data));
  };

  const registerDataChange = (e) => {
    // avatar waale k liye alag se registerDataChANGE Handle krna h aur baaki saare input fields ko similar tarah se handle krna h

    if (e.target.name === "avatar") {
      const reader = new FileReader(); // for reading file

      reader.readAsDataURL(e.target.files[0]);

      reader.onload = () => {
        if (reader.readyState === 2) { // three state possible 0:initial 1:processing 2:done
          setAvatarPreview(reader.result);
          console.log(reader.result);
          setAvatar(reader.result);
        }
      };

    }
    else {
      console.log('else block')
      // firstly make a copy and make on the necessary fields only and pass it back entirely
      setUser({ ...user, [e.target.name]: e.target.value });
      // change the the input with their corresponding value on onchange i.e "name":value,"email":value
    }
  };
  // to switch left<----> right in our form (login<----->register)
  const switchTabs = (e, tab) => {
    if (tab === "login") {


      setCurrTab('Login')
      switcherTab.current.classList.add("shiftToNeutral"); // intial wale position pr le aayega jo css m set kiya hoga i.e .shiftToNeutral {transform: translateX(0%); }
      switcherTab.current.classList.remove("shiftToRight"); // right side shift ko hta dega(.shiftToRight {        transform: translateX(100%);})

      registerTab.current.classList.remove("shiftToNeutralForm");// intial ko set kra rakhega bcz hme pehle hi voh by default set kiya tha(.signUpForm {transform: translateY(-100%) translateX(-100vmax);}) aur hta dega shiftToNeutralForm class ko jisme bhi oehle se kuch css applied h (.shiftToNeutralForm {transform: translateX(0%) translateY(-100%);})
      loginTab.current.classList.remove("shiftToLeft");// left side shift ko hta dega on loginTab .shiftToLeft {transform: translateX(-100%)}
    }
    if (tab === "register") {
      setCurrTab('SignUp')
      // uppar ka opposite hmne isme kiya h
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }

  };
  return (
    <>
      {loading ? <Loader /> : <>
      <MetaData title={`${currTab}`} />
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <div>
              {/* when we click on login then login page will be shown up and */}
              {/* when signUpclicked sign Up Page will be shown up so to toggle that only this div is created */}
              <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>SIGN  UP</p>
              </div>
              <button ref={switcherTab}></button>
            </div>
            <form action="" className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="loginEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <LockOpenIcon />
                <input
                  type={isShown ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <div>
                <div className="checkbox-container" >
                  <span style={{ marginRight: '5px' }}> Show password </span>
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={isShown}
                    onChange={togglePassword}
                  />
                </div>
              </div>
              <Link to="/password/forgot">Forget Password ?</Link>

              <input type="submit" value="Login" className="loginBtn" />
            </form>


            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data" //written bcz we will be also uploading profilepic of user as well
              onSubmit={registerSubmit}
            >
              <div className="signUpName">
                <FaceIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpPassword">
                <LockOpenIcon />
                <input
                  type={isShown ? "text" : "password"}
                  placeholder="Password"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>
              <div>
                <div className="checkbox-container" >
                  <span style={{ marginRight: '5px' }}> Show password?</span>
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={isShown}
                    onChange={togglePassword}
                  />
                </div>
              </div>

              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*" // koi bhi type ki image hi honi chaiye
                  onChange={registerDataChange}

                  required
                />
              </div>

              <input type="submit" value="Sign Up" className="signUpBtn" />
            </form>

          </div>
        </div>
      </>}
    </>

  )
}

export default LoginSingUp
