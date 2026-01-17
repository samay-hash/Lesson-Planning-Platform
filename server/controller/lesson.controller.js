const { lessonPlanObject } = require("../utils/zod");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { LessonPlanModel } = require("../model/lesson.model");
const { createDocument } = require("../utils/convert");
const {
  lessonPlanPrompt
} = require("../utils/prompts");

const createPlan = async (req, res) => {
  const parsedObject = lessonPlanObject.safeParse(req.body);
  const userId = req.userId;

  if (!parsedObject.success)
    return res.status(403).json({
      msg: `provide valid crediantials`,
      error: parsedObject.error.errors,
    });

  const { subject, topic, grade, duration } = parsedObject.data;
  const prompt = lessonPlanPrompt({ subject, topic, grade, duration });

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock_key");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    let lessonData;
    let rawContent;

    try {
      const result = await model.generateContent(prompt + " Output ONLY valid JSON. Do not use Markdown code blocks.");
      const response = await result.response;
      rawContent = response.text();
      console.log("Raw AI content received:", rawContent); // DEBUG

      try {
        lessonData = JSON.parse(rawContent);
      } catch (e) {
        console.log("Strict JSON parse failed, trying regex match...");
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          lessonData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse AI response");
        }
      }

    } catch (aiError) {
      console.error("AI Generation Failed (likely Invalid Key or Quota). Using Mock Data Fallback.", aiError.message);

      // MOCK DATA FALLBACK
      lessonData = {
        overview: `(DEMO MODE - AI KEY INVALID) This is a sample lesson plan for ${topic}. The AI generation failed due to exipire qouta of API Key, so we are providing this template to demonstrate the file generation capabilities.`,
        curricularGoals: ["Understand the core concepts of the topic.", "Apply knowledge to real-world scenarios."],
        curricularCompetencies: ["Critical thinking analysis.", "Collaborative problem solving.", "Information synthesis."],
        factualKnowledge: ["Key Fact 1: The foundation of the topic.", "Key Fact 2: Historical context.", "Key Fact 3: Modern application."],
        conceptualKnowledge: ["Concept 1: Theoretical framework.", "Concept 2: Underlying principles.", "Concept 3: Abstract connections."],
        proceduralKnowledge: ["Step 1: Initial preparation.", "Step 2: Execution phase.", "Step 3: Review and analysis."],
        essentialQuestions: ["Why is this topic important?", "How does it impact our daily lives?", "What are the future implications?"],
        teachingPoints: ["Introduce the main vocabulary.", "Demonstrate with a practical example.", "Facilitate group discussion."],
        sequentialActivities: ["Activity 1: Brainstorming session (10 min).", "Activity 2: Group project work (20 min).", "Activity 3: Class presentation (15 min)."],
        formativeAssessments: ["Quick quiz on key terms.", "Think-pair-share observation.", "Exit ticket validation."],
        gptQuestions: ["What was the most difficult concept?", "How would you explain this to a friend?", "Can you think of another example?"],
        summarization: "This lesson covered the fundamental aspects of the topic, ensuring students grasped both theory and practice.",
        homework: ["Read the assigned chapter.", "Complete the worksheet questions.", "Prepare a short summary for next class."]
      };
    }

    const docFile = await createDocument({
      subject,
      topic,
      grade,
      duration,
      overviewText: lessonData.overview,
      curricularText: Array.isArray(lessonData.curricularGoals)
        ? `${lessonData.curricularGoals.join('\n')}\n${lessonData.curricularCompetencies.join('\n')}`
        : lessonData.curricularGoals || "", // Handle potential schema mismatch
      factualsText: Array.isArray(lessonData.factualKnowledge) ? lessonData.factualKnowledge.join('\n') : lessonData.factualKnowledge,
      conceptualText: Array.isArray(lessonData.conceptualKnowledge) ? lessonData.conceptualKnowledge.join('\n') : lessonData.conceptualKnowledge,
      proceduralText: Array.isArray(lessonData.proceduralKnowledge) ? lessonData.proceduralKnowledge.join('\n') : lessonData.proceduralKnowledge,
      essentialQuestionText: Array.isArray(lessonData.essentialQuestions) ? lessonData.essentialQuestions.join('\n') : lessonData.essentialQuestions,
      teachingPointText: Array.isArray(lessonData.teachingPoints) ? lessonData.teachingPoints.join('\n') : lessonData.teachingPoints,
      sequentialActivityText: Array.isArray(lessonData.sequentialActivities) ? lessonData.sequentialActivities.join('\n') : lessonData.sequentialActivities,
      formativeAssessmentText: Array.isArray(lessonData.formativeAssessments) ? lessonData.formativeAssessments.join('\n') : lessonData.formativeAssessments,
      gptQuestionText: Array.isArray(lessonData.gptQuestions) ? lessonData.gptQuestions.join('\n') : lessonData.gptQuestions,
      summarizationhomeText: `${lessonData.summarization}\n\nHomework:\n${Array.isArray(lessonData.homework) ? lessonData.homework.join('\n') : lessonData.homework}`,
    });

    if (fs.existsSync(docFile)) {
      console.log("File exists");
    } else {
      console.log("File does not exist");
    }

    await LessonPlanModel.create({
      subject: subject,
      topic: topic,
      grade: grade,
      duration: duration,
      creatorId: userId,
    });

    const docxBase64 = fs.readFileSync(docFile).toString("base64");

    fs.unlink(docFile, (err) => {
      if (err) console.error(`Error deleting file: ${err}`);
    });

    res.status(200).json({
      success: true,
      lessonPlan: lessonData,
      docxFile: docxBase64,
      filename: `${topic}.docx`,
    });
  } catch (error) {
    console.log(`lesson plan error: ${error}`);
    if (!res.headersSent) {
      res.status(500).json({
        msg: `error while creating the lesson Plan ${error.message}`,
      });
    }
  }
};

const viewAllPlans = async (req, res) => {
  const userId = req.userId;
  try {
    const lessonPlans = await LessonPlanModel.find({ creatorId: userId });

    res.status(200).json({
      msg: "lesson plans fetched successfully",
      lessonPlans: lessonPlans,
    });
  } catch (error) {
    console.log(`error while fetching lessonPlans, ${error.message}`);
    res.status(500).json({
      msg: `error while fetching plans : ${error.message}`,
    });
  }
};

module.exports = {
  createPlan,
  viewAllPlans,
};
