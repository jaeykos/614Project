import { useSharedState } from "../MyContext";
import LogIn from "@/components/log-in";
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
const movies = [
  { id: 1, title: "The Dark Knight", image: "/vite.svg" },
  { id: 2, title: "Inception", image: "/vite.svg" },
  { id: 3, title: "Interstellar", image: "/vite.svg" },
  { id: 4, title: "The Matrix", image: "/vite.svg" },
  { id: 5, title: "Pulp Fiction", image: "/vite.svg" },
  { id: 6, title: "Fight Club", image: "/vite.svg" },
];

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { isLoggedIn } = useSharedState();
  const [matchedUsername, setMatchedUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     fetch("http://localhost:3000/user-metadata", {
  //       headers: {
  //         token: localStorage.getItem("token"),
  //       },
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         if (!data.bioComplete) {
  //           navigate("/bio");
  //         }

  //         setMatchedUsername(data.matchedUsername);
  //         console.log(data);
  //       })
  //       .catch((error) => {
  //         setError("Error fetching data");
  //         console.log(error);
  //       });
  //   }
  // }, [isLoggedIn]);

  return (
    <>
      <main className="flex flex-col container mx-auto h-full px-4 py-8 space-y-8 items-center justify-center self-center justify-self-center">
        <div className="flex flex-row w-full items-center justify-center">
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

        <div></div>
        <div className="space-y-4 w-11/12 self-center items-center justify-self-center">
          <h1 className="lg:text-4xl font-bold text-center">
            Now playing & upcoming movies at Theater X
          </h1>

          <Carousel
            className="mx-auto"
            opts={{ align: "start", slidesToScroll: 1, slidesToShow: 3 }}
          >
            <CarouselContent>
              {filteredMovies.map((movie) => (
                <CarouselItem key={movie.id} className="md:basis-1/3">
                  <Link
                    to={`/movie/${encodeURIComponent(
                      movie.title.toLowerCase().replace(/ /g, "-")
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
