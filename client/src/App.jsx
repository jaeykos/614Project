import "./App.css";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useSharedState } from "./MyContext";
import { useEffect, useMemo, useLayoutEffect } from "react";
import MovieDetails from "./pages/MovieShowTime";
import Profile from "./pages/Profile";
import SeatSelection from "./pages/SeatSelection";

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/log-in" element={<Landing />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/movie/:movie" element={<MovieDetails />} />
          <Route path="/movie/:movie/:screenId/:date/:time" element={<SeatSelection />} />
        </Routes>

        
      </div>
    </div>
  );
}

export default App;