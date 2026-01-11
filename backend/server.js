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

let sfuCourseList = [];

const syncAllSFUCourses = async () => {
  const YEAR = '2026';
  const TERM = 'spring';

  try {
    console.log("Starting SFU sync...");
    
    // Step 1: Get all departments
    const deptRes = await fetch(`https://www.sfu.ca/bin/wcm/course-outlines?${YEAR}/${TERM}`);
    const depts = await deptRes.json(); // Array of { value: "CMPT", text: "Computing Science" }

    const allFetchPromises = depts.map(async (dept) => {
      try {
        const courseRes = await fetch(`https://www.sfu.ca/bin/wcm/course-outlines?${YEAR}/${TERM}/${dept.value}`);
        const courses = await courseRes.json();
        
        // Return codes like "CMPT120"
        return courses.map(c => `${dept.value}${c.value}`.toUpperCase());
      } catch (err) {
        return []; // Skip depts that fail
      }
    });

    // Step 2: Run all requests in parallel for speed
    const results = await Promise.all(allFetchPromises);
    
    // Step 3: Flatten the array of arrays into one list
    sfuCourseList = results.flat();
    
    console.log(`Successfully synced ${sfuCourseList.length} SFU courses!`);
  } catch (err) {
    console.error("Master sync failed:", err);
  }
};

// Run the sync when the server starts
syncAllSFUCourses();

app.get("/api/course-list", (req, res) => {
    res.send(sfuCourseList);
});

app.get("/reviews/:courseCode", async (req, res) => {
    const course_code = req.params.courseCode.toUpperCase();
    const filtered = dummyReviews.filter(r => r.course_code === course_code);
    console.log(filtered);
    const avg = filtered.length > 0 ? 
    (filtered.reduce((sum, r) => sum + r.overall_rating, 0) / filtered.length).toFixed(1)
    : 0;
    res.json({
        course: course_code,
        average: avg,
        reviews: filtered,
    });
});

app.post("/reviews", async (req, res) => {
    const { course_code, overall_rating, comment } = req.body;
    console.log(course_code);
    const newReview = {
        id: dummyReviews.length + 1,
        course_code: course_code.toUpperCase(),
        overall_rating: overall_rating,
        comment: comment, 
    }
    dummyReviews.push(newReview);
    console.log("Review added to database");
    res.json(newReview);
});

app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));