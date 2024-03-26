import { useSyncExternalStore } from 'react'
import SettingsPage from './pages/SettingsPage'
import Notification from './components/Notification'
import WithNavLayout from './layouts/WithNav'
import MenusPage from './pages/MenusPage'
import LogsPage from './pages/LogsPage'
import QuickMenu from './pages/QuickMenu'

const routes = {
  settings: <SettingsPage />,
  menus: <MenusPage />,
  logs: <LogsPage />
}

function App(): JSX.Element {
  const hash = useSyncExternalStore(subscribeHash, getHash)
  const children = <WithNavLayout>{routes[hash + '' || 'settings']}</WithNavLayout>
  if (hash === 'quick-menu') {
    return <QuickMenu />
  }
  return <Notification>{children}</Notification>
}

export default App

function subscribeHash(onStoreChange: () => void): () => void {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}

function getHash(): unknown {
  return location.hash.replace(/^#/, '')
}
