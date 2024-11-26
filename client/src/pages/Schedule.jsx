import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const { scheduleId } = useParams();
  const [seatAvailabilities, setSeatAvailabilities] = useState([]);
  const [applyCredit, setApplyCredit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [areNonPublicSeatsFilled, setAreNonPublicSeatsFilled] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [movieName, setMovieName] = useState("");
  const [isMoviePublic, setIsMoviePublic] = useState(false);
  const [price, setPrice] = useState(0);
  const [screenId, setScreenId] = useState();
  const [showtime, setShowtime] = useState("");
  const [totalRefundAmount, setTotalRefundAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const fetchSchedule = async () => {
      try {
        const response = await fetch(`http://localhost:8080/schedule/${scheduleId}`);
        const data = await response.json();
        console.log("schedule");
        console.log(data);
        setSeatAvailabilities(data.seats);
        setMovieName(data.movieName);
        setPrice(data.price);
        setIsMoviePublic(data.isMoviePublic);
        setAreNonPublicSeatsFilled(data.areNonPublicSeatsFilled);
        setScreenId(data.screenId);
        setShowtime(data.startTime);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    const getTotalRemainingCancelledCredits = async () => {
      try {
        const response = await fetch("http://localhost:8080/remaining-credits", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setTotalRefundAmount(
          data.reduce(
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
    getTotalRemainingCancelledCredits();
  }, [scheduleId]);

  const handleSeatToggle = (row, seatIndex) => {
    const seatId = `${row*10}-${seatIndex+1}`;
    setSelectedSeats((prev) => (prev.includes(seatId) ? [] : [seatId]));
    setSelectedSeatId(row*10 + seatIndex+1)
  };

  const handleReserve = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state to true when submitting
    
     
    const makeReservation = async () => {
      try {
        console.log("selectedSeatId")
        console.log(selectedSeatId)
          const response = await fetch("http://localhost:8080/ticket", {
          method: "POST",
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scheduleId:scheduleId, seatNumber: selectedSeatId }),
        });
        if (response.status < 300){
          console.log(response.status)
          
          alert(
            "Seats reserved successfully! We sent you a confirmation email for this purchase.\nRedirecting to your profile page where you can view reserved tickets."
          );
          navigate("/profile");
        }else{
          console.log(response.status)
          alert(
            (await response.json()).message
          );
        }
      } catch (error) {

        console.error("Error fetching showtimes:", error);
      } finally {
        setIsSubmitting(false); // Set loading state back to false after the request
      }
    };
    makeReservation();
  };

  if (!isPublic && !areNonPublicSeatsFilled) {
    return (
      <div className="text-white">
        This movie is not available for public booking at this time.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 z-0">
      {/* Movie and Screen Info */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-light mb-2">{movieName}</h1>
        <p className="text-lg font-light">
          Screen {screenId} at {new Date(showtime).toLocaleString('default', { month: 'short' }) + ' ' 
+ new Date(showtime).getDate() + ', ' + new Date(showtime).getFullYear() + ' - '
 + new Date(showtime).getHours().toString().padStart(2, '0') + ':' 
 + new Date(showtime).getMinutes().toString().padStart(2, '0')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Seat Selection */}
        <div className="space-y-6 flex flex-col align-middle items-center">
          <h2 className="text-xl font-light mb-4">Select Seat</h2>
          <div className="relative">
            {/* Screen */}
            <div className="w-full h-2 bg-white mb-8 rounded opacity-50"></div>

            {/* Seats */}
            {isLoading ? (
              <div className="text-center">Loading seats...</div>
            ) : (
              seatAvailabilities.length > 0 && (
                <div className="space-y-2">
                  {seatAvailabilities.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {row.map((isAvailable, seatIndex) => (
                          <button
                            key={seatIndex}
                            onClick={() =>
                              isAvailable &&
                              handleSeatToggle(rowIndex, seatIndex)
                            }
                            disabled={!isAvailable}
                            className={`w-10 h-10 border rounded-sm flex items-center justify-center transition-colors ${
                              !isAvailable
                                ? "bg-gray-500 cursor-not-allowed"
                                : selectedSeats.includes(
                                    `${rowIndex *10}-${seatIndex + 1}`
                                  )
                                ? "bg-white text-black"
                                : "border-white hover:bg-white/10"
                            }`}
                          >
                            {`${rowIndex * 10 + seatIndex + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            {!isLoading && seatAvailabilities.length === 0 && (
              <div className="text-center">No seats available</div>
            )}
          </div>
        </div>
        {localStorage.getItem("token")?
        <div className="space-y-8">
          <h2 className="text-xl font-light mb-4">Payment Information</h2>
          <form onSubmit={handleReserve} className="space-y-6">
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
              disabled={selectedSeats.length === 0 || isSubmitting} // Disable button if no seats are selected or while submitting
              className="w-full bg-transparent border border-white hover:bg-white text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Booking..." : "Submit"} {/* Change button text based on loading state */}
            </Button>
          </form>
        </div>:<>You need to log in to make a booking. Please log in or sign in to make a booking.</>}
      </div>
    </div>
  );
}
