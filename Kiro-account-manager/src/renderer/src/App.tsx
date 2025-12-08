import { useState, useEffect } from 'react'
import { AccountManager } from './components/accounts'
import { Sidebar, type PageType } from './components/layout'
import { HomePage, AboutPage, SettingsPage, MachineIdPage } from './components/pages'
import { useAccountsStore } from './store/accounts'

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  
  const { loadFromStorage, startAutoTokenRefresh, stopAutoTokenRefresh } = useAccountsStore()
  
  // 应用启动时加载数据并启动自动刷新
  useEffect(() => {
    loadFromStorage().then(() => {
      startAutoTokenRefresh()
    })
    
    return () => {
      stopAutoTokenRefresh()
    }
  }, [loadFromStorage, startAutoTokenRefresh, stopAutoTokenRefresh])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'accounts':
        return <AccountManager />
      case 'machineId':
        return <MachineIdPage />
      case 'settings':
        return <SettingsPage />
      case 'about':
        return <AboutPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="h-screen bg-background flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
