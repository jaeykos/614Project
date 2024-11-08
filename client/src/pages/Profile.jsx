import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data
const mockUserData = {
  email: "user@example.com",
  membership: "non-premium",
  paymentMethod: {
    type: "Credit",
    number: "xxxx xxxx xxxx 5234"
  },
  reservedTickets: [
    { id: "XX23XX", movie: "Title A", screen: "1", seat: "A1", playTime: "08/12/2023" },
    { id: "XX390X", movie: "Title B", screen: "1", seat: "A1", playTime: "09/12/2023" }
  ],
  cancelledCredits: [
    { amount: 7.00, expiryDate: "01/01/2024" },
    { amount: 8.00, expiryDate: "02/01/2024" }
  ]
}

function CancelTicketDialog({ 
  isOpen, 
  onClose, 
  isPremium, 
  onConfirm 
}) {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setShowSuccess(true)
  }

  const handleClose = () => {
    setShowSuccess(false)
    onClose()
  }

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog open={isOpen && !showSuccess} onOpenChange={handleClose}>
        <DialogContent className="bg-black border border-white text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light">Cancel Ticket</DialogTitle>
            <DialogDescription className="text-white/90 space-y-4">
              {isPremium ? (
                <p>
                  You will receive a cancellation credit of full amount for future purchase 
                  up maximum of one-year expiration date
                </p>
              ) : (
                <>
                  <p>
                    You will receive a cancellation credit of full amount minus 15% administration fee
                    for future purchase up maximum of one-year expiration date
                  </p>
                  <p>
                    If you become our premium member, there is no 15% administration fee, 
                    and you get other benefits too!
                  </p>
                </>
              )}
              <p>Are you sure you want to cancel your ticket?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleConfirm}
              className="flex-1 bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              Yes
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={handleClose}>
        <DialogContent className="bg-black border border-white text-white sm:max-w-md">
          <DialogDescription className="text-white pt-4">
            You have successfully cancelled your reservation. See your profile for your
            remaining cancelled credits.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Component() {
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [cardType, setCardType] = useState("credit")
  const [cardNumber, setCardNumber] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)

  const handlePasswordChange = (e) => {
    e.preventDefault()
    console.log("Changing password to:", newPassword)
    setShowPasswordChange(false)
    setNewPassword("")
  }

  const handlePaymentUpdate = (e) => {
    e.preventDefault()
    console.log("Updating payment method:", { cardType, cardNumber })
    setShowPaymentUpdate(false)
    setCardNumber("")
  }

  const handleCancelTicket = (ticketId) => {
    setSelectedTicket(ticketId)
  }

  const handleConfirmCancelTicket = () => {
    console.log("Cancelling ticket:", selectedTicket)
    // Here you would typically call an API to cancel the ticket
    // For now, we'll just remove it from the mock data
    mockUserData.reservedTickets = mockUserData.reservedTickets.filter(
      ticket => ticket.id !== selectedTicket
    )
    setSelectedTicket(null)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-light">Profile</h1>
          <p>Email: {mockUserData.email}</p>
          
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
              <form onSubmit={handlePasswordChange} className="space-y-4 border border-blue-500 p-4 rounded">
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
          <div className="border border-white p-4 rounded">
            <p>Get exclusive access to premium screenings and early ticket bookings with our premium membership!</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p>Membership Status: {mockUserData.membership}</p>
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Upgrade to Premium Membership
            </Button>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Payment Method</p>
              <p className="text-sm">{mockUserData.paymentMethod.type}: {mockUserData.paymentMethod.number}</p>
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
            <form onSubmit={handlePaymentUpdate} className="space-y-4 border border-blue-500 p-4 rounded">
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <RadioGroup value={cardType} onValueChange={setCardType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" className="border-white text-white" />
                    <Label htmlFor="credit">Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit" id="debit" className="border-white text-white" />
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
          <h2 className="text-xl font-light">Reserved Tickets for Upcoming Movies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Ticket Number</th>
                  <th className="p-2">Movie</th>
                  <th className="p-2">Screen</th>
                  <th className="p-2">Seat</th>
                  <th className="p-2">Play Time</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {mockUserData.reservedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="p-2">{ticket.id}</td>
                    <td className="p-2">{ticket.movie}</td>
                    <td className="p-2">{ticket.screen}</td>
                    <td className="p-2">{ticket.seat}</td>
                    <td className="p-2">{ticket.playTime}</td>
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
        <div className="space-y-4">
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
                {mockUserData.cancelledCredits.map((credit, index) => (
                  <tr key={index} className="border-b border-white/20">
                    <td className="p-2">{credit.expiryDate}</td>
                    <td className="p-2 text-right">${credit.amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="p-2">Total:</td>
                  <td className="p-2 text-right">
                    ${mockUserData.cancelledCredits.reduce((sum, credit) => sum + credit.amount, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel Ticket Dialog */}
      <CancelTicketDialog
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        isPremium={mockUserData.membership === 'premium'}
        onConfirm={handleConfirmCancelTicket}
      />
    </div>
  )
}