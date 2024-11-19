const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secret";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/public-movies", (req, res) => {
  movies = [
    {
      id: 1,
      title: "The Great Adventure",
      image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    },
    {
      id: 2,
      title: "Mystery in the Woods",
      image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    },
    {
      id: 3,
      title: "Space Odyssey",
      image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    },
    {
      id: 4,
      title: "Romance Under the Stars",
      image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    },
    {
      id: 5,
      title: "The Last Samurai",
      image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    },
  ];

  res.status(200).json({ movies });
});

app.post("/login", (req, res, next) => {
  const loginIsSuccessful = true;
  if (loginIsSuccessful) {
    // Generate the token and send it to the user
    const token = jwt.sign({ email: "harman" }, SECRET_KEY);
    res.json({
      token:
        "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxIn0.dSLlAINneWGMk8FYeL_xxH-IAuFaSgvh7Mjny1v9t-Q",
    });
  }
});

app.get("/user-profile", (req, res, next) => {
  const token = req.headers.token;
  
      res.status(200).json({
        userEmail: "harman@example.com",
        premiumStatus: true,
      });
});

app.get("/payment-method", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      res.status(200).json({
        creditOrDebit: true,
        cardNumber: "5849-7576-5689-4787",
      });
    }
  });
});

app.get("/upcoming-reserved-tickets", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      tickets = [
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150,
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150,
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150,
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150,
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150,
        },
      ];

      res.status(200).json({ tickets });
    }
  });
});

app.get("/remaining-cancelled-credits", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      remainingCancelledCredits = [
        {
          refundAmount: 14.0,
          expiryDate: "2024-11-17T18:23:00.000Z",
        },
        {
          refundAmount: 14.0,
          expiryDate: "2024-11-25T18:23:00.000Z",
        },
        {
          refundAmount: 14.0,
          expiryDate: "2024-11-26T18:23:00.000Z",
        },
        {
          refundAmount: 14.0,
          expiryDate: "2024-11-27T18:23:00.000Z",
        },
      ];

      res.status(200).json({ remainingCancelledCredits });
    }
  });
});

app.get("/showtimes/:movieId", (req, res) => {
  res.status(200).json({
    "November 1, 2024": {
      "Screen 1": [
        { time: "10:00", scheduleId: 1 },
        { time: "14:00", scheduleId: 1 },
      ],
      "Screen 2": [{ time: "17:00", scheduleId: 2 }],
    },
    "November 3, 2024": {
      "Screen 1": [{ time: "17:00", scheduleId: 1 }],
    },
    "November 4, 2024": {
      "Screen 2": [{ time: "17:00", scheduleId: 2 }],
    },
  });
});

app.get("/movie/:id", (req, res) => {
  res.status(200).json({
    movieName: "xxx",
    isMoviePublic: true,
  });
});

app.get("/schedule/:id", (req, res) => {
  const { id } = req.params;
  console.log(id)
  res.status(200).json({
    movieName: "xxx",
    price: 11.0,
    isMoviePublic: true,
    areNonPublicSeatsFilled: false,
    showtime: "2024-10-10 10:00",
    screenId: 2,
    seats: [
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, false],
      [true, false, false, true, true, false, false, true, true, false],
    ],
  });
});

app.post("/reserve", (req, res) => {
  res.status(200).json({});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
