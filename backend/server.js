const express = require("express");
// const { Pool } = require("pg");
const cors = require("cors");
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

let dummyReviews = [
    { id: 1, course_code: 'CMPT120', overall_rating: 5, comment: 'Great intro to Python! SFU makes this very beginner friendly.' },
    { id: 2, course_code: 'CMPT120', overall_rating: 3, comment: 'A bit slow if you already know how to code.' },
    { id: 3, course_code: 'MACM101', overall_rating: 2, comment: 'Extremely difficult exams. Prepare for a lot of logic proofs.' },
    { id: 4, course_code: 'CMPT225', overall_rating: 4, comment: 'Data structures are fun but assignments take forever.' }
];

app.get("/reviews/:courseCode", async (req, res) => {
    const course_code = req.params.courseCode.toUpperCase;

    res.json({
        course: course_code,
        average: 5,
        reviews: 3,
    });
    res.send("Hello World!");
});

app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));