import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Progress</h1>
            <p className="text-gray-600 mb-6">Track your learning progress and milestones. (Placeholder content)</p>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50 text-gray-700">Progress charts and stats will go here.</div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}


