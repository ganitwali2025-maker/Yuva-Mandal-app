import React, { createContext, useState, useEffect } from 'react';
import { getLocalDB, getSettings, saveSettings, saveCache, syncAll, initializeDefaults } from '../api/backend';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [db, setDb] = useState(getLocalDB());
  const [settings, setSettings] = useState(() => initializeDefaults());
  const [connState, setConnState] = useState(settings.scriptUrl ? 'connecting' : 'offline');
  const [toast, setToast] = useState('');

  // Initial sync on mount
  useEffect(() => {
    if (settings.scriptUrl) {
      performSync();
    }
  }, []);

  const performSync = async () => {
    setConnState('connecting');
    const result = await syncAll(settings.scriptUrl);
    setConnState(result.connState);
    setDb(result.db);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const addRow = async (type, data) => {
    const result = await pushRow(settings.scriptUrl, type, data);
    if (result.ok) {
      if (settings.scriptUrl) {
        await performSync();
      } else {
        const updatedDb = getLocalDB();
        setDb(updatedDb);
      }
    }
    return result;
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  const value = {
    db,
    settings,
    connState,
    toast,
    setDb,
    updateSettings,
    addRow,
    showToast,
    performSync,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Import pushRow to fix dependency issue
import { pushRow } from '../api/backend';
