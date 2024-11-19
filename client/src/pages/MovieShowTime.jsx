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
// const showtimes = {
//   "December 8": {
//     "Screen A": ["10:00 AM", "12:00 PM", "2:00 PM"],
//     "Screen B": ["11:00 AM", "1:00 PM", "3:00 PM"],
//   },
//   "December 9": {
//     "Screen A": ["10:30 AM", "12:30 PM", "2:30 PM"],
//     "Screen B": ["11:30 AM", "1:30 PM", "3:30 PM"],
//   },
// };

export default function MovieShowTime() {
  const { movieId } = useParams();
  const [movieName, setMovieName] = useState("");
  const [isMoviePublic, setIsMoviePublic] = useState("");
  const [showTimes, setShowTimes] = useState(null);
  const [selectedDate, setSelectedDate] = useState("all");
  const [filteredShowtimes, setFilteredShowtimes] = useState({});

  useEffect(() => {
    if (showTimes) {
      setFilteredShowtimes(
        selectedDate === "all"
          ? showTimes
          : { [selectedDate]: showTimes[selectedDate] }
      );
    }
  }, [selectedDate, showTimes]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch("/api/showtimes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId }),
        });
        const data = await response.json();
        console.log("showtimes");
        console.log(data);
        setShowTimes(data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    const getMovie = async () => {
      try {
        const response = await fetch("/api/movie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId }),
        });
        const data = await response.json();
        console.log(data);
        setMovieName(data.movieName);
        setIsMoviePublic(data.isMoviePublic);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    getMovie();
    fetchShowtimes();
  }, [movieId]);

  return (
    <div className="bg-black text-white p-8">
      <div className="grid md:grid-cols-[400px,1fr] gap-8 max-w-6xl mx-auto sticky">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{movieName}</h1>
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
                      {times.map((item) => (
                        <Link
                          to={`/schedule/${item.scheduleId}`}
                          key={item.scheduleId}
                          className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
                        >
                          {item.time}
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
