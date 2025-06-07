import React from 'react'
import {
  ArrowLeftIcon,
  MoreHorizontalIcon,
  Plus,
  SearchIcon,
  Share2Icon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";

import { Tab } from '../../components/ui/tab';
import { MainContent } from '../../components/projectPage/TabContent';

interface TabData {
  id: string;
  title: string;
}

function WorkspacePage() {
  const [tabs, setTabs] = useState<TabData[]>([{ id: "1", title: "New tab" }]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: "New tab",
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (tabId === activeTabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const selectTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    if (!draggedTabId || draggedTabId === targetTabId) return;

    const draggedTabIndex = tabs.findIndex(tab => tab.id === draggedTabId);
    const targetTabIndex = tabs.findIndex(tab => tab.id === targetTabId);

    const newTabs = [...tabs];
    const [draggedTab] = newTabs.splice(draggedTabIndex, 1);
    newTabs.splice(targetTabIndex, 0, draggedTab);

    setTabs(newTabs);
    setDraggedTabId(null);
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
          <div className="justify-center flex items-center">
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
        <div className="absolute w-full  top-[53px] left-1.5">
          <div className="absolute w-full h-[1026px] top-0 left-0">
            {/* Main container */}
            <div className="absolute w-full h-[1026px] top-0 left-9 bg-white rounded-[8px_0px_0px_0px] border border-solid border-[#e2e2e2]">
              {/* Tab bar */}
              <div className="flex h-8 border-b border-[#e2e2e2] rounded-[8px_0px_0px_0px]">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    title={tab.title}
                    tabId={tab.id}
                    isActive={tab.id === activeTabId}
                    onClose={() => closeTab(tab.id)}
                    onClick={() => selectTab(tab.id)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 h-8"
                  onClick={addTab}
                >
                  <Plus />
                </Button>
              </div>

              {/* Tab content */}
              <MainContent tabId={activeTabId} />
            </div>

            {/* More options button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2.5 left-[1885px] p-0 h-auto"
            >
              <MoreHorizontalIcon className="w-4 h-4" />
            </Button>

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