require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");

const Topic = require("../models/topicModel");

const Section = require("../models/sectionModel");

const User = require("../models/userModel");

const bcrypt = require("bcryptjs");


// TOPICS
const topics = [

    // FREE
    {
        title: "IELTS Listening",
        slug: "ielts-listening",
        levels: ["B1", "B2", "C1"],
        lessonCount: 344,
        mediaType: "audio",
        tags: ["intermediate", "advanced"],
        featured: true,
        isPremium: false,
    },

    {
        title: "Short Stories",
        slug: "short-stories",
        levels: ["A1", "A2", "B1", "C1"],
        lessonCount: 289,
        mediaType: "audio",
        tags: ["beginner", "intermediate", "advanced"],
        isPremium: false,
    },

    {
        title: "Conversations",
        slug: "conversations",
        levels: ["A1", "B1"],
        lessonCount: 100,
        mediaType: "audio",
        tags: ["beginner"],
        isPremium: false,
    },

    {
        title: "Stories for Kids",
        slug: "stories-for-kids",
        levels: ["A2", "B2"],
        lessonCount: 13,
        mediaType: "video",
        tags: ["beginner", "intermediate", "video"],
        isPremium: false,
    },

    {
        title: "TOEIC Listening",
        slug: "toeic-listening",
        levels: ["A2", "C1"],
        lessonCount: 600,
        mediaType: "audio",
        tags: ["beginner", "intermediate", "advanced"],
        isPremium: false,
    },

    {
        title: "TED Talks",
        slug: "ted-talks",
        levels: ["C1", "C2"],
        lessonCount: 90,
        mediaType: "video",
        tags: ["advanced", "video"],
        isPremium: false,
    },



    // PREMIUM
    {
        title: "Business English",
        slug: "business-english",
        levels: ["B1", "C2"],
        lessonCount: 120,
        mediaType: "audio",
        tags: ["intermediate", "advanced"],
        isPremium: true,
    },

    {
        title: "Academic Writing",
        slug: "academic-writing",
        levels: ["B2", "C2"],
        lessonCount: 85,
        mediaType: "audio",
        tags: ["advanced"],
        isPremium: true,
    },

    {
        title: "Pronunciation Coach",
        slug: "pronunciation-coach",
        levels: ["A1", "C2"],
        lessonCount: 210,
        mediaType: "audio",
        tags: [
            "beginner",
            "intermediate",
            "advanced",
        ],
        isPremium: true,
    },

    {
        title: "Grammar in Use",
        slug: "grammar-in-use",
        levels: ["A2", "C1"],
        lessonCount: 320,
        mediaType: "audio",
        tags: [
            "beginner",
            "intermediate",
            "advanced",
        ],
        isPremium: true,
    },
];


// CREATE DEMO SECTIONS
const createSectionsForTopic = (topicId, mediaType) => {

    return [
        {
            topicId,
            title: "Section 1",
            order: 1,
            mediaType,

            audioUrl:
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

            transcript:
                "English is a global language.",

            correctAnswer:
                "English is a global language.",

            instruction:
                "Listen carefully and type what you hear.",
        },

        {
            topicId,
            title: "Section 2",
            order: 2,
            mediaType,

            audioUrl:
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

            transcript:
                "Practice makes perfect.",

            correctAnswer:
                "Practice makes perfect.",

            instruction:
                "Type the sentence correctly.",
        },

        {
            topicId,
            title: "Section 3",
            order: 3,
            mediaType,

            audioUrl:
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

            transcript:
                "Never stop learning.",

            correctAnswer:
                "Never stop learning.",

            instruction:
                "Listen and complete the dictation.",
        },
    ];
};


const seedData = async () => {

    try {

        await connectDB();

        console.log("Connected to MongoDB");


        // CLEAR OLD DATA
        await Topic.deleteMany();

        await Section.deleteMany();

        console.log("Old topics deleted");


        // INSERT TOPICS
        const createdTopics =
            await Topic.insertMany(topics);

        console.log(
            `${createdTopics.length} topics inserted`
        );


        // CREATE SECTIONS
        for (const topic of createdTopics) {

            const sections =
                createSectionsForTopic(
                    topic._id,
                    topic.mediaType
                );

            await Section.insertMany(sections);
        }

        console.log("Sections inserted");


        // DEMO USERS
        const demoUsers = [

            {
                nickname: "Alexander",
                email: "alex@gmail.com",
                password: await bcrypt.hash(
                    "123456",
                    10
                ),
                plan: "premium",
            },

            {
                nickname: "Lạc Gia",
                email: "lacgia@gmail.com",
                password: await bcrypt.hash(
                    "123456",
                    10
                ),
                plan: "premium_plus",
            },

            {
                nickname: "IELTSCONGVU",
                email: "ielt@gmail.com",
                password: await bcrypt.hash(
                    "123456",
                    10
                ),
                plan: "free",
            },
        ];

        await User.deleteMany({
            email: {
                $in: demoUsers.map(
                    (u) => u.email
                ),
            },
        });

        await User.insertMany(demoUsers);

        console.log("Demo users inserted");

        console.log("SEED COMPLETED");

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);
    }
};

seedData();