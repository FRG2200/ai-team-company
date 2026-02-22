import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
