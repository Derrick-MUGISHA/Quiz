const User = require("../models/userMode");

// Controller function
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      totalQuestionsAnswered: user.totalQuestionsAnswered,
      totalScore: user.totalScore,
      totalTimeTaken: user.totalTimeTaken,
      quizHistory: user.quizHistory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getMe };
