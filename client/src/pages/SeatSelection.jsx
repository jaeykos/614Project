// import { useParams } from "react-router-dom";
// const { movie, screenId, date, time } = useParams();
// const movieName = movie ? decodeURIComponent(movie).replace(/-/g, ' ') : "Unknown Movie";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useParams } from "react-router-dom";

// Mock data types:
// movie: string - The title of the movie
// screenId: string - The identifier for the screen (e.g., "A", "B", "C")
// date: string - The date of the showing in "YYYY-MM-DD" format
// time: string - The time of the showing in "HH:MM AM/PM" format
const mockMovieData = {
  movie: "Inception",
  screenId: "A",
  date: "2023-12-08",
  time: "10:00 AM"
}

export default function Component() {
//   const { movie, screenId, date, time } = mockMovieData
//   const movieName = movie.replace(/-/g, ' ')
  
const { movie, screenId, date, time } = useParams();
const movieName = movie ? decodeURIComponent(movie).replace(/-/g, ' ') : "Unknown Movie";

  const [seats, setSeats] = useState([])
  const [applyCredit, setApplyCredit] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [isNonPublicSeatsFilled, setIsNonPublicSeatsFilled] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const token = "mock-token" // Mock token

    setIsLoading(true)

    // Mock fetch for is-movie-public
    // Returns: Promise<boolean> - true if the movie is public, false otherwise
    const mockFetchIsMoviePublic = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true) // Mock response: movie is public
        }, 500)
      })
    }

    // Mock fetch for is-non-public-seats-filled
    // Returns: Promise<boolean> - true if non-public seats are filled, false otherwise
    const mockFetchIsNonPublicSeatsFilled = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(false) // Mock response: non-public seats are not filled
        }, 500)
      })
    }

    // Mock fetch for seats
    // Returns: Promise<boolean[][]> - 2D array representing seat availability
    // true means the seat is occupied, false means it's available
    const mockFetchSeats = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Generate a 10x8 grid of seats with some randomly occupied
          const mockSeats = Array(10).fill().map(() => 
            Array(8).fill().map(() => Math.random() > 0.8)
          )
          resolve(mockSeats)
        }, 500)
      })
    }

    // Simulating API calls with mock data
    mockFetchIsMoviePublic()
      .then(data => setIsPublic(data))
      .catch(error => console.error('Error fetching is-movie-public:', error))

    mockFetchIsNonPublicSeatsFilled()
      .then(data => setIsNonPublicSeatsFilled(data))
      .catch(error => console.error('Error fetching is-non-public-seats-filled:', error))

    mockFetchSeats()
      .then(data => setSeats(data))
      .catch(error => console.error('Error fetching seats:', error))
      .finally(() => {
        setIsLoading(false)
      })

  }, [movie, screenId, date, time])

  const handleSeatToggle = (row, seatIndex) => {
    const seatId = `${row}-${seatIndex}`
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mock reservation process
    // Input: { row: number, seatIndex: number } - The seat to be reserved
    // Returns: Promise<{ success: boolean, seat: { row: number, seatIndex: number } }>
    const mockReserve = (seat) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, seat })
        }, 500)
      })
    }

    // Simulate reserving seats
    Promise.all(selectedSeats.map(seat => {
      const [row, seatIndex] = seat.split('-')
      return mockReserve({ row: parseInt(row), seatIndex: parseInt(seatIndex) })
    }))
    .then(results => {
      console.log('Reservation results:', results)
      // Handle successful reservations
      alert('Seats reserved successfully!')
      setSelectedSeats([]) // Clear selected seats
    })
    .catch(error => console.error('Error reserving seats:', error))
  }

  if (!isPublic && !isNonPublicSeatsFilled) {
    return <div className="text-white">This movie is not available for public booking at this time.</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Route Display */}
      <div className="text-xl mb-8 font-light">
        /{movieName}/{screenId}/{time}
      </div>

      {/* Movie and Screen Info */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-light mb-2">{movieName}</h1>
        <p className="text-lg font-light">Screen {screenId} at {time}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Seat Selection */}
        <div className="space-y-6">
          <h2 className="text-xl font-light mb-4">Select Seat</h2>
          <div className="relative">
            {/* Screen */}
            <div className="w-full h-2 bg-white mb-8 rounded opacity-50">
              <div className="text-center text-sm mt-2">Screen</div>
            </div>

            {/* Seats */}
            {isLoading ? (
              <div className="text-center">Loading seats...</div>
            ) : seats.length > 0 && (
              <div className="space-y-2">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-4">
                    <div className="w-8 text-center">{rowIndex + 1}</div>
                    <div className="flex gap-2">
                      {row.map((isOccupied, seatIndex) => (
                        <button
                          key={seatIndex}
                          onClick={() => !isOccupied && handleSeatToggle(rowIndex + 1, seatIndex + 1)}
                          disabled={isOccupied}
                          className={`w-8 h-8 border rounded-sm flex items-center justify-center transition-colors ${
                            isOccupied 
                              ? 'bg-gray-500 cursor-not-allowed' 
                              : selectedSeats.includes(`${rowIndex + 1}-${seatIndex + 1}`)
                                ? 'bg-white text-black'
                                : 'border-white hover:bg-white/10'
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
            )}
            { !isLoading && seats.length === 0 && (
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
                You have $30.00 of remaining cancelled credit, would you like to apply the credit to this purchase?
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-credit"
                  checked={applyCredit}
                  onCheckedChange={setApplyCredit}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <label
                  htmlFor="apply-credit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apply credit?
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${selectedSeats.length * 11}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-light">Payment Method</h3>
              <p className="text-sm">Credit Card ending with 5234</p>
            </div>

            <Button 
              type="submit"
              disabled={selectedSeats.length === 0}
              className="w-full bg-transparent border border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}