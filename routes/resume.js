const express = require("express");
const router = express.Router();

const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const model = require("../config/ai.js");


// multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage
});


router.get("/upload", (req, res) => {
    res.render("resume/upload.ejs");
});


router.post("/upload", upload.single("resume"), async (req, res) => {

    try {

        console.log(req.file);


        // Extract PDF text
const parser = new PDFParse({
    data: req.file.buffer
});

const result = await parser.getText();

await parser.destroy();

        const resumeText = result.text;

        console.log(resumeText);


        // Send resume text to AI
        const prompt = `
        Analyze this resume.

        Give:
        1. ATS Score out of 100
        2. Strengths
        3. Weak points
        4. Missing skills
        5. Suggestions for improvement

        Resume:
        ${resumeText}
        `;

const response = await model.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt
});

const analysis = response.text;


        res.render("resume/show.ejs", {
            analysis: analysis
        });


    } catch (err) {

        console.log(err);
        res.send("Something went wrong");

    }

});


module.exports = router;