import { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
// import SweetAlert2 from "react-sweetalert2";
import { UserContext } from "../App";
import { jwtDecode } from "jwt-decode";

const Signup = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHandlingSignUp, setIsHandlingSignUp] = useState(false);
  // const [swalProps, setSwalProps] = useState({});

  let isButtonDisabled =
    username.length < 3 ||
    hasSpecialCharacters(username) ||
    password !== confirmPassword ||
    !hasSpecialCharacters(password) ||
    !isEmailValid(email) ||
    password.length < 6 ||
    password.includes(" ");

  function hasSpecialCharacters(userString) {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(userString);
  }
  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleLoginAfterSigningUp = async () => {
    setIsHandlingSignUp(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email.trim(),
          password: password,
        }),
      });
      const responseData = await response.json();
      if (responseData.success && responseData.token) {
        localStorage.setItem("token", responseData.token);
        const decoded = jwtDecode(responseData.token);
        console.log(decoded);
        setUser(decoded.username);
        navigate("/");
      } else {
        setIsLoading(false);
        alert(responseData.error);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsHandlingSignUp(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.success) {
        setIsLoading(false);
        alert(
          "Your account has been created! Click OK to go to your home page."
        );
        await handleLoginAfterSigningUp();
      } else {
        alert(responseData.error);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 min-h-screen flex items-center justify-center">
      <div className="bg-gradient-to-r from-blue-300 to-green-300 p-8 rounded shadow-md w-80">
        <Link
          to={"/"}
          className="mb-2 text-3xl text-blue-700 hover:cursor-pointer hover:text-blue-800"
        >
          <FaHome />
        </Link>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
          {isLoading
            ? "Creating your account..."
            : isHandlingSignUp
            ? "Signing in"
            : "Sign Up"}
        </h2>{" "}
        {!isLoading || isHandlingSignUp ? (
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              {!isEmailValid(email.trim()) && email.length > 0 ? (
                <p className={`text-xs text-red-500`}>
                  Must be in proper email format
                </p>
              ) : null}
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                type="email"
                id="email"
                name="email"
                maxLength={254}
                disabled={isLoading}
                className={`w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:border-blue-900 ${
                  !isEmailValid(email.trim()) && email.length > 0
                    ? "border-red-700"
                    : ""
                }`}
                placeholder="Your email address"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              {username.length < 3 && username.length > 0 ? (
                <p className={`text-xs text-red-500`}>
                  Username must be atleast 3 characters
                </p>
              ) : null}
              {hasSpecialCharacters(username) ? (
                <p className={`text-xs text-red-500`}>
                  Username cannot have any special characters
                </p>
              ) : null}
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                type="text"
                id="username"
                name="username"
                maxLength={20}
                disabled={isLoading}
                className={`w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:border-blue-900 ${
                  (username.length < 3 || hasSpecialCharacters(username)) &&
                  username.length > 0
                    ? "border-red-700"
                    : ""
                }`}
                placeholder="Your username"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium text-gray-700`}
                >
                  Password
                </label>
                <div className="hover:cursor-pointer">
                  {passwordVisible ? (
                    <FaEyeSlash
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    />
                  )}
                </div>
              </div>
              {!hasSpecialCharacters(password) && password.length > 0 ? (
                <p className={`text-xs text-red-500`}>
                  Must include a special character
                </p>
              ) : null}
              {(password.length < 6 && password.length > 0) ||
              password.includes(" ") ? (
                <p className={`text-xs text-red-500`}>
                  Must be at least 6 characters and none of them can be spaces
                </p>
              ) : null}
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                maxLength={20}
                disabled={isLoading}
                className={`w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:border-blue-900 ${
                  (!hasSpecialCharacters(password) || password.length < 6) &&
                  password.length > 0
                    ? "border-red-700"
                    : ""
                }`}
                placeholder="Your password"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="hover:cursor-pointer">
                  {passwordVisible ? (
                    <FaEyeSlash
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    />
                  )}
                </div>
              </div>

              {password !== confirmPassword && confirmPassword.length > 0 ? (
                <p className={`text-xs text-red-500`}>
                  Must match your password
                </p>
              ) : null}
              <input
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                value={confirmPassword}
                type={passwordVisible ? "text" : "password"}
                id="confirmPassword"
                name="password"
                maxLength={20}
                disabled={isLoading}
                className={`w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:border-blue-900 ${
                  password !== confirmPassword && confirmPassword.length > 0
                    ? "border-red-700"
                    : ""
                }`}
                placeholder="Confirm your password"
              />
            </div>
            <button
              onClick={handleSignUp}
              // onClick={() => {
              //   setSwalProps({
              //     show: true,
              //     text: "Example...",
              //     title: "Hello World",
              //     icon: "success",
              //   });
              // }}
              disabled={isButtonDisabled}
              className={`w-full ${
                isButtonDisabled
                  ? "bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white py-2 rounded-md transition duration-300`}
            >
              Sign Up and Log In
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <p className="text-gray-700 text-sm mt-3 text-center">
            Already have an account?{"  "}
            <Link
              to={"/log-in"}
              className="text-blue-600 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        )}
      </div>
      {/* <SweetAlert2
        {...swalProps}
        onConfirm={() => setSwalProps({})}
        // showLoaderOnConfirm={true}
      /> */}
    </div>
  );
};

export default Signup;
