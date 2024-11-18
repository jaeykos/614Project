import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

export default CancelTicketDialog