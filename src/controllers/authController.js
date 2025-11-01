import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Helper function for sending error responses
function sendErrorResponse(res, statusCode, message) {
  res.status(statusCode).json({
    success: false,
    message,
  });
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    // Validate required fields
    if (!name || typeof name !== "string") {
      return sendErrorResponse(res, 400, "Name is required");
    }
    if (!email || typeof email !== "string") {
      // amazonq-ignore-next-line
      return sendErrorResponse(res, 400, "Invalid email format");
    }
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    if (!password || typeof password !== "string") {
      return sendErrorResponse(res, 400, "Password is required");
    }
    if (!role || typeof role !== "string") {
      return sendErrorResponse(res, 400, "Role is required");
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: String(email) });
    } catch (dbError) {
      console.error("Database error during user lookup:", dbError);
      return sendErrorResponse(res, 500, "Database error");
    }

    if (existingUser) {
      return sendErrorResponse(res, 400, "User already exists");
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      role,
      phone,
      department,
    });

    try {
      await user.save();
    } catch (saveError) {
      console.error("Database error during user save:", saveError);
      return sendErrorResponse(res, 500, "Failed to create user");
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    sendErrorResponse(res, 500, "Registration failed");
  }
};

export const login = async (req, res) => {
  try {
    // Add validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is empty' });
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate input types to prevent NoSQL injection and runtime errors
    if (typeof email !== "string") {
      return sendErrorResponse(res, 400, "Invalid email format");
    }
    if (typeof password !== "string") {
      return sendErrorResponse(res, 400, "Password is required");
    }

    let user;
    try {
      user = await User.findOne({ email: String(email) });
    } catch (dbError) {
      console.error("Database error during user lookup:", dbError);
      return sendErrorResponse(res, 500, "Database error");
    }
    if (!user) {
      // amazonq-ignore-next-line
      return sendErrorResponse(res, 404, "User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Invalid password");
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    sendErrorResponse(res, 500, "Login failed");
  }
};
