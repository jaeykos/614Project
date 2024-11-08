import "./App.css";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useSharedState } from "./MyContext";
import { useEffect, useMemo, useLayoutEffect } from "react";
import MovieDetails from "./pages/MovieShowTime";

function App() {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  useLayoutEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="AppWrapper  w-full flex flex-col flex-1 ">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="RouteWrapper bg-zinc-950 flex flex-col w-full mr-0 flex-1 ">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/log-in" element={<Landing />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/movie/:movie" element={<MovieDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
