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
    res.json({ token: token });
  }
});

app.get("/user-profile", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      res.status(200).json({
        userEmail: 'harman@example.com',
        premiumStatus: true,
      });
    }
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
        cardNumber: '5849-7576-5689-4787',
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
          playTime: 150  
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150  
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150  
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150  
        },
        {
          ticketNumber: "XRG392",
          moveTitle: "The Great Adventure",
          screen: 1,
          seat: "15",
          playTime: 150  
        },
      ]

      res.status(200).json({tickets});
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
          amount: 14.00,
          expiryDate: "2024-11-17T18:23:00.000Z",
        },
        {
          amount: 14.00,
          expiryDate: "2024-11-25T18:23:00.000Z",
        },
        {
          amount: 14.00,
          expiryDate: "2024-11-26T18:23:00.000Z",
        },
        {
          amount: 14.00,
          expiryDate: "2024-11-27T18:23:00.000Z",
        },
        
      ]

      res.status(200).json({remainingCancelledCredits});
    }
  });
});

app.get("/showtimes", (req, res) => {
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


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
