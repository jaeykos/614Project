import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const { scheduleId } = useParams();
  const [seats, setSeats] = useState([]);
  const [applyCredit, setApplyCredit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [areNonPublicSeatsFilled, setAreNonPublicSeatsFilled] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movieName, setMovieName] = useState("");
  const [isMoviePublic, setIsMoviePublic] = useState(false);
  const [price, setPrice] = useState(0);
  const [screenId, setScreenId] = useState();
  const [showtime, setShowtime] = useState("");
  const [totalRefundAmount, setTotalRefundAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const fetchSchedule = async () => {
      try {
        const response = await fetch("/api/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scheduleId }),
        });
        const data = await response.json();
        console.log("schedule");
        console.log(data);
        setSeats(data.seats);
        setMovieName(data.movieName);
        setPrice(data.price);
        setIsMoviePublic(data.isMoviePublic);
        setAreNonPublicSeatsFilled(data.areNonPublicSeatsFilled);
        setScreenId(data.screenId);
        setShowtime(data.showtime);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    const getRemainingCancelledCredits = async () => {
      try {
        const response = await fetch("/api/remaining-cancelled-credits", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setTotalRefundAmount(
          data.remainingCancelledCredits.reduce(
            (sum, credit) => sum + credit.refundAmount,
            0
          )
        );

        console.log("Total Refund Amount:", totalRefundAmount);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchSchedule();
    getRemainingCancelledCredits();
  }, [scheduleId]);

  const handleSeatToggle = (row, seatIndex) => {
    const seatId = `${row}-${seatIndex}`;
    setSelectedSeats((prev) => (prev.includes(seatId) ? [] : [seatId]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const makeReservation = async () => {
      try {
        const seatNumber =
          selectedSeats[0].split("-")[0] * selectedSeats[0].split("-")[1];
        console.log(seatNumber);
        const response = await fetch("/api/reserve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scheduleId, seatNumber }),
        });
        const data = await response.json();
        console.log("booking confirmation");
        console.log(data);

        setIsLoading(false);
        navigate("/profile");

        alert(
          "Seats reserved successfully! We sent you a confirmation email for this purchase. Redirecting to your profile page where you can view reserved tickets."
        );
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };
    makeReservation();
    // console.log(selectedSeats);

    // const mockReserve = (seat) => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve({ success: true, seat });
    //     }, 500);
    //   });
    // };

    // Simulate reserving seats
    // Promise.all(
    //   selectedSeats.map((seat) => {
    //     const [row, seatIndex] = seat.split("-");
    //     return mockReserve({
    //       row: parseInt(row),
    //       seatIndex: parseInt(seatIndex),
    //     });
    //   })
    // )
    //   .then((results) => {
    //     console.log("Reservation results:", results);
    //     // Handle successful reservations
    //     alert("Seats reserved successfully!");
    //     setSelectedSeats([]); // Clear selected seats
    //   })
    //   .catch((error) => console.error("Error reserving seats:", error));
  };

  if (!isPublic && !areNonPublicSeatsFilled) {
    return (
      <div className="text-white">
        This movie is not available for public booking at this time.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Movie and Screen Info */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-light mb-2">{movieName}</h1>
        <p className="text-lg font-light">
          Screen {screenId} at {showtime}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Seat Selection */}
        <div className="space-y-6 flex flex-col align-middle items-center">
          <h2 className="text-xl font-light mb-4">Select Seat</h2>
          <div className="relative">
            {/* Screen */}
            <div className="w-full h-2 bg-white mb-8 rounded opacity-50">
              <div className="text-center text-sm pt-2 mb-2">Screen</div>
            </div>

            {/* Seats */}
            {isLoading ? (
              <div className="text-center">Loading seats...</div>
            ) : (
              seats.length > 0 && (
                <div className="space-y-2">
                  {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-4">
                      <div className="w-8 text-center">{rowIndex + 1}</div>
                      <div className="flex gap-2">
                        {row.map((isOccupied, seatIndex) => (
                          <button
                            key={seatIndex}
                            onClick={() =>
                              !isOccupied &&
                              handleSeatToggle(rowIndex + 1, seatIndex + 1)
                            }
                            disabled={isOccupied}
                            className={`w-8 h-8 border rounded-sm flex items-center justify-center transition-colors ${
                              isOccupied
                                ? "bg-gray-500 cursor-not-allowed"
                                : selectedSeats.includes(
                                    `${rowIndex + 1}-${seatIndex + 1}`
                                  )
                                ? "bg-white text-black"
                                : "border-white hover:bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-8" />
                    <div className="flex gap-2">
                      {seats[0].map((_, index) => (
                        <div key={index} className="w-8 text-center text-sm">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
            {!isLoading && seats.length === 0 && (
              <div className="text-center">No seats available</div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-8">
          <h2 className="text-xl font-light mb-4">Payment Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm">
                You have ${totalRefundAmount} of remaining cancelled credit
                available, which is automatically applied to this purchase.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ticket Price</span>
                <span>${price}</span>
              </div>

              <div className="flex justify-between">
                <span>Available Cancellation Credits</span>
                <span>${totalRefundAmount}</span>
              </div>

              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>
                  $
                  {price - totalRefundAmount > 0
                    ? price - totalRefundAmount
                    : 0}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-light">Payment Method</h3>
              <p className="text-sm">Credit Card ending with 5234</p>
            </div>

            <Button
              type="submit"
              disabled={selectedSeats.length === 0}
              className="w-full bg-transparent border border-white hover:bg-white text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
