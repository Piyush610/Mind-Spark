require("dotenv").config();
const mongoose = require("mongoose");
const Subject = require("./models/Subject");
const Question = require("./models/Question");
const User = require("./models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const subjects = [
  {
    name: "Mathematics",
    icon: "🔢",
    color: "#58CC02",
    description: "Numbers, algebra, and geometry",
  },
  {
    name: "Science",
    icon: "🔬",
    color: "#1CB0F6",
    description: "Physics, chemistry, and biology basics",
  },
  {
    name: "English",
    icon: "📖",
    color: "#FF9600",
    description: "Grammar, vocabulary, and reading",
  },
  {
    name: "History",
    icon: "🏛️",
    color: "#CE82FF",
    description: "World history and civilizations",
  },
  {
    name: "Geography",
    icon: "🌍",
    color: "#FF4B4B",
    description: "Countries, capitals, and maps",
  },
];

const generateQuestions = (subjectId, subjectName) => {
  const questionSets = {
    Mathematics: [
      {
        questionText: "What is 15 + 27?",
        options: ["42", "43", "41", "40"],
        correctAnswer: 0,
      },
      {
        questionText: "What is 8 × 7?",
        options: ["54", "56", "58", "64"],
        correctAnswer: 1,
      },
      {
        questionText: "What is 100 ÷ 4?",
        options: ["20", "30", "25", "15"],
        correctAnswer: 2,
      },
      {
        questionText: "What is the square root of 81?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 2,
      },
      {
        questionText: "What is 3² + 4²?",
        options: ["25", "24", "23", "26"],
        correctAnswer: 0,
      },
      {
        questionText: "What is 50% of 120?",
        options: ["50", "55", "60", "65"],
        correctAnswer: 2,
      },
      {
        questionText: "What is the next prime number after 7?",
        options: ["9", "10", "11", "13"],
        correctAnswer: 2,
      },
      {
        questionText: "What is 2³?",
        options: ["6", "8", "9", "12"],
        correctAnswer: 1,
      },
      // Remedial questions
      {
        questionText: "What is 5 + 3?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 1,
        isRemedial: true,
      },
      {
        questionText: "What is 10 - 4?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1,
        isRemedial: true,
      },
      {
        questionText: "What is 3 × 3?",
        options: ["6", "9", "12", "15"],
        correctAnswer: 1,
        isRemedial: true,
      },
    ],
    Science: [
      {
        questionText: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctAnswer: 0,
      },
      {
        questionText: "What planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2,
      },
      {
        questionText: "What is the largest organ in the human body?",
        options: ["Heart", "Liver", "Brain", "Skin"],
        correctAnswer: 3,
      },
      {
        questionText: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswer: 2,
      },
      {
        questionText: "What is the speed of light approximately?",
        options: [
          "300,000 km/s",
          "150,000 km/s",
          "500,000 km/s",
          "100,000 km/s",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        correctAnswer: 1,
      },
      {
        questionText: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
        correctAnswer: 2,
      },
      {
        questionText: "What type of rock is formed from cooled lava?",
        options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
        correctAnswer: 2,
      },
      // Remedial questions
      {
        questionText: "What do we breathe in?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"],
        correctAnswer: 1,
        isRemedial: true,
      },
      {
        questionText: "How many legs does a spider have?",
        options: ["6", "8", "10", "4"],
        correctAnswer: 1,
        isRemedial: true,
      },
    ],
    English: [
      {
        questionText: 'What is the past tense of "go"?',
        options: ["Goed", "Gone", "Went", "Going"],
        correctAnswer: 2,
      },
      {
        questionText: "Which is a noun?",
        options: ["Run", "Beautiful", "Happiness", "Quickly"],
        correctAnswer: 2,
      },
      {
        questionText: 'What is the plural of "child"?',
        options: ["Childs", "Children", "Childes", "Child's"],
        correctAnswer: 1,
      },
      {
        questionText: "Which sentence is correct?",
        options: [
          "She don't like it",
          "She doesn't like it",
          "She not like it",
          "She no like it",
        ],
        correctAnswer: 1,
      },
      {
        questionText: 'What is a synonym for "happy"?',
        options: ["Sad", "Angry", "Joyful", "Tired"],
        correctAnswer: 2,
      },
      {
        questionText: "Which word is an adjective?",
        options: ["Slowly", "Beautiful", "Jump", "Happiness"],
        correctAnswer: 1,
      },
      {
        questionText: 'What is the opposite of "ancient"?',
        options: ["Old", "Modern", "Historic", "Vintage"],
        correctAnswer: 1,
      },
      {
        questionText: "Which is a conjunction?",
        options: ["Running", "But", "Quickly", "House"],
        correctAnswer: 1,
      },
      // Remedial questions
      {
        questionText: 'What is the opposite of "big"?',
        options: ["Large", "Small", "Huge", "Tall"],
        correctAnswer: 1,
        isRemedial: true,
      },
      {
        questionText: "Which is a verb?",
        options: ["Book", "Run", "Happy", "Blue"],
        correctAnswer: 1,
        isRemedial: true,
      },
    ],
    History: [
      {
        questionText: "Who was the first President of the United States?",
        options: [
          "Abraham Lincoln",
          "George Washington",
          "Thomas Jefferson",
          "John Adams",
        ],
        correctAnswer: 1,
      },
      {
        questionText: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctAnswer: 2,
      },
      {
        questionText: "Which civilization built the pyramids?",
        options: ["Greek", "Roman", "Egyptian", "Mayan"],
        correctAnswer: 2,
      },
      {
        questionText: "Who discovered America in 1492?",
        options: [
          "Vasco da Gama",
          "Christopher Columbus",
          "Ferdinand Magellan",
          "Marco Polo",
        ],
        correctAnswer: 1,
      },
      {
        questionText:
          "What was the name of the ship that carried the Pilgrims?",
        options: ["Mayflower", "Santa Maria", "Titanic", "Beagle"],
        correctAnswer: 0,
      },
      {
        questionText: "Which empire was ruled by Julius Caesar?",
        options: ["Greek", "Persian", "Roman", "Ottoman"],
        correctAnswer: 2,
      },
      {
        questionText: "When did India gain independence?",
        options: ["1945", "1946", "1947", "1948"],
        correctAnswer: 2,
      },
      {
        questionText: "Who invented the printing press?",
        options: [
          "Thomas Edison",
          "Johannes Gutenberg",
          "Benjamin Franklin",
          "Isaac Newton",
        ],
        correctAnswer: 1,
      },
      // Remedial questions
      {
        questionText: "What is the capital of ancient Rome?",
        options: ["Athens", "Rome", "Cairo", "Paris"],
        correctAnswer: 1,
        isRemedial: true,
      },
      {
        questionText: "Dinosaurs lived how many years ago?",
        options: ["1,000", "1 million", "65 million", "100"],
        correctAnswer: 2,
        isRemedial: true,
      },
    ],
    Geography: [
      {
        questionText: "What is the largest continent?",
        options: ["Africa", "North America", "Asia", "Europe"],
        correctAnswer: 2,
      },
      {
        questionText: "Which is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correctAnswer: 1,
      },
      {
        questionText: "What is the capital of Japan?",
        options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        correctAnswer: 2,
      },
      {
        questionText: "Which ocean is the largest?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: 3,
      },
      {
        questionText: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correctAnswer: 1,
      },
      {
        questionText: "Which mountain is the tallest on Earth?",
        options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
        correctAnswer: 1,
      },
      {
        questionText: "Which country has the most population?",
        options: ["USA", "India", "China", "Indonesia"],
        correctAnswer: 2,
      },
      {
        questionText: "In which continent is Brazil located?",
        options: ["North America", "Europe", "South America", "Africa"],
        correctAnswer: 2,
      },
      // Remedial questions
      {
        questionText: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        isRemedial: true,
      },
      {
        questionText: "What is surrounded by land?",
        options: ["Ocean", "Lake", "Sea", "River"],
        correctAnswer: 1,
        isRemedial: true,
      },
    ],
  };

  const questions = questionSets[subjectName] || [];
  return questions.map((q) => ({
    ...q,
    subjectId,
    isRemedial: q.isRemedial || false,
  }));
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Subject.deleteMany({});
    await Question.deleteMany({});
    console.log("Cleared existing subjects and questions");

    // Create subjects
    const createdSubjects = await Subject.insertMany(subjects);
    console.log(`Created ${createdSubjects.length} subjects`);

    // Create questions for each subject
    let totalQuestions = 0;
    for (const subject of createdSubjects) {
      const questions = generateQuestions(subject._id, subject.name);
      await Question.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`Created ${questions.length} questions for ${subject.name}`);
    }

    console.log(`\nSeeding complete!`);
    console.log(`Total subjects: ${createdSubjects.length}`);
    console.log(`Total questions: ${totalQuestions}`);

    // Create a demo teacher account
    const existingTeacher = await User.findOne({ email: "teacher@demo.com" });
    if (!existingTeacher) {
      await User.create({
        name: "Demo Teacher",
        email: "teacher@demo.com",
        password: "teacher123",
        role: "teacher",
      });
      console.log(
        "Created demo teacher account: teacher@demo.com / teacher123"
      );
    }

    // Create a demo student account
    const existingStudent = await User.findOne({ email: "student@demo.com" });
    if (!existingStudent) {
      await User.create({
        name: "Demo Student",
        email: "student@demo.com",
        password: "student123",
        role: "student",
      });
      console.log(
        "Created demo student account: student@demo.com / student123"
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
