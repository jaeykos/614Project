import { Link } from "react-router-dom";
import { useSharedState } from "../MyContext";
import UserIconDropdown from "./UserIconWithDropDown";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const [username, setUsername] = useState("");
  const [matchedUsername, setMatchedUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:3000/user-metadata", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setIsLoggedIn(true);
          setUsername(data.username || "");
          setMatchedUsername(data.matchedUsername);
          console.log(data);
        })
        .catch((error) => {
          setError("Error fetching data");
          setIsLoggedIn(false);
          console.log(error);
        });
    }
  }, [isLoggedIn, location.pathname]);

  return (
    <nav className="bg-zinc-900  flex flex-row justify-between px-6 py-2 ">
      <Link
        className="flex text-2xl xl:text-6xl font-bold  items-center py-5 px-2 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
        to="/"
      >
        AcmePlex
      </Link>

      {/* <div className="RightSideWrapper self-center items-center flex flex-row gap-6 ">
        {isLoggedIn ? (
          <UserIconDropdown username={username} />
        ) : (
          <div className="flex flex-row">
            <Link
              className="flex    items-center px-2 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
              to="/log-in"
            >
              Log in
            </Link>
            <Link
              className="flex   items-center  px-2 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
              to="/sign-up"
            >
              Sign up
            </Link>
          </div>
        )}
      </div> */}
    </nav>
  );
}
