const Attempt = require("../models/attemptModel");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

// Helper: get distinct dates as YYYY-MM-DD strings from attempts
const getDistinctDates = async (userId) => {
    const attempts = await Attempt.find({ userId })
        .select("createdAt")
        .sort({ createdAt: -1 })
        .lean();

    // Extract distinct YYYY-MM-DD dates
    const dateSet = new Set();
    for (const a of attempts) {
        const d = new Date(a.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        dateSet.add(key);
    }

    // Convert to array and sort ascending (oldest first)
    return Array.from(dateSet).sort();
};

// Helper: count consecutive days from the end of a sorted date array going backwards
const countConsecutiveBackward = (dates) => {
    if (dates.length === 0) return 0;

    let streak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
};

// GET /api/streak — tra ve current streak va longest streak
const getStreak = asyncHandler(async (req, res) => {
    const dates = await getDistinctDates(req.user._id);

    if (dates.length === 0) {
        return successResponse(res, {
            currentStreak: 0,
            longestStreak: 0,
            totalDays: 0,
            todayDone: false,
        }, "Streak fetched");
    }

    // Check if today is already counted
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const todayDone = dates[dates.length - 1] === todayKey;

    // Current streak: count consecutive days going backwards
    // If the latest date is not today or yesterday, current streak is 0
    const latestDate = new Date(dates[dates.length - 1]);
    const diffFromToday = Math.round((today - latestDate) / (1000 * 60 * 60 * 24));

    let currentStreak = 0;
    if (diffFromToday <= 1) {
        // The latest attempt is today or yesterday — count backwards
        currentStreak = countConsecutiveBackward(dates);
    }

    // Longest streak: find max consecutive run across all dates
    let longestStreak = 0;
    let run = 1;
    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            run++;
        } else {
            longestStreak = Math.max(longestStreak, run);
            run = 1;
        }
    }
    longestStreak = Math.max(longestStreak, run);

    return successResponse(res, {
        currentStreak,
        longestStreak,
        totalDays: dates.length,
        todayDone,
    }, "Streak fetched");
});

module.exports = { getStreak };
