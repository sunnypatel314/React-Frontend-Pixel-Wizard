import { useState, useEffect, useContext } from "react";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../App";
import { jwtDecode } from "jwt-decode";

const CreatePost = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [form, setForm] = useState({ prompt: "", photo: "", username: user });
  const [formToSend, setFormToSend] = useState({
    prompt: "",
    photo: "",
    username: user,
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

  useEffect(() => {
    const checkToken = () => {
      if (localStorage.getItem("token") && !user) {
        const decoded = jwtDecode(localStorage.getItem("token"));
        setUser(decoded.username);
      }
    };
    checkToken();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    setUser("");
    navigate("/log-in");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formToSend);
    if (formToSend.photo) {
      setLoading(true);
      setIsDisabled(true);
      try {
        const response = await fetch(`${API_DOMAIN}/api/v1/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formToSend),
        });
        const responseData = await response.json();
        if (responseData.success) {
          alert("Image uploaded!");
          navigate("/");
        } else {
          alert(responseData.error);
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
        setIsDisabled(false);
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        setIsDisabled(true);
        const response = await fetch(`${API_DOMAIN}/api/v1/dalle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const responseData = await response.json();
        if (responseData.success) {
          setForm({
            ...form,
            photo: `data:image/jpeg;base64,${responseData.photo}`,
          });
          setFormToSend({
            ...form,
            photo: `data:image/jpeg;base64,${responseData.photo}`,
          });
        } else {
          alert(responseData.error);
        }
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
        setIsDisabled(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };

  return (
    <>
      <Navbar logOut={logOut} page={"CreatePost"} />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#20B2AA] min-h-[calc(100vh-73px)]">
        <section className="max-w-7xl mx-auto">
          <div>
            <h1 className="font-extrabold text-[#222328] text-[32px] text-center">
              Create Image
            </h1>
            <p className="mt-2 text-[#222328] text-[18px] text-center w-full">
              {!user ? "Log in to start creating" : "Create"} imaginative and
              visually stunning images generated through DALLE-AI and share them
              with the community.
            </p>
          </div>
          <form
            className="mt-16 w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <FormField
                labelName="Prompt"
                type="text"
                name="prompt"
                placeholder={"Prompt"}
                value={form.prompt}
                handleChange={handleChange}
                isSurpriseMe
                handleSurpriseMe={handleSurpriseMe}
                isDisabled={isDisabled}
              />
              <div
                className="relative bg-gray-50 border border-gray-300
            text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500 w-96 aspect-square p-3 flex justify-center 
              items-center"
              >
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt={form.prompt}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt={"preview"}
                    className="w-9/12 h-9/12 object-contain opacity-60"
                  />
                )}
                {generatingImg && (
                  <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 w-full flex items-center justify-center gap-5">
              <button
                type="button"
                disabled={isDisabled || (!form.prompt && user)}
                onClick={() => {
                  if (user) {
                    generateImage();
                  } else {
                    navigate("/log-in");
                  }
                }}
                className={`text-white ${
                  form.prompt || !user ? "bg-green-600" : "bg-gray-400"
                }  font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                {generatingImg
                  ? "Generating..."
                  : !user
                  ? "Log in to generate images"
                  : "Generate"}
              </button>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center">
              <p className="mt-2 text-[#222328] text-[14px]">
                ** Once you have created the image you want, you can share it
                with others in the community **
              </p>
              <button
                type="submit"
                disabled={isDisabled || !form.photo}
                className={`mt-3 text-white ${
                  form.photo ? "bg-blue-600" : "bg-gray-400"
                } font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                {loading ? "Sharing..." : "Share with the Community"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default CreatePost;
