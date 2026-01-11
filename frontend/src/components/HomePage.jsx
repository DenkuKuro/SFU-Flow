import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import { useNavigate } from 'react-router-dom';

// --- Main App Component ---
function HomePage() {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch the master list of courses on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/course-list')
      .then(res => res.json())
      .then(data => setAllCourses(data))
      .catch(err => console.error("Error loading course list:", err));
  }, []);

  // 2. Fetch specific reviews when a course is selected
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-red-700 mb-2">SFU Course Insight</h1>
          <p className="text-gray-600">Search for any SFU course to see student feedback.</p>
        </header>

        <SearchBar allCourses={allCourses} onSearch={fetchCourseReviews} />

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700 mx-auto"></div>
          </div>
        )}

        {courseData && !loading && (
          <div className="animate-in fade-in duration-500 w-full">
            {/* Course Header Stat */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-8 border-red-600 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{courseData.course}</h2>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Course Summary</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-red-600">{courseData.average}</span>
                <span className="text-gray-400 font-bold text-xl">/5</span>
                <p className="text-xs text-gray-500 font-semibold">OVERALL RATING</p>
              </div>
            </div>

            {/* Review List */}
            <h3 className="text-lg font-bold mb-4 px-2">Student Comments</h3>
            <div className="space-y-4">
              {courseData.reviews.length > 0 ? (
                courseData.reviews.map((rev) => (
                  <div className='flex flex-col w-full'>              
                    <div key={rev.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                            Rating: {rev.overall_rating}/5
                        </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-100 rounded-lg border-2 border-dashed">
                  <p className="text-gray-500">No reviews found for {courseData.course} yet.</p>
                  <button onClick={() => navigate("/ReviewForm", {state: {courseCode: courseData.course}})} className="mt-2 text-red-600 font-bold hover:underline">Be the first to review!</button>
                </div>
              )}
            </div>
            <button onClick={() => navigate("/ReviewForm", {state: {courseCode: courseData.course}})} className="mt-2 text-red-600 font-bold hover:underline w-full">Add a review!</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
