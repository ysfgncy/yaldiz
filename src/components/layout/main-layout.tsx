import { Sidebar } from './sidebar'
import { Header } from './header'

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function MainLayout({ children, title, description }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header spacing */}
        <div className="lg:hidden h-16" />

        <Header title={title} description={description} />

        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
