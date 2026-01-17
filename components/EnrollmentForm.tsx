'use client'

import { useState, useEffect } from 'react'

interface EnrollmentFormProps {
  selectedSubjects: any[]
  onClose: () => void
}

export default function EnrollmentForm({ selectedSubjects = [], onClose }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    schoolName: '',
  })
  const [errors, setErrors] = useState<string[]>([])

  const totalAmount = selectedSubjects.reduce((sum, s) => sum + (s.price || 0), 0)
  const selectedClass = selectedSubjects.length > 0 ? selectedSubjects[0].class : ''
  const selectedBoard = selectedSubjects.length > 0 ? selectedSubjects[0].board : ''

  const validateForm = () => {
    const newErrors: string[] = []
    const phonePattern = /^\d{10}$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.studentName || formData.studentName.trim().length < 2) {
      newErrors.push('Please enter a valid student name.')
    }
    if (!formData.phone || !phonePattern.test(formData.phone.trim())) {
      newErrors.push('Please enter a valid 10-digit phone number.')
    }
    if (!formData.email || !emailPattern.test(formData.email.trim())) {
      newErrors.push('Please enter a valid email address.')
    }
    if (!selectedClass || !selectedBoard) {
      newErrors.push('Please select at least one subject to set class and board.')
    }
    if (selectedSubjects.length === 0 || totalAmount <= 0) {
      newErrors.push('Please choose at least one subject before submitting.')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // In a real app, you'd send this to your API
      const enrollmentData = {
        ...formData,
        class: selectedClass,
        board: selectedBoard,
        subjects: selectedSubjects,
        totalAmount,
      }

      console.log('Enrollment data:', enrollmentData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('Enrollment submitted successfully!')

      // Reset form
      setFormData({
        studentName: '',
        phone: '',
        email: '',
        schoolName: '',
      })
      onClose()
    } catch (error) {
      alert('Sorry, there was a problem submitting your enrollment. Please try again.')
    }
  }

  useEffect(() => {
    // Scroll to form when it opens
    const formElement = document.getElementById('enrollment-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <section id="register" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Complete Your Registration</h2>
          <p className="text-xl text-gray-600">Fill in your details to enroll in the course</p>
        </div>

        <form
          id="enrollment-form"
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 md:p-12 rounded-3xl shadow-2xl"
        >
          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Selected Subjects</h3>
            <div className="bg-white p-4 rounded-lg mb-4">
              {selectedSubjects.length === 0 ? (
                <p className="text-gray-600">No subjects selected yet</p>
              ) : (
                <ul className="space-y-2">
                  {selectedSubjects.map((subject, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        {subject.subject} - Class {subject.class} ({subject.board})
                      </span>
                      <span className="text-primary-600 font-bold">₹{subject.price?.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Total Amount: </span>
              <span className="text-2xl font-bold text-primary-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Student Name *</label>
              <input
                type="text"
                name="studentName"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition"
                placeholder="Enter student name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Class *</label>
              <input
                type="text"
                value={selectedClass || ''}
                readOnly
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-100 cursor-not-allowed"
                placeholder="Select from courses above"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Board *</label>
              <input
                type="text"
                value={selectedBoard || ''}
                readOnly
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-100 cursor-not-allowed"
                placeholder="Select from courses above"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">School Name (Optional)</label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition"
                placeholder="Enter school name"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition"
            >
              Complete Registration ✓
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-full font-bold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

