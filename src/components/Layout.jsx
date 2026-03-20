import { Outlet, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Timer from './Timer';
import ThemeToggle from './ThemeToggle';
import CompletionModal from './CompletionModal';

export default function Layout() {
  const { timer, showCompletionModal } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">LeetWave</h1>
              <div className="flex gap-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  Roadmap
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {timer.isRunning && <Timer />}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      {showCompletionModal && <CompletionModal />}
    </div>
  );
}
