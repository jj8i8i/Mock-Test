const MOCK_TESTS = [
    {
        title: "General Knowledge",
        timeLimit: 600, // 10 minutes
        questions: [
            {
                type: 'mcq', // Multiple Choice Question
                question: "What is the capital of Thailand?",
                options: ["Chiang Mai", "Bangkok", "Phuket", "Khon Kaen"],
                correctAnswer: 1 
            },
            {
                type: 'mcq',
                question: "What is the chemical formula for water?",
                options: ["O2", "CO2", "H2O", "NaCl"],
                correctAnswer: 2
            }
        ]
    },
    {
        title: "Basic Mathematics",
        timeLimit: 300, // 5 minutes
        questions: [
            {
                type: 'mcq',
                // Using KaTeX for math rendering. Wrap LaTeX in '$...$'
                question: "What is the value of $5 \\times (3+2)$?",
                options: ["20", "25", "30", "15"],
                correctAnswer: 1
            },
            {
                type: 'text', // Text input question
                question: "Solve for $x$ in the equation $2x + 3 = 11$.",
                correctAnswer: "4" // The answer is a string
            },
            {
                type: 'text',
                question: "What is the area of a square with a side length of 5 units?",
                correctAnswer: "25"
            },
            {
                type: 'mcq',
                question: "What is the Pythagorean theorem?",
                options: ["$a^2 + b^2 = c^2$", "$a+b=c$", "$E=mc^2$", "$\\pi r^2$"],
                correctAnswer: 0
            }
        ]
    }
    // You can add new test sets here
];
