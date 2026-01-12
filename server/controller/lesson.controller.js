const { lessonPlanObject } = require("../utils/zod");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { OpenAI } = require("openai");
const { LessonPlanModel } = require("../model/lesson.model");
const { createDocument } = require("../utils/convert");
const {
  overview,
  curricularParagraph,
  conceptualpart,
  proceduralpart,
  factualKnowledgepart,
  teachingPointPart,
  sequentialActivityPart,
  formativeAssessmentPart,
  gptQuestionPart,
  summarisationPart,
  essentialQuestionPart,
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

  const overviewPrompt = overview({ subject, topic, grade, duration });
  const curricularParaPrompt = curricularParagraph({ subject, topic, grade });
  const factualKnowledgePrompt = factualKnowledgepart({
    subject,
    topic,
    grade,
  });
  const conceptualPrompt = conceptualpart({ subject, topic, grade });
  const proceduralPrompt = proceduralpart({ subject, topic, grade });
  const essentialQuestionPrompt = essentialQuestionPart({
    subject,
    topic,
    grade,
  });
  const teachingPointPrompt = teachingPointPart({ subject, topic, grade });
  const sequentialActivityPrompt = sequentialActivityPart({
    subject,
    topic,
    grade,
  });
  const formativeAssessmentPrompt = formativeAssessmentPart({
    subject,
    topic,
    grade,
  });
  const gptQuestionPrompt = gptQuestionPart({ subject, topic, grade });
  const summarisationPrompt = summarisationPart({ subject, topic, grade });
  // const combinedLessonPlanPrompt = `create a lesson plan on the subbject ${subject} with ${topic} of grade ${grade} of duration ${duration}`
  try {
    const openai = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });

    const [
      overview,
      curricularPara,
      factualpart,
      conceptual,
      procedural,
      essential,
      teaching,
      sequential,
      formative,
      gptquestion,
      summary,
    ] = await Promise.all([
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: overviewPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: curricularParaPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: factualKnowledgePrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: conceptualPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: proceduralPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: essentialQuestionPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: teachingPointPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: sequentialActivityPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: formativeAssessmentPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: gptQuestionPrompt }],
      }),
      openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: summarisationPrompt }],
      }),
    ]);

    // console.log(result.response.candidates[0].content.parts[0].text);
    const overviewText = overview.choices[0].message.content;
    const curricularText = curricularPara.choices[0].message.content;
    const factualsText = factualpart.choices[0].message.content;
    const conceptualText = conceptual.choices[0].message.content;
    const proceduralText = procedural.choices[0].message.content;
    const essentialQuestionText = essential.choices[0].message.content;
    const teachingPointText = teaching.choices[0].message.content;
    const sequentialActivityText = sequential.choices[0].message.content;
    const formativeAssessmentText = formative.choices[0].message.content;
    const gptQuestionText = gptquestion.choices[0].message.content;
    const summarizationhomeText = summary.choices[0].message.content;

    const docFile = await createDocument({
      subject,
      topic,
      grade,
      duration,
      overviewText,
      curricularText,
      factualsText,
      conceptualText,
      proceduralText,
      essentialQuestionText,
      teachingPointText,
      sequentialActivityText,
      formativeAssessmentText,
      gptQuestionText,
      summarizationhomeText,
    });

    if (fs.existsSync(docFile)) {
      console.log("File exists");
      // Proceed to send the file
    } else {
      console.log("File does not exist");
      // Handle the missing file case
    }
    await LessonPlanModel.create({
      subject: subject,
      topic: topic,
      grade: grade,
      duration: duration,
      creatorId: userId,
    });

    res.download(docFile, `${topic}.docx`, (err) => {
      if (err) {
        console.log(`Error sending file: ${err}`);
        res.status(500).json({ msg: "Error downloading file." });
      } else {
        fs.unlink(docFile, (err) => {
          if (err) console.error(`Error deleting file: ${err}`);
        });
      }
    });
  } catch (error) {
    console.log(`lesson plan ${error}`);
    res.json({
      msg: `error while creating the lesson Plan ${error.message}`,
    });
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
