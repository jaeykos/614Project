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

// Sample movie data
// const movies = [
//   { id: 1, title: "The Dark Knight", image: "/vite.svg" },
//   { id: 2, title: "Inception", image: "/vite.svg" },
//   { id: 3, title: "Interstellar", image: "/vite.svg" },
//   { id: 4, title: "The Matrix", image: "/vite.svg" },
//   { id: 5, title: "Pulp Fiction", image: "/vite.svg" },
//   { id: 6, title: "Fight Club", image: "/vite.svg" },
// ];

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
  const getMovies = async () => {
    let movies = [];
    if (localStorage.getItem("token")) {
      console.log("token retrieved");
      const publicMovies = await getPublicMovies();
      const nonPublicMovies = await getNonPublicMovies();
      movies = [...nonPublicMovies, ...publicMovies];
    } else {
      console.log("token not retrieved");
      const publicMovies = await getPublicMovies();
      movies = publicMovies;
    }
    return movies;
  };

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      const moviesData = await getMovies();
      setMovies(moviesData);
      console.log("all movies:", moviesData);
    };
    fetchAndSetMovies();
  }, [isLoggedIn]);

  return (
    <>
      <main className="flex flex-col container mx-auto h-full px-4 py-8 space-y-8 items-center justify-start self-center justify-self-center">
        <div className="flex flex-row w-full justify-center ">
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

        <div className="space-y-4 w-8/12  items-center ">
          <h1 className="xl:text-4xl font-bold text-center">
            Now playing & upcoming movies at Theater X
          </h1>

          <Carousel
            className="mx-auto "
            opts={{ align: "start", slidesToScroll: 1, slidesToShow: 3 }}
          >
            <CarouselContent>
              {filteredMovies.map((movie) => (
                <CarouselItem key={movie.movieId} className="md:basis-1/3">
                  <Link to={`/movie/${encodeURIComponent(movie.movieId)}`}>
                    <div className="p-1">
                      <div className="space-y-2">
                        <div className="aspect-[3/4] relative border border-white">
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
