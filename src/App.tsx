import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/main/landing_page/LandingPage';
import DefaultPage from './pages/workspaceView/DefaultPage/DefaultPage';
import NoteEditorPage from './pages/workspaceView/utilPage/noteEditor/NoteEditorPage';
import NoteExplorer from './pages/workspaceView/explorerPages/NoteExplorer/NoteExplorer';
import DeepResearchPage from './pages/workspaceView/utilPage/deepResearchPage/DeepResearchPage';
import SolverPage from './pages/workspaceView/utilPage/solverPage/SolverPage';
import DrivePage from './pages/workspaceView/utilPage/drivePage/DrivePage';
import SummaryPage from './pages/workspaceView/utilPage/summaryPage/SummaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<DefaultPage />} />
        <Route path="/workspace/files" element={<DefaultPage />} />
        <Route path="/workspace/other" element={<DefaultPage />} />
        <Route path="/workspace/note" element={<NoteEditorPage />} />
        <Route path="/workspace/notes" element={<NoteExplorer />} />
        <Route path="/workspace/research" element={<DeepResearchPage />} />
        <Route path="/workspace/solver" element={<SolverPage />} />
        <Route path="/workspace/drive" element={<DrivePage />} />
        <Route path="/workspace/summary" element={<SummaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;