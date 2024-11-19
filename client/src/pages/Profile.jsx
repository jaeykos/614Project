import { useState, useEffect } from "react";
import { useSharedState } from "../MyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import CancelTicketDialog from "@/components/cancel-ticket-dialogue";

export default function Component() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [cardType, setCardType] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const { membershipStatus, setMembershipStatus } =
    useSharedState("NON_PREMIUM");
  const [userEmail, setUserEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creditOrDebit, setCreditOrDebit] = useState(false);
  const [remainingCancelledCredits, setRemainingCancelledCredits] = useState(
    []
  );
  const [currentCardNumber, setCurrentCardNumber] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Changing password to:", newPassword);
    setShowPasswordChange(false);
    setNewPassword("");
  };

  const handlePaymentUpdate = (e) => {
    e.preventDefault();
    console.log("Updating payment method:", { cardType, cardNumber });
    setShowPaymentUpdate(false);
    setCardNumber("");
  };

  const handleCancelTicket = (ticketId) => {
    setSelectedTicket(ticketId);
    setIsDialogOpen(true);
  };

  const handleConfirmCancelTicket = () => {
    //Implementation to handle ticket cancellation
    console.log("Cancelling ticket:", selectedTicket);
  };

  useEffect(() => {
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
        setMembershipStatus(data.premiumStatus);

        console.log(data);
      } catch (error) {
        setIsLoggedIn(false);
        console.log(error);
      }
    };

    const getPaymentMethod = async () => {
      try {
        const response = await fetch("/api/payment-method", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCreditOrDebit(data.creditOrDebit || "");
        setCardNumber(data.cardNumber);

        console.log(data);
      } catch (error) {
        setError("Error fetching data");
        setIsLoggedIn(false);
        console.log(error);
      }
    };

    const getTickets = async () => {
      try {
        const response = await fetch("/api/upcoming-reserved-tickets", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setTickets(data.tickets);

        console.log(tickets);
      } catch (error) {
        console.error("Error fetching movies:", error);
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
        setRemainingCancelledCredits(data.remainingCancelledCredits);

        console.log(tickets);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    if (isLoggedIn) {
      getUserProfile();
      getTickets();
      getPaymentMethod();
      getRemainingCancelledCredits();
    }
  }, [isLoggedIn]);

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
          {membershipStatus === "PREIMUM" ? (
            <></>
          ) : (
            <div className="border border-white p-4 rounded">
              <p>
                Get exclusive access to premium screenings and early ticket
                bookings with our premium membership!
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p>
              Membership Status:{" "}
              {membershipStatus === "PREIMUM" ? <>Premium</> : <>Not Premium</>}
            </p>

            {membershipStatus === "PREIMUM" ? (
              <></>
            ) : (
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Upgrade to Premium Membership
              </Button>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-4">
          <div className="flex flex-col items-start gap-3 justify-between">
            <div>
              <p className="text-lg">Payment Method</p>
              <p className="text-md">
                {cardType} card ending with {cardNumber.slice(-3)}
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
                      value="credit"
                      id="credit"
                      className="border-white text-white"
                    />
                    <Label htmlFor="credit">Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="debit"
                      id="debit"
                      className="border-white text-white"
                    />
                    <Label htmlFor="debit">Debit</Label>
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
                  <tr key={ticket.id}>
                    <td className="p-2 text-center">{ticket.ticketNumber}</td>
                    <td className="p-2 text-center">{ticket.moveTitle}</td>
                    <td className="p-2 text-center">{ticket.screen}</td>
                    <td className="p-2 text-center">{ticket.seat}</td>
                    <td className="p-2 text-center">{ticket.playTime}</td>
                    <td className="p-2">
                      <Button
                        onClick={() => handleCancelTicket(ticket.id)}
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
                    <td className="p-2">{credit.expiryDate.split("T")[0]}</td>
                    <td className="p-2 text-right">
                      ${credit.refundAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="p-2">Total:</td>
                  <td className="p-2 text-right">
                    $
                    {remainingCancelledCredits
                      .reduce((sum, credit) => sum + credit.amount, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel Ticket Dialog */}
      <CancelTicketDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTicket(null);
        }}
        isPremium={membershipStatus === "PREIUM"}
        onConfirm={() => {
          handleConfirmCancelTicket();
          setIsDialogOpen(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
}
