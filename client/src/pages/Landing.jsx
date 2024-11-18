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

  const { isLoggedIn } = useSharedState();
  const [movies, setMovies] = useState([]);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/public-movies");
        const data = await response.json();
        setMovies(data.movies);

        console.log(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchData();
  }, []);

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
                <CarouselItem key={movie.id} className="md:basis-1/3">
                  <Link
                    to={`/movie/${encodeURIComponent(
                      movie.id
                    )}`}
                  >
                    <div className="p-1">
                      <div className="space-y-2">
                        <div className="aspect-[3/4] relative border border-white">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <h3 className="text-center text-zinc-200">
                          {movie.title}
                        </h3>
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
