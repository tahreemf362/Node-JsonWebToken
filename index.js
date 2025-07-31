const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Public route
app.get("/api", (req, res) => {
    res.json({
        message: "Hey there! Welcome to this API service",
    });
});

// Protected route (requires valid token)
app.post("/api/posts", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403); // Invalid token
        } else {
            res.json({
                message: "Post created...",
                authData // This will include decoded token info
            });
        }
    });
});

// Login route to generate JWT token
app.post("/api/login", (req, res) => {
    const user = {
        id: 1,
        username: "tfatima362",
        email: "tahreem@gmail.com"
    };

    // Create JWT Token
    jwt.sign({ user }, "secretkey", { expiresIn: "1h" }, (err, token) => {
        if (err) {
            return res.status(500).json({ error: "Token generation failed" });
        }
        res.json({ token });
    });
});

// Verify Token Middleware
function verifyToken(req, res, next) {
    // Get token from headers (Authorization: Bearer <token>)
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        // Split "Bearer token" → ["Bearer", "token"]
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next(); // Move to next middleware/route
    } else {
        res.sendStatus(403); // Forbidden if no token
    }
}

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
