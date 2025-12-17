import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import FeaturedPackages from '@/components/FeaturedPackages'
import Footer from '@/components/Footer'

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-0 px-8 pb-8 pt-0">
          {/* <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Packages</h1>
              <p className="text-gray-600">
                Choose the right learning package for your journey. Compare plans and pick what fits you best.
              </p>
            </div>
          </div> */}
          <FeaturedPackages />
        </main>
      </div>
      <Footer />
    </div>
  )
}


