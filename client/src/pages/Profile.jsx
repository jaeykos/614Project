import { useState, useEffect, useLayoutEffect } from "react";
import { useSharedState } from "../MyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "@/components/ui/label";


export default function Component() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [cardType, setCardType] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [selectedTicketIdToCancel, setSelectedTicketIdToCancel] = useState(null);
  const [tickets, setTickets] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const [membershipStatus, setMembershipStatus] = useState("NON_PREMIUM");
  const [membershipExpiryDate, setMembershipExpiryDate] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creditOrDebit, setCreditOrDebit] = useState(false);
  const [remainingCancelledCredits, setRemainingCancelledCredits] = useState(
    []
  );

  // useLayoutEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  const navigate = useNavigate();
  const handlePasswordChange = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/user-password", {
      method: "PATCH",
      body: JSON.stringify({ password: newPassword }),
      headers: {
        "Content-Type": "application/json", // Content-Type is in quotes because it has a '-'
        token: localStorage.getItem("token"),
      }, 
    })
      .then((response) => {

        alert("password changed successfully");
      })
      .catch((response) => {
        alert("password change failed");
      });
    setNewPassword("");
  };

  const handlePaymentUpdate = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/payment-method", {
      method: "PATCH",
      body: JSON.stringify({ paymentMethod: cardType, cardNumber: cardNumber  }),
      headers: {
        "Content-Type": "application/json", // Content-Type is in quotes because it has a '-'
        token: localStorage.getItem("token"),
      }, 
    })
      .then((response) => {

        alert("payment method changed successfully");
      })
      .catch((response) => {
        alert("payment method change failed");
      });
  };

  const handleCancelTicket = (ticketId) => {
    setSelectedTicketIdToCancel(ticketId);
    setIsDialogOpen(true);
    const premiumStr = "You will receive a cancellation credit of full amount for future purchase \n up maximum of one-year expiration date"
    const nonpremiumStr = "You will receive a cancellation credit of full amount minus 15% administration fee for future purchase up maximum of one-year expiration date If you become our premium member, there is no 15% administration fee, and you get other benefits too!"
    var dispStr = null
    membershipStatus === "PREMIUM"? dispStr = premiumStr: dispStr = nonpremiumStr;

    if(confirm(dispStr)){
      fetch(`http://localhost:8080/cancel-ticket/${selectedTicketIdToCancel}`, {
        method: "PATCH",
        headers: {
          token: localStorage.getItem("token"),
        }, 
      })
        .then((response) => {
          alert("ticket cancelled successfully");
          window.location.reload();
        })
        .catch((response) => {
          alert("ticket not cancelled");
        });
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (localStorage.getItem("token")) {
        setIsLoggedIn(true);
        console.log("token retrieved");

        await getUserProfile();
        await getTickets();
        await getRemainingCancelledCredits();
      } else {
        setIsLoggedIn(false);
        console.log("token not retrieved");
      }
    };

    fetchAllData();
  }, []);

  const getUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/user", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUserEmail(data.email || "");
      setCardType(data.paymentMethod);
      setCardNumber(data.cardNumber);
      setMembershipStatus(data.membershipStatus);
      setMembershipExpiryDate(data.setMembershipExpiryDate);

      console.log(data);
    } catch (error) {
      setIsLoggedIn(false);
      navigate("/profile");
      console.log(error);
    }
  };

  const getTickets = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/upcoming-reserved-tickets",
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      setTickets(data);
      console.log("right before tickets");
      console.log(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getRemainingCancelledCredits = async () => {
    try {
      const response = await fetch("http://localhost:8080/remaining-credits", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log(`fetched refund data:  ${remainingCancelledCredits}`);

      setRemainingCancelledCredits(data);

      console.log(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-light">Profile</h1>
          <p>Email: {userEmail}</p>

          {/* Password Change Section */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Change Password
            </Button>

            {showPasswordChange && (
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 border border-zinc-500 p-4 rounded"
              >
                <div className="space-y-2">
                  <Label htmlFor="new-password">new password:</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-transparent border-white text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-black"
                >
                  Submit
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Premium Membership Section */}
        <div className="space-y-4">
          <div className="flex flex-col items-start justify-between">
            <div className="flex flex-col">
              <p>
                Membership Status:{" "}
                {membershipStatus === "PREMIUM" ? (
                  <>Premium</>
                ) : (
                  <>Not Premium</>
                )}
              </p>

              {membershipStatus === "PREMIUM" ? (
                <></>
              ) : (
                <div className="border border-white text-md p-4 rounded mt-2">
                  <p className="mb-2">
                    Become a premium member to get the premium benefits!
                  </p>
                  <p className="ml-4">
                    - Browse non-public movies before anyone!
                  </p>
                  <p className="ml-4">
                    - Only premium users can book seats for non-public movies
                    before it becomes public.
                  </p>
                  <p className="ml-4">
                    - Zero administration fee for cancelling tickets.
                  </p>

                  <p className="text-sm mt-4">
                    * You only pay one time fee of $25 dollars for one year
                    premium membership. No recurring fees!
                  </p>
                </div>
              )}
            </div>

            {membershipStatus === "PREMIUM" ? (
              <></>
            ) : (
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black mt-4"
              >
                Upgrade to Premium Membership
              </Button>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-4">
          <div className="flex flex-col  items-start gap-3 justify-between">
            <div className="flex flex-row items-end">
              <p className="text-lg">
                Payment Method: {cardType.toLowerCase()} card ending with{" "}
                {cardNumber.slice(-3)}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPaymentUpdate(!showPaymentUpdate)}
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Update Payment Information
            </Button>
          </div>

          {showPaymentUpdate && (
            <form
              onSubmit={handlePaymentUpdate}
              className="space-y-4 border border-zinc-500 p-4 rounded"
            >
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={cardType}
                  onValueChange={setCardType}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="CREDIT"
                      id="CREDIT"
                      className="border-white text-white"
                    />
                    <Label htmlFor="CREDIT">Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="DEBIT"
                      id="DEBIT"
                      className="border-white text-white"
                    />
                    <Label htmlFor="DEBIT">Debit</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="bg-transparent border-white text-white"
                />
              </div>

              <Button
                type="submit"
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black"
              >
                Submit
              </Button>
            </form>
          )}
        </div>

        {/* Reserved Tickets Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-light">
            Reserved Tickets for Upcoming Movies
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="p-2 text-center">Ticket Number</th>
                  <th className="p-2 text-center">Movie</th>
                  <th className="p-2 text-center">Screen</th>
                  <th className="p-2 text-center">Seat</th>
                  <th className="p-2 text-center">Play Time</th>
                  <th className="p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.ticketId}>
                    <td className="p-2 text-center">{ticket.ticketId}</td>
                    <td className="p-2 text-center">{ticket.movieName}</td>
                    <td className="p-2 text-center">
                      Screen {ticket.screenNumber}
                    </td>
                    <td className="p-2 text-center"> {ticket.seatNumber}</td>
                    <td className="p-2 text-center">
                      {new Date(ticket.startTime)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        })
                        .replace(",", "")}
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={() => handleCancelTicket(ticket.ticketId)}
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-black"
                      >
                        Cancel Ticket
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cancelled Credit Section */}
        <div className="space-y-4 pb-10">
          <h2 className="text-xl font-light">Remaining Cancelled Credit</h2>
          <div className="max-w-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white">
                  <th className="p-2 text-left">Expiry Date</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {remainingCancelledCredits.map((credit, index) => (
                  <tr key={index} className="border-b border-white/20">
                    <td className="p-2">
                      {new Date(credit.expiryDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        timeZone: "UTC",
                      })}
                    </td>
                    <td className="p-2 text-right">
                      ${credit.refundAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="p-2">Total</td>
                  <td className="p-2 text-right">
                    $
                    {remainingCancelledCredits
                      .reduce((sum, credit) => sum + credit.refundAmount, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
