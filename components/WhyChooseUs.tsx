'use client'

export default function WhyChooseUs() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Edu Altutors?</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-64 bg-gradient-to-br from-primary-400 to-secondary-800 flex items-center justify-center text-6xl">🎯</div>
          <div className="md:w-1/2 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Path to Success Starts Here</h3>
            <p className="text-gray-600 mb-4">
              Edu Altutors provides a comprehensive learning experience with expert instructors, interactive content, and personalized learning paths. Join thousands of successful learners who have transformed their careers with our platform.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Expert-led courses</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Interactive quizzes and assessments</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Progress tracking and analytics</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>24/7 access to learning materials</li>
            </ul>
            <button className="text-primary-600 font-medium hover:text-primary-700">Read more →</button>
          </div>
        </div>
      </div>
    </section>
  )
}

