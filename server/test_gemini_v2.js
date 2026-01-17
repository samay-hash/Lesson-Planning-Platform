require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const main = async () => {
    const key = process.env.GEMINI_API_KEY;
    console.log(`Checking key: ${key ? (key.substring(0, 5) + '...') : 'MISSING'}`);

    if (!key) {
        console.error("No GEMINI_API_KEY found in environment.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // The screenshot shows "Generative Language API" is selected, so this should work now.
        // We'll use the flash model which is standard.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent("Just say 'API WORKING'");
        console.log("Response:", result.response.text());
        console.log("SUCCESS: Key is valid and API is enabled.");
    } catch (error) {
        console.error("FAILURE: Key check failed.");
        console.error(error.message);
    }
};

main();
