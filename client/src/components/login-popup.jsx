import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSharedState } from "../MyContext";

export default function LoginPopup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const {membershipStatus, setMembershipStatus} = useSharedState();


  const getUserInfo = async() =>{
    // if (localStorage.getItem("token")) {
      console.log("calling fetch user info")
      await fetch("http://localhost:8080/user", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("setting membership")
          setMembershipStatus(data.membershipStatus)
        })
        .catch((error) => {
          setError("Error fetching data");
          setIsLoggedIn(false);
          console.log(error);
        });
    // }
    return {membershipStatus:"NON_PREMIUM"}
  }


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
    fetch("http://localhost:8080/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      }, // Content-Type is in quotes because it has a '-'
    })
      .then((response) => {
        responseStatus = response.status;
        console.log(response);
        return response.text();
      })
      .then((responsePayload) => {
        console.log("if resonse is 200");
        if (responseStatus === 200) {
          console.log("login response is 200");
          console.log(responsePayload);
          localStorage.setItem("token", responsePayload);

          getUserInfo();
          setIsLoggedIn(true);
          setIsOpen(false);
        } else {
          setIsLoggedIn(false);
          alert("Log in not successful");
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
              <AlertDescription>{error} Log in not successful</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-zinc-300 hover:bg-zinc-500"
          >
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
  );
}
