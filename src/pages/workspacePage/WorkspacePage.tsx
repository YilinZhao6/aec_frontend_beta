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
import { useState } from "react";
import { Button } from "../../components/ui/button";

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

function WorkspacePage() {
  const [panels, setPanels] = useState<PanelData[]>([
    {
      id: Date.now().toString(),
      tabs: [{ id: "1", title: "New tab" }],
      activeTabId: "1"
    }
  ]);
  console.log(panels);
  const addTab = (panelId: string) => {
    setPanels(panels.map(panel => {
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
    }));
  };

  const closeTab = (panelId: string, tabId: string) => {
    setPanels(panels.map(panel => {
      if (panel.id === panelId) {
        if (panel.tabs.length === 1) {
          // If this is the last tab in the panel and there are multiple panels,
          // close the entire panel
          if (panels.length > 1) {
            return null; // This will be filtered out
          }
          // If this is the only panel, keep the tab
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
    }).filter(Boolean) as PanelData[]); // Filter out null panels
  };

  const selectTab = (panelId: string, tabId: string) => {
    setPanels(panels.map(panel => {
      if (panel.id === panelId) {
        return {
          ...panel,
          activeTabId: tabId
        };
      }
      return panel;
    }));
  };

  const handleDragStart = (e: React.DragEvent, panelId: string, tabId: string) => {
    e.dataTransfer.setData('panelId', panelId);
    e.dataTransfer.setData('tabId', tabId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPanelId: string, targetTabId: string) => {
    e.preventDefault();
    const sourcePanelId = e.dataTransfer.getData('panelId');
    const sourceTabId = e.dataTransfer.getData('tabId');

    if (sourcePanelId === targetPanelId && sourceTabId === targetTabId) return;

    setPanels(panels.map(panel => {
      if (panel.id === sourcePanelId) {
        const sourceTab = panel.tabs.find(tab => tab.id === sourceTabId);
        if (!sourceTab) return panel;
        return {
          ...panel,
          tabs: panel.tabs.filter(tab => tab.id !== sourceTabId)
        };
      }
      if (panel.id === targetPanelId) {
        const sourceTab = panels
          .find(p => p.id === sourcePanelId)
          ?.tabs.find(tab => tab.id === sourceTabId);
        if (!sourceTab) return panel;
        const targetTabIndex = panel.tabs.findIndex(tab => tab.id === targetTabId);
        const newTabs = [...panel.tabs];
        newTabs.splice(targetTabIndex, 0, sourceTab);
        return {
          ...panel,
          tabs: newTabs
        };
      }
      return panel;
    }));
  };

  const toggleSplitScreen = () => {
    if (panels.length === 1) {
      // Split into two panels
      setPanels([
        panels[0],
        {
          id: Date.now().toString(),
          tabs: [{ id: Date.now().toString(), title: "New tab" }],
          activeTabId: Date.now().toString()
        }
      ]);
    } else {
      // Merge back to single panel
      setPanels([panels[0]]);
    }
  };

  const closePanel = (panelId: string) => {
    if (panels.length === 1) return;
    setPanels(panels.filter(panel => panel.id !== panelId));
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full h-[1080px] relative">
        <div className="flex flex-row justify-between items-center align-middle mt-[11px]">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className=" ml-8"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <div className="justify-center flex items-center ml-[400px]">
            <h1 className="font-normal text-xl text-black font-['Outfit',Helvetica]">
              WORKSPACE NAME
            </h1>
            <div className="ml-[15px] bg-[#ecf1f6] rounded-[5px] px-2 py-1">
              <span className="font-medium text-[11px] text-[#6b6b6b] font-['Inter',Helvetica]">
                Workspace
              </span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center align-middle mr-8">
            {/* Share button */}
            <Button variant="ghost" size="icon" className="p-0 h-auto mr-4"><Share2Icon className="w-8 h-8" /></Button>
            {/* Search bar */}
            <div className=" w-[300px] h-8  bg-[#ecf1f6] rounded-md flex items-center px-2.5">
              <SearchIcon className="w-6 h-6" />
              <span className="ml-[11px] font-normal text-xs text-[#6f6f6f] font-['Inter',Helvetica]">
                Spotlight Search
              </span>
            </div>
          </div>
        </div>
        {/* Main content area */}
        <div className="absolute w-full top-[53px] left-1.5">
          <div className="absolute w-full h-[1026px] top-0 left-0">
            {/* Main container */}
            <div className="absolute w-full h-[1026px] top-0 left-9 bg-white rounded-[8px_0px_0px_0px] border border-solid border-[#e2e2e2]">
              {/* Panels container */}
              <div className={`flex h-full ${panels.length === 2 ? 'divide-x divide-[#e2e2e2]' : ''}`}>
                {panels.map((panel) => (
                  <div key={panel.id} className={`flex flex-col ${panels.length === 2 ? 'w-1/2' : 'w-full'}`}>
                    {/* Tab bar */}
                    <div className="flex h-8 border-b border-[#e2e2e2] rounded-[8px_0px_0px_0px]">
                      <div className="flex h-8 border-b border-[#e2e2e2] rounded-[8px_0px_0px_0px] grow w-[calc(100%-100px)] overflow-hidden">
                        <div className="flex h-8 overflow-x-auto w-full scrollbar-hide">
                          {panel.tabs.map((tab) => (
                            <Tab
                              key={tab.id}
                              title={tab.title}
                              tabId={tab.id}
                              isActive={tab.id === panel.activeTabId}
                              onClose={() => closeTab(panel.id, tab.id)}
                              onClick={() => selectTab(panel.id, tab.id)}
                              onDragStart={(e) => handleDragStart(e, panel.id, tab.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, panel.id, tab.id)}
                            />
                          ))}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1 h-7 self-center ml-1 flex-shrink-0"
                            onClick={() => addTab(panel.id)}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>
                      <div className="flex self-center w-[100px] mr-7 flex-shrink-0">
                        {panels.length === 2 ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-0 h-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => closePanel(panel.id)}
                          >
                            <X className="w-6 h-6" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-0 h-7"
                            onClick={toggleSplitScreen}
                          >
                            <ColumnsIcon className="w-6 h-6" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="p-0 h-7">
                          <MoreHorizontalIcon className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    {/* Tab content */}
                    <MainContent tabId={panel.activeTabId} />
                  </div>
                ))}
              </div>
            </div>

            {/* Left sidebar */}
            <div className="absolute left-0 top-12 flex flex-col">
              {/* Create Note button */}
              <div className="w-9 h-[88px] bg-white rounded-[6px_0px_0px_6px] border-t-[0.5px] border-b-[0.5px] border-l-[0.5px] border-[#e2e2e2] shadow-[-1px_1px_4px_#00000040] flex items-center justify-center">
                <div className="w-[82px] rotate-[-90.46deg] font-normal text-black text-[13px] font-['Inter',Helvetica]">
                  Create Note
                </div>
              </div>

              {/* New Window button */}
              <div className="w-9 h-[91px] bg-[#e8e8e8] rounded-[8px_0px_0px_9px] flex items-center justify-center">
                <div className="w-[85px] rotate-[-90.46deg] font-normal text-black text-[13px] font-['Inter',Helvetica]">
                  New Window
                </div>
              </div>

              {/* Create Note button (second) */}
              <div className="w-9 h-[86px] bg-[#e8e8e8] rounded-[8px_0px_0px_9px] flex items-center justify-center">
                <div className="w-[82px] rotate-[-90.46deg] font-normal text-black text-[13px] font-['Inter',Helvetica]">
                  Create Note
                </div>
              </div>
            </div>

            {/* Add button in sidebar */}
            <img
              className="absolute w-[17px] h-[17px] top-[338px] left-[9px]"
              alt="Add"
              src="/add.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage