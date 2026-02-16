'use client'

import { MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12 ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Company</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p className="font-medium text-white">Kuwait International Company for Computer Programming Activities</p>
              <p><span className="font-medium">Email:</span> info@kamglobalai.com</p>
              <p><span className="font-medium">Phone:</span> 080-42108882</p>
              <p><span className="font-medium">Website:</span> www.eduaitutors.com</p>
            </div>
          </div>

          {/* Kuwait Office */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kuwait Office</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>Block 4, Tunisia St.,</p>
              <p>Al Barsha Mall,</p>
              <p>Second Floor, Hawally,</p>
              <p>Kuwait</p>
            </div>
          </div>

          {/* India Office */}
          <div>
            <h3 className="text-lg font-semibold mb-4">India Office</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>544, 3rd Cross Rd,</p>
              <p>Opposite BDA Complex,</p>
              <p>Ganganagar, P&T Colony,</p>
              <p>RT Nagar, Bengaluru,</p>
              <p>Karnataka 560032</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="AboutSection.tsx" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="coursesSection.tsx" className="hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="SupportChatBot.tsx" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 EduAI Tutors - Kuwait International Company for Computer Programming Activities. All rights reserved.</p>
        </div>
      </div>
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110">
        <MessageCircle className="w-6 h-6" />
      </button>
    </footer>
  )
}

