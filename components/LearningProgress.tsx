'use client'

export default function LearningProgress() {
  const courses = [
    { title: 'Web Development', progress: 80, color: 'bg-primary-500' },
    { title: 'Data Science', progress: 60, color: 'bg-green-500' },
    { title: 'UI/UX Design', progress: 45, color: 'bg-purple-500' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{course.title}</span>
              <span className="text-sm text-gray-600">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${course.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">COVOKI 2023</span>
        </p>
      </div>
    </div>
  )
}

