'use client'

import { MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12 ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <p><span className="font-medium">Email:</span> info@kamglobalai.com</p>
              <p><span className="font-medium">Phone:</span> 08042108882</p>
              <p><span className="font-medium">Website:</span> www.edualtutors.com</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Language & Settings</h3>
            <div className="space-y-2 text-gray-300">
              <p>Language: EN</p>
              <p>AI Assistant: Enabled</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Edu Altutors. All rights reserved.</p>
        </div>
      </div>
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110">
        <MessageCircle className="w-6 h-6" />
      </button>
    </footer>
  )
}

