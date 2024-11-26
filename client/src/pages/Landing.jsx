import { useSharedState } from "../MyContext";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";


const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {membershipStatus, setMembershipStatus} = useSharedState();
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const [publicMovies, setPublicMovies] = useState([]);
  const [nonPublicMovies, setNonPublicMovies] = useState([]);
  const [movies, setMovies] = useState([]);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const filteredMovies = movies.filter((movie) =>
    movie.movieName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getPublicMovies = async () => {
    try {
      const response = await fetch("http://localhost:8080/public-movies");
      const data = await response.json();
      console.log("public movies:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  const getNonPublicMovies = async () => {
    try {
      const response = await fetch("http://localhost:8080/non-public-movies", {
        headers: { token: localStorage.getItem("token") },
      });
      const data = await response.json();
      console.log("non public movies:", data);
      setNonPublicMovies(data);
      return data;
    } catch (error) {
      console.error("Error fetching non-public movies:", error);
      return [];
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token exists:", token);
      console.log("calling fetch user info");
      try {
        const response = await fetch("http://localhost:8080/user", {
          headers: { token: token },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("setting membership");
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Error fetching data");
        setIsLoggedIn(false);
      }
    } else {
      console.log("No token found in localStorage");
    }
    return { membershipStatus: "NON_PREMIUM" };
  };
  

  const getMovies = async (userData) => {
    
    let movies = [];
    console.log(userData)
    if (userData.membershipStatus === "PREMIUM") {
      console.log("User is premium");
      const publicMovies = await getPublicMovies();
      const nonPublicMovies = await getNonPublicMovies();
      movies = [...nonPublicMovies, ...publicMovies];
    } else {
      console.log("User is not logged in or not  premium");
      const publicMovies = await getPublicMovies();
      movies = publicMovies;
    }
    return movies;
  };

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      const userData = await getUserInfo();
      const moviesData = await getMovies(userData);

      setMovies(moviesData);
      console.log("all movies:", moviesData);
    };

    fetchAndSetMovies();
  }, [isLoggedIn]);

  return (
    <>
      <main className="flex flex-col container mx-auto h-full px-4 py-8 space-y-8 items-center justify-start self-center justify-self-center z-0">
        <div className="flex flex-row w-full justify-center z-0 ">
          <Input
            type="text"
            placeholder="Search for now playing and upcoming movies here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-white text-white placeholder:text-gray-400 w-3/5"
          />
          {/* <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            Search
          </Button> */}
        </div>

        <div className="space-y-4 w-8/12  items-center z-0 ">
          <h1 className="xl:text-4xl font-bold text-center z-0">
            Now playing & upcoming movies at Theater X
          </h1>

          <Carousel
            className="mx-auto z-0 "
            opts={{ align: "start", slidesToScroll: 1, slidesToShow: 3 }}
          >
            <CarouselContent>
              {filteredMovies.map((movie) => (
                <CarouselItem key={movie.movieId} className="md:basis-1/3">
                  <Link to={`/movie/${encodeURIComponent(movie.movieId)}`}>
                    <div className="p-1">
                      <div className="space-y-2">
                        <div className="aspect-[3/4] relative border border-zinc-500">
                          <img
                            src={movie.url}
                            alt={movie.movieName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <h3 className="text-center text-zinc-200">
                          {movie.movieName}
                        </h3>
                        {nonPublicMovies.some(
                          (nonPublicMovie) =>
                            nonPublicMovie.movieId === movie.movieId
                        ) ? (
                          <h3 className="text-center text-zinc-200 italic text-sm">
                            Premium
                          </h3>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <CarouselPrevious className="border-white text-white hover:bg-white hover:text-black" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <CarouselNext className="border-white text-white hover:bg-white hover:text-black" />
            </div>
          </Carousel>
        </div>
      </main>
    </>
  );
};

export default Landing;
