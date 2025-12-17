'use client'

export default function QuizProgress() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Progress</h3>
      <div className="flex items-center justify-around">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-2">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * 0.25}`} className="text-primary-600" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">75%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Completion</p>
        </div>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-2">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * 0.35}`} className="text-green-600" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">65%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Level</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-medium text-gray-900">Courses:</span> 2013
        </p>
      </div>
    </div>
  )
}

