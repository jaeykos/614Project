import { Link } from "react-router-dom";
import { useSharedState } from "../MyContext";
import UserIconDropdown from "./UserIconWithDropDown";
import { useEffect, useState } from "react";
import LoginPopup from "./login-popup";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const [membershipStatus, setMembershipStatus] = useState("");
  const [membershipExpiryDate, setMembershipExpiryDate] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:8080/user", {
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
          // console.log("line right before settnig logged in as true")
          setIsLoggedIn(true);
          setUserEmail(data.email || "");
          setMembershipStatus(data.membershipStatus);
          setMembershipExpiryDate(data.membershipExpiryDate);

          // console.log(data);
        })
        .catch((error) => {
          setError("Error fetching data");
          setIsLoggedIn(false);
          console.log(error);
        });
    }
  }, [isLoggedIn, location.pathname]);

  return (
    <nav className="bg-zinc-900  flex flex-row justify-between px-6 py-2 z-30">
      <Link
        className="flex text-2xl xl:text-6xl font-bold  items-center py-5 px-2 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
        to="/"
      >
        AcmePlex
      </Link>

      <div className="RightSideWrapper self-center items-center flex flex-row gap-6 ">
        {isLoggedIn ? (
          <UserIconDropdown
            email={userEmail}
            membershipStatus={membershipStatus}
          />
        ) : (
          <div className="flex flex-row">
            <LoginPopup />
            <Link
              className="flex   items-center  px-2 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
              to="/sign-up"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
