import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

// Sample showtime data
const showtimes = {
  "December 8": {
    "Screen A": ["10:00 AM", "12:00 PM", "2:00 PM"],
    "Screen B": ["11:00 AM", "1:00 PM", "3:00 PM"],
  },
  "December 9": {
    "Screen A": ["10:30 AM", "12:30 PM", "2:30 PM"],
    "Screen B": ["11:30 AM", "1:30 PM", "3:30 PM"],
  },
};

export default function MovieShowTime() {
  const { movieId } = useParams();
  const {showTimes, setShowTimes} = useState([])
  // const movieName = movie
  //   ? decodeURIComponent(movie).replace(/-/g, " ")
  //   : "Unknown Movie";
  const [selectedDate, setSelectedDate] = useState("all");

  const filteredShowtimes =
    selectedDate === "all"
      ? showtimes
      : { [selectedDate]: showtimes[selectedDate] };


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
    <div className=" bg-black text-white p-8">

      <div className="grid md:grid-cols-[400px,1fr] gap-8 max-w-6xl mx-auto sticky">
        <div className="space-y-4">
          <h1 className="text-2xl  font-bold">{movieName}</h1>
          <div className="aspect-[2/3] h-3/5 relative border border-white hidden md:flex">
            <img
              src="/placeholder.svg"
              alt={`${movieName} Poster`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-light">Date:</span>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-32 bg-transparent border-white text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="December 8">December 8</SelectItem>
                <SelectItem value="December 9">December 9</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {Object.entries(filteredShowtimes).map(([date, screens]) => (
            <div key={date} className="space-y-6">
              <h2 className="text-xl font-light">{date}</h2>
              <div className="space-y-4">
                {Object.entries(screens).map(([screen, times]) => (
                  <div
                    key={screen}
                    className="grid grid-cols-[120px,1fr] gap-4"
                  >
                    <div className="font-light">{screen}</div>
                    <div className="flex flex-wrap gap-4">
                      {times.map((time, index) => (
                        <Link
                        to={`/movie/${encodeURIComponent(movieName)}/${screen.toLowerCase().replace(' ', '-')}/${date}/${encodeURIComponent(time)}`}
                        key={index}
                        className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
                      >
                        {time}
                      </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
