import React, { useState } from "react"; // 1. Added useState
import { useNavigate, useLocation } from "react-router-dom";

// 2. Accept props from App.jsx so the form knows which course it's for
const ReviewForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courseCode = location.state?.courseCode;
    // 3. Define the missing state variables
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => { // 4. Added 'e' here
        e.preventDefault(); // 5. Important: Prevents the page from refreshing
        setIsSubmitting(true);

        const newReview = {
            course_code: courseCode,
            overall_rating: parseInt(rating),
            comment: comment,
            user_id: 1 
        };

        try {
            const response = await fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview),
            });

            if (response.ok) {
                const savedReview = await response.json();
                setComment(''); 
                alert("Review submitted successfully!");
                navigate("/"); 
            }
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gray-50 p-4 md:p-10 text-gray-800 text-center">
            <div></div>
                <h1 className="text-4xl font-extrabold text-red-700 mb-2">Review Form</h1>
                {/* 6. Show the course name so the user knows what they are rating */}
                <p className="text-gray-600 mb-6">Adding feedback for: <strong>{courseCode}</strong></p>
                <div className="flex justify-center ">
                    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm w-full max-w-xl h-full">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Overall Rating</label>
                            <select 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {[5, 4, 3, 2, 1].map(num => (
                                    <option key={num} value={num}>{num} Stars</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Your Feedback</label>
                            <textarea 
                                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 h-32"
                                placeholder="What should other students know about this course?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-lg font-bold text-white transition ${
                                isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Review'}
                        </button>
                        
                        {/* 7. Added a cancel button */}
                        <button 
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full py-2 text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
        </div>
    );
};

export default ReviewForm;