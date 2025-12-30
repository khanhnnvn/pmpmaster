
import React, { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNavigate = (newView: AppView) => {
    setView(newView);
  };

  if (view === 'landing') {
    return <Landing onLogin={() => setView('dashboard')} />;
  }

  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-4xl">construction</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-text-muted">Tính năng này đang được phát triển. Vui lòng quay lại sau!</p>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-200">
      <Sidebar currentView={view} navigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header 
          view={view} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-10">
            {view === 'dashboard' && <Dashboard />}
            {view === 'projects' && <ProjectList onProjectClick={() => setView('project-detail')} />}
            {view === 'project-detail' && <ProjectDetail />}
            {view === 'settings' && <Settings />}
            {view === 'tasks' && <PlaceholderView title="Quản lý công việc" />}
            {view === 'team' && <PlaceholderView title="Quản lý đội ngũ" />}
            {view === 'reports' && <PlaceholderView title="Báo cáo & Phân tích" />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
