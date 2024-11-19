import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useSharedState } from "../MyContext";

export default function LoginPopup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const { isUserPremium, setIsUserPremium } = useSharedState();


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Here you would typically call your authentication function
    console.log("Login attempt with:", { email, password });

    var responseStatus;
    fetch("api/login", {
      method: "post",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      }, // Content-Type is in quotes because it has a '-'
    })
      .then((response) => {
        responseStatus = response.status;
        return response.json();
      })
      .then((responsePayload) => {
        if (responseStatus === 200) {
          // Store the token in a cookie/local storage
          localStorage.setItem("token", responsePayload.token);
          setIsLoggedIn(true);
          setIsOpen(false)
        } else {
          alert(responsePayload);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6  rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full bg-zinc-300 hover:bg-zinc-500">
            Log In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" className="text-sm">
            Don't have an account? Sign up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}