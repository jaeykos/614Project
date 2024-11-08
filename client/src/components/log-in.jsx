import LoginForm from "@/components/login-form";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";

export default function LogIn() {
  return (
    <>
      <div className=" flex flex-col flex-1 w-full text-zinc-200 lg:flex-row ">
        <div className="RightSide flex flex-col justify-center items-center w-full mt-4 p-4">
          <LoginForm />

          <Link to="/signup" className="mt-4 text-sm">
            Sign Up Here
          </Link>
        </div>
      </div>
    </>
  );
}
