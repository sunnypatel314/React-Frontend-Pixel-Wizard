import { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../App";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { user, setUser } = useContext(UserContext);

  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let isButtonDisabled =
    usernameOrEmail.length === 0 || password.length < 6 || isLoading;

  const handleLogIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/api/v1/auth/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: usernameOrEmail.trim(),
          password: password,
        }),
      });
      const responseData = await response.json();
      if (responseData.success && responseData.token) {
        localStorage.setItem("token", responseData.token);
        const decoded = jwtDecode(responseData.token);
        setUser(decoded.username);
        navigate("/");
      } else {
        setErrorMessage(responseData.error || "Invalid credentials");
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-gradient-to-r from-green-300 to-blue-300 p-8 rounded shadow-md w-80 mb-4">
        <Link
          to={"/"}
          disabled={isLoading}
          className="mb-2 text-3xl text-green-700 hover:cursor-pointer hover:text-green-800"
        >
          <FaHome />
        </Link>
        <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">
          {isLoading ? "Logging in..." : "Log In"}
        </h2>
        {!isLoading ? (
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Username or Email
              </label>
              {errorMessage === "Username or email not found" && (
                <p className={`text-xs text-red-500`}>{errorMessage}</p>
              )}
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full px-3 py-2 border border-green-400 focus:outline-none focus:border-green-900 rounded"
                placeholder="Your email address"
                required
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
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
              {errorMessage === "Invalid credentials" && (
                <p className={`text-xs text-red-500`}>{errorMessage}</p>
              )}
              <input
                type={!passwordVisible ? "password" : "text"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-green-400 focus:outline-none focus:border-green-700 rounded"
                placeholder="Your password"
                required={true}
                autoComplete="new-password"
              />
            </div>
            <button
              type="button"
              className={`w-full text-white py-2 rounded-md
             transition duration-300 ${
               usernameOrEmail.length === 0 || password.length < 6
                 ? "bg-gray-500 hover:bg-gray-500"
                 : "bg-green-500 hover:bg-green-700"
             }`}
              onClick={handleLogIn}
              disabled={isButtonDisabled}
            >
              Log In
            </button>
            <p className="text-gray-700 text-sm mt-3 text-center">
              Don{"'"}t have an account?{" "}
              <Link
                to={"/sign-up"}
                className="text-green-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        ) : (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
