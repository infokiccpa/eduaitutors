'use client'

export default function Testimonials() {
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Developer', content: 'Edu Altutors helped me transition into tech. The courses are well-structured and the instructors are amazing!', image: '👩‍💻' },
    { name: 'Michael Chen', role: 'Data Analyst', content: 'The best investment I made for my career. The learning platform is intuitive and the content is top-notch.', image: '👨‍💼' },
  ]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-3xl">{testimonial.image}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"{testimonial.content}"</p>
            <button className="mt-4 text-primary-600 font-medium hover:text-primary-700">Read more →</button>
          </div>
        ))}
      </div>
    </section>
  )
}

