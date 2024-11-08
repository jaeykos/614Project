import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import { isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSharedState } from "../MyContext";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("credit");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState("");
  const [isConsentChecked, setIsConsentChecked] = useState("");
  const [invalidPasswordMessages, setInvalidPasswordMessages] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Set dark mode on component mount
  //   document.documentElement.classList.add("dark");
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isPasswordValid) {
      setError();
      alert(
        "Password requirements are not met. Please enter passwords again to meet requirements."
      );
      return;
    }

    if (!isConsentChecked) {
      alert("Please consent to the agreeemnt to sign up.");
      return;
    }

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error);
          return;
        }
        return response.json();
      })
      .then((responsePayload) => {
        localStorage.setItem("token", responsePayload.token);
        setIsLoggedIn(true);
        alert("Sign up success!");
        navigate("/");
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  return (
    <Card className="w-full self-center max-w-md bg-zinc-800 text-zinc-100 my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription className="text-zinc-400">
          Create your account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-100">
              Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-100">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2 pb-4">
            <Label htmlFor="confirmPassword" className="text-zinc-100">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder=""
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
              className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
            />
          </div>

          {password ? (
            <PasswordChecklist
              className="flex flex-col text-sm mb-2 mt-0 space-y-0"
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={5}
              value={password}
              valueAgain={passwordAgain}
              onChange={(isValid, failedRules) => {
                setIsPasswordValid(isValid);
                setInvalidPasswordMessages(failedRules);
              }}
              invalidTextColor="red"
              hideIcon={true}
            />
          ) : (
            <></>
          )}
          <div className=" flex flex-col gap-2 pb-4">
            <Label className="text-white font-bold text-lg ">
              Payment Method
            </Label>
            <div className="space-y-2 ">
              <Label className="text-white font-bold">Card Type</Label>
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
                  <Label htmlFor="credit" className="text-white font-light">
                    Credit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="debit"
                    id="debit"
                    className="border-white text-white"
                  />
                  <Label htmlFor="debit" className="text-white font-light">
                    Debit
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 ">
              <Label htmlFor="cardNumber" className="text-white font-bold">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          to="/"
          className=" text-zinc-400 hover:text-zinc-100 hover:underline text-sm font-bold transition  ease-in-out"
        >
          Already have an account? Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
