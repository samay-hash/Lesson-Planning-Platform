const path = require('path')
const fs = require('fs')
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType } = require('docx')

const createDocument = ({ subject, topic, grade, duration, overviewText, curricularText, factualsText, conceptualText, proceduralText, essentialQuestionText, teachingPointText, sequentialActivityText, formativeAssesmentText, gptQuestionText, summarizationhomeText }) => {

    // Helper to create simple text paragraphs
    const createPara = (text, bold = false, underline = false) => {
        return new Paragraph({
            children: [
                new TextRun({
                    text: text,
                    bold: bold,
                    underline: underline ? {} : undefined,
                }),
            ],
            spacing: { after: 200 }
        });
    }

    // Helper to create a table row with simple text
    const createRow = (cells) => {
        return new TableRow({
            children: cells.map(cellText => new TableCell({
                children: [new Paragraph({ text: cellText || " " })],
                width: {
                    size: 100 / cells.length,
                    type: WidthType.PERCENTAGE,
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
            }))
        });
    }


    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "LESSON PLAN",
                    heading: "Heading1",
                    alignment: "center",
                    spacing: { after: 300 }
                }),

                // Intro Table
                new Table({
                    rows: [
                        createRow([`Lesson Plan no: `, ` `]),
                        createRow([`Date: `, ` `, `Subject: ${subject}`]),
                        createRow([`Class: ${grade}`, ` `, `Topic: ${topic}`]),
                        createRow([`Time: ${duration}`, ` `, `Period: `]),
                    ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                }),

                new Paragraph({ text: "" }), // Spacer

                // Sections
                createPara('Overview and Learning Objective', true, true),
                createPara(overviewText || " "),

                createPara('Curricular Goals and Curricular competencies', true, true),
                createPara(curricularText || " "),

                new Paragraph({ text: "" }), // Spacer

                // Table One
                new Table({
                    rows: [
                        createRow(['Learning Objective', 'Curricular competencies', 'FACTUAL KNOWLEDGE', 'CONCEPTUAL KNOWLEDGE', 'PROCEDURAL KNOWLEDGE']),
                        createRow(['LO-1', 'CC-1', factualsText || " ", conceptualText || " ", proceduralText || " "]),
                    ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    }
                }),

                new Paragraph({ text: "" }), // Spacer

                createPara('Essential question', true, true),
                createPara(essentialQuestionText || " "),

                new Paragraph({ text: "" }), // Spacer

                // Presentation Table
                new Table({
                    rows: [
                        createRow(['Teaching Points', 'Learning Outcomes', 'Sequential Learning Activities', 'Formative Assessment', 'Expected Queries']),
                        createRow([teachingPointText || " ", 'LO1, LO2', sequentialActivityText || " ", formativeAssesmentText || " ", gptQuestionText || " "]),
                    ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    }
                }),

                new Paragraph({ text: "" }), // Spacer

                createPara('Summarization And Home work :', true, true),
                createPara(summarizationhomeText || " "),

                new Paragraph({ text: "" }), // Spacer
                createPara('Signature of Teacher ', true, true),
            ],
        }],
    });

    const dirPath = path.join(__dirname, '..', 'LessonPlansTemp');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, `${topic}.docx`)


    return Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(filePath, buffer);
        console.log("Document created successfully at " + filePath);
        return filePath;
    });
}


module.exports = {
    createDocument
}