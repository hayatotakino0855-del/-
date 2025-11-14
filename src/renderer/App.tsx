import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainControl from './windows/MainControl';
import TeleopBar from './windows/TeleopBar';
import MessageEditor from './windows/MessageEditor';
import Settings from './windows/Settings';
import LogViewer from './windows/LogViewer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainControl />} />
        <Route path="/teleop-bar" element={<TeleopBar />} />
        <Route path="/message-editor" element={<MessageEditor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/log-viewer" element={<LogViewer />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
