import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export const UserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/log-in" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
