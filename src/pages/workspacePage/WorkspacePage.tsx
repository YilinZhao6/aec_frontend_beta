import React from 'react'
import {
  ArrowLeftIcon,
  ColumnsIcon,
  MoreHorizontalIcon,
  Plus,
  SearchIcon,
  Share2Icon,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Tab } from '../../components/ui/tab';
import { MainContent } from '../../components/projectPage/TabContent';

interface TabData {
  id: string;
  title: string;
}

interface PanelData {
  id: string;
  tabs: TabData[];
  activeTabId: string;
}

interface WindowData {
  id: string;
  panels: PanelData[];
  isActive: boolean;
}

function WorkspacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [workspaceTitle, setWorkspaceTitle] = useState("WORKSPACE NAME");
  const [dragOverPanelId, setDragOverPanelId] = useState<string | null>(null);
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: Date.now().toString(),
      panels: [{
        id: Date.now().toString(),
        tabs: [{ id: "1", title: "New tab" }],
        activeTabId: "1"
      }],
      isActive: true
    }
  ]);

  useEffect(() => {
    const title = searchParams.get('title');
    if (title) {
      setWorkspaceTitle(title);
    }
  }, [searchParams]);

  const addWindow = () => {
    const newWindow = {
      id: Date.now().toString(),
      panels: [{
        id: Date.now().toString(),
        tabs: [{ id: Date.now().toString(), title: "New tab" }],
        activeTabId: Date.now().toString()
      }],
      isActive: true
    };
    setWindows(windows.map(w => ({ ...w, isActive: false })).concat(newWindow));
  };

  const activateWindow = (windowId: string) => {
    setWindows(windows.map(window => ({
      ...window,
      isActive: window.id === windowId
    })));
  };

  const addTab = (windowId: string, panelId: string) => {
    setWindows(windows.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          panels: window.panels.map(panel => {
            if (panel.id === panelId) {
              const newTab = {
                id: Date.now().toString(),
                title: "New tab",
              };
              return {
                ...panel,
                tabs: [...panel.tabs, newTab],
                activeTabId: newTab.id
              };
            }
            return panel;
          })
        };
      }
      return window;
    }));
  };

  const closeTab = (windowId: string, panelId: string, tabId: string) => {
    setWindows(windows.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          panels: window.panels.map(panel => {
            if (panel.id === panelId) {
              if (panel.tabs.length === 1) {
                if (window.panels.length > 1) {
                  return null;
                }
                return panel;
              }
              const newTabs = panel.tabs.filter((tab) => tab.id !== tabId);
              return {
                ...panel,
                tabs: newTabs,
                activeTabId: tabId === panel.activeTabId ? newTabs[newTabs.length - 1].id : panel.activeTabId
              };
            }
            return panel;
          }).filter(Boolean) as PanelData[]
        };
      }
      return window;
    }));
  };

  const selectTab = (windowId: string, panelId: string, tabId: string) => {
    setWindows(windows.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          panels: window.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                activeTabId: tabId
              };
            }
            return panel;
          })
        };
      }
      return window;
    }));
  };

  const toggleSplitScreen = (windowId: string) => {
    setWindows(windows.map(window => {
      if (window.id === windowId) {
        if (window.panels.length === 1) {
          return {
            ...window,
            panels: [
              window.panels[0],
              {
                id: Date.now().toString(),
                tabs: [{ id: Date.now().toString(), title: "New tab" }],
                activeTabId: Date.now().toString()
              }
            ]
          };
        } else {
          return {
            ...window,
            panels: [window.panels[0]]
          };
        }
      }
      return window;
    }));
  };

  const closePanel = (windowId: string, panelId: string) => {
    setWindows(windows.map(window => {
      if (window.id === windowId) {
        if (window.panels.length === 1) return window;

        // find the panel to close and the remaining panel
        const panelToClose = window.panels.find(p => p.id === panelId);
        const remainingPanel = window.panels.find(p => p.id !== panelId);

        if (!panelToClose || !remainingPanel) return window;

        // merge tabs
        return {
          ...window,
          panels: [{
            ...remainingPanel,
            tabs: [...remainingPanel.tabs, ...panelToClose.tabs],
            activeTabId: remainingPanel.activeTabId
          }]
        };
      }
      return window;
    }));
  };

  const handleDragStart = (e: React.DragEvent, panelId: string, tabId: string) => {
    e.dataTransfer.setData('panelId', panelId);
    e.dataTransfer.setData('tabId', tabId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, panelId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (panelId) {
      setDragOverPanelId(panelId);
    }
  };

  const handleDragLeave = () => {
    setDragOverPanelId(null);
  };

  const handleDrop = (e: React.DragEvent, targetPanelId: string, targetTabId: string) => {
    e.preventDefault();
    setDragOverPanelId(null);
    const sourcePanelId = e.dataTransfer.getData('panelId');
    const sourceTabId = e.dataTransfer.getData('tabId');

    if (sourcePanelId === targetPanelId && sourceTabId === targetTabId) return;

    setWindows(windows.map(window => {
      if (window.isActive) {
        const sourcePanel = window.panels.find(p => p.id === sourcePanelId);
        const targetPanel = window.panels.find(p => p.id === targetPanelId);

        if (!sourcePanel || !targetPanel) return window;

        if (sourcePanel.tabs.length === 1) {
          return {
            ...window,
            panels: [{
              ...targetPanel,
              tabs: [...targetPanel.tabs, ...sourcePanel.tabs],
              activeTabId: targetPanel.activeTabId
            }]
          };
        }

        const isDroppingOnPanel = !targetPanel.tabs.some(tab => tab.id === targetTabId);
        const targetTabIndex = isDroppingOnPanel
          ? targetPanel.tabs.length
          : targetPanel.tabs.findIndex(tab => tab.id === targetTabId);

        return {
          ...window,
          panels: window.panels.map(panel => {
            if (panel.id === sourcePanelId) {
              if (panel.id === targetPanelId) return panel;
              const sourceTab = panel.tabs.find(tab => tab.id === sourceTabId);
              if (!sourceTab) return panel;
              return {
                ...panel,
                tabs: panel.tabs.filter(tab => tab.id !== sourceTabId)
              };
            }
            if (panel.id === targetPanelId) {
              const sourceTab = sourcePanel.tabs.find(tab => tab.id === sourceTabId);
              if (!sourceTab) return panel;
              const newTabs = [...panel.tabs];
              newTabs.splice(targetTabIndex, 0, sourceTab);
              return {
                ...panel,
                tabs: newTabs,
                activeTabId: sourceTab.id
              };
            }
            return panel;
          })
        };
      }
      return window;
    }));
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[calc(100%-38px)] h-auto">
        <div className="flex flex-row justify-between items-center align-middle mt-[11px]">
          <Button
            variant="ghost"
            size="icon"
            className="ml-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <div className="justify-center flex items-center ml-[400px]">
            <h1 className="font-normal text-xl text-black font-['Outfit',Helvetica]">
              {workspaceTitle}
            </h1>
            <div className="ml-[15px] bg-[#ecf1f6] rounded-[5px] px-2 py-1">
              <span className="font-medium text-[11px] text-[#6b6b6b] font-['Inter',Helvetica] flex items-center">
                Workspace
              </span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center align-middle mr-8">
            <Button variant="ghost" size="icon" className="p-0 h-auto mr-4">
              <Share2Icon className="w-8 h-8" />
            </Button>
            <div className="w-[300px] h-8 bg-[#ecf1f6] rounded-md flex items-center px-2.5">
              <SearchIcon className="w-6 h-6" />
              <span className="ml-[11px] font-normal text-xs text-[#6f6f6f] font-['Inter',Helvetica]">
                Spotlight Search
              </span>
            </div>
          </div>
        </div>

        <div className="absolute w-full top-[53px] left-1.5">
          <div className="absolute w-full h-[1026px] top-0 left-0">
            <div className="absolute w-[calc(100%-38px)] h-[1026px] top-0 left-9 bg-white rounded-[8px_0px_0px_0px] border border-solid border-[#e2e2e2]">
              {windows.map((window) => (
                <div key={window.id} className={`${window.isActive ? 'block' : 'hidden'}`}>
                  <div className={`flex h-full ${window.panels.length === 2 ? 'divide-x divide-[#e2e2e2]' : ''}`}>
                    {window.panels.map((panel) => (
                      <div key={panel.id} className={`flex flex-col ${window.panels.length === 2 ? 'w-1/2' : 'w-full'}`}>
                        <div className="flex h-8 border-b border-[#e2e2e2] rounded-[8px_0px_0px_0px]">
                          <div className="flex h-8 border-b border-[#e2e2e2] rounded-[8px_0px_0px_0px] grow w-[calc(100%-100px)] overflow-hidden">
                            <div className="flex h-8 overflow-x-auto w-full scrollbar-hide">
                              {panel.tabs.map((tab) => (
                                <Tab
                                  key={tab.id}
                                  title={tab.title}
                                  tabId={tab.id}
                                  isActive={tab.id === panel.activeTabId}
                                  onClose={() => closeTab(window.id, panel.id, tab.id)}
                                  onClick={() => selectTab(window.id, panel.id, tab.id)}
                                  onDragStart={(e) => handleDragStart(e, panel.id, tab.id)}
                                  onDragOver={(e) => handleDragOver(e, panel.id)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, panel.id, tab.id)}
                                />
                              ))}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="p-1 h-7 self-center ml-1 flex-shrink-0"
                                onClick={() => addTab(window.id, panel.id)}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </div>
                          <div className="flex self-center w-[100px] mr-2 flex-shrink-0">
                            {window.panels.length === 2 ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 text-white bg-[#F87D7D] ml-[60px] rounded-full p-0 flex items-center justify-center hover:bg-white hover:text-[#F87D7D]"
                                onClick={() => closePanel(window.id, panel.id)}
                              >
                                <X className="w-2 h-2" />
                              </Button>
                            ) : (
                              <div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="p-0 h-7"
                                  onClick={() => toggleSplitScreen(window.id)}
                                >
                                  <ColumnsIcon className="w-6 h-6" />
                                </Button>
                                <Button variant="ghost" size="icon" className="p-0 h-7">
                                  <MoreHorizontalIcon className="w-6 h-6" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="flex-1 relative"
                          onDragOver={(e) => handleDragOver(e, panel.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, panel.id, panel.activeTabId)}
                        >
                          {dragOverPanelId === panel.id && (
                            <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
                              <div className="bg-white/90 px-4 py-2 rounded-md shadow-lg">
                                <span className="text-sm text-gray-700">Drop tab here</span>
                              </div>
                            </div>
                          )}
                          <MainContent tabId={panel.activeTabId} isSplit={window.panels.length === 2} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute left-0 top-12 flex flex-col gap-1">
              {windows.map((window) => (
                <div
                  key={window.id}
                  className={`w-9 min-h-[95px] ${window.isActive ? 'bg-white w-[38px] border-r-2 border-r-white' : 'bg-[#e8e8e8]'} rounded-[6px_0px_0px_6px] border-t-[0.5px] border-b-[0.5px] border-l-[0.5px] border-[#e2e2e2] flex items-center justify-center cursor-pointer`}
                  onClick={() => activateWindow(window.id)}
                >
                  <div className="w-[100px] rotate-[-90.46deg] font-normal text-black text-[13px] font-['Inter',Helvetica] whitespace-nowrap">
                    New Window
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className=" w-[17px] h-[17px]  p-0 self-center mt-[10px]"
                onClick={addWindow}
              >
                <Plus />
              </Button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage