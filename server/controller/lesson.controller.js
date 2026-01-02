const { lessonPlanObject } = require('../utils/zod')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { OpenAI, Configuration } = require('openai')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { LessonPlanModel } = require('../model/lesson.model')
const { createDocument } = require('../utils/convert')
const { overview, curricularParagraph, conceptualpart, proceduralpart, factualKnowledgepart, teachingPointPart, sequentialActivityPart, formativeAssesmentPart, gptQuestionPart, summarisationPart, essentialQuestionPart } = require('../utils/prompts')



const createPlan = async (req, res) => {
    const parsedObject = lessonPlanObject.safeParse(req.body)
    // const userId = req.userId
    

    if(!parsedObject.success) return res.status(403).json({msg : `provide valid crediantials`, error : parsedObject.error.errors})
        
    const { subject, topic, grade, duration, username } = parsedObject.data
                               
        const overviewPrompt = overview({subject, topic, grade, duration})
        const curricularParaPrompt = curricularParagraph({subject, topic, grade})
        const factualKnowledgePrompt = factualKnowledgepart({subject, topic, grade})
        const conceptualPrompt = conceptualpart({subject, topic, grade})
        const proceduralPrompt = proceduralpart({subject, topic, grade})
        const essentialQuestionPrompt = essentialQuestionPart({subject, topic, grade})
        const teachingPointPrompt = teachingPointPart({subject, topic, grade})
        const sequentialActivityPrompt = sequentialActivityPart({subject, topic, grade})
        const formativeAssesmentPrompt = formativeAssesmentPart({subject, topic, grade})
        const gptQuestionPrompt = gptQuestionPart({subject, topic, grade})
        const summarisationPrompt = summarisationPart({subject, topic, grade})
    // const combinedLessonPlanPrompt = `create a lesson plan on the subbject ${subject} with ${topic} of grade ${grade} of duration ${duration}`
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const [overview, curricularPara, factualpart, conceptual, procedural, essential ,teaching, sequential, formative, gptquestion, summary ] = await Promise.all([
            model.generateContent(overviewPrompt),
            model.generateContent(curricularParaPrompt),
            model.generateContent(factualKnowledgePrompt),
            model.generateContent(conceptualPrompt),
            model.generateContent(proceduralPrompt),
            model.generateContent(essentialQuestionPrompt),
            model.generateContent(teachingPointPrompt),
            model.generateContent(sequentialActivityPrompt),
            model.generateContent(formativeAssesmentPrompt),
            model.generateContent(gptQuestionPrompt),
            model.generateContent(summarisationPrompt)
        ])
        

        // console.log(result.response.candidates[0].content.parts[0].text);
        const overviewText = overview.response.candidates[0].content.parts[0].text
        const curricularText = curricularPara.response.candidates[0].content.parts[0].text
        const factualsText = factualpart.response.candidates[0].content.parts[0].text
        const conceptualText = conceptual.response.candidates[0].content.parts[0].text
        const proceduralText = procedural.response.candidates[0].content.parts[0].text
        const essentialQuestionText = essential.response.candidates[0].content.parts[0].text
        const teachingPointText = teaching.response.candidates[0].content.parts[0].text
        const sequentialActivityText = sequential.response.candidates[0].content.parts[0].text
        const formativeAssesmentText = formative.response.candidates[0].content.parts[0].text
        const gptQuestionText = gptquestion.response.candidates[0].content.parts[0].text
        const summarizationhomeText = summary.response.candidates[0].content.parts[0].text

        
    
       const docFile = await createDocument({subject, topic, grade, duration, overviewText, curricularText, factualsText, conceptualText, proceduralText,essentialQuestionText, teachingPointText, sequentialActivityText, formativeAssesmentText, gptQuestionText, summarizationhomeText})

    //    if (fs.existsSync(docFile)) {
    //     console.log('File exists');
    //     // Proceed to send the file
    // } else {
    //     console.log('File does not exist');
    //     // Handle the missing file case
    // }
    await LessonPlanModel.create({
        subject : subject,
        topic : topic,
        grade : grade,
        duration : duration,
        creatorId : username
    })

        res.download(docFile, `${topic}.docx`, (err) => {
            if(err) {
                console.log(`Error sending file: ${err}`);
                res.status(500).json({ msg: 'Error downloading file.' });
            } else {
                fs.unlink(docFile, (err) => {
                    if (err) console.error(`Error deleting file: ${err}`);
                });
            }
        })
        
        
            
    } catch (error) {
        console.log(`lesson plan ${error}`);
        res.json({
            msg : `error while creating the lesson Plan ${error.message}`
        })
        
    }
}



const viewAllPlans = async(req, res) => {
    try {
        const lessonPlans = await LessonPlanModel.find({})

        res.status(200).json({
            msg : 'all lesson plans fetched successfully',
            lessonPlans : lessonPlans
        })
    } catch (error) {
        console.log(`error while fetching all lessonPlans, ${error.message}`);
        res.status(500).json({
            msg : `error while fetching plans : ${error.message}`
        })
        
    }
}




module.exports = {
    createPlan,
    viewAllPlans
}


