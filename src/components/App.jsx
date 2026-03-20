import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './Layout';
import RoadmapView from './RoadmapView';
import Dashboard from './Dashboard';
import { useProblems } from '../hooks/useProblems';
import { useTimer } from '../hooks/useTimer';
import { AppContext } from '../context/AppContext';

export default function App() {
  const problemsState = useProblems();
  const timerState = useTimer();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  return (
    <AppContext.Provider value={{ ...problemsState, timer: timerState, showCompletionModal, setShowCompletionModal }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<RoadmapView />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
