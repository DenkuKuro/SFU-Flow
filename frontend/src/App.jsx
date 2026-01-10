import { useState } from 'react'
import { SearchBar } from './components'

function App() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCourseReviews = async (courseCode) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/reviews/${courseCode}`);
      const data = await response.json();
      setCourseData(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">SFU Course Ratings</h1>
      
      <SearchBar onSearch={fetchCourseReviews} />

      {loading && <p className="text-center mt-4">Loading...</p>}

      {courseData && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{courseData.course}</h2>
            <span className="text-lg font-semibold text-red-600">
              Avg Rating: {courseData.average || 'N/A'}/5
            </span>
          </div>

          {courseData.reviews.length > 0 ? (
            courseData.reviews.map((rev, index) => (
              <div key={index} className="border-b py-4">
                <p className="font-bold">Rating: {rev.overall_rating}/5</p>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet for this course.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App
