import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, Languages, PlusIcon, Search } from 'lucide-react';

import './LandingPage.css';
import Sidebar from '../../../components/main/sidebar/Sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Card } from '../../../components/ui/card';
import ProjectDirectory from '../../../components/main/projectDirectory/ProjectDirectory';
import { ShiftingDropDown } from '../../../components/main/dropdown/DropDown';
import CreateWorkspaceModal from '../../../components/main/modals/createWorkspaceModal';

function LandingPage() {
  const allTabs = [
    {
      id: "project-directory",
      name: "Project Directory",
    },
    {
      id: "shared-projects",
      name: "Shared Projects",
    },
    {
      id: "published-projects",
      name: "Published Projects",
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string>("All Projects");
  const [selectedTime, setSelectedTime] = useState<string>("All Time");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const projectNames = [
    "All Projects",
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Literature",
    "History",
    "Philosophy"
  ];

  const timeFilters = [
    "All Time",
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days"
  ];

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);


  const handleCreateWorkspace = (data: any) => {
    console.log('Creating workspace with data:', data);
    setIsModalOpen(false);
  };

  return (
    <div className="flex bg-[#f7f6f6] min-h-screen">

      <Sidebar />
      <main className="flex-1 flex flex-col">

        <header className="header">
          <div className="header-actions">
            <p className="font-['IBM_Plex_Sans',Helvetica] text-[22px]"> My Workspaces</p>
            <div className='flex justify-between gap-3'>
              <button className="p-2 hover:scale-105 transition-transform">
                <Languages className="w-6 h-6" />
              </button>

              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-[20px] border-[#bcbcbc] h-[45px] px-2"
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <Avatar className="w-[30px] h-[30px] ">
                        <AvatarImage
                          src="/main/landing_page/avatars.png"
                          alt="John Doe"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span className="font-['IBM_Plex_Sans',Helvetica] text-base">
                        John Doe
                      </span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='dropdown-content'>
                  <DropdownMenuItem className='dropdown-item'>Profile</DropdownMenuItem>
                  <DropdownMenuItem className='dropdown-item'>Settings</DropdownMenuItem>
                  <DropdownMenuItem className='dropdown-item'>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </header>

        <Card className="flex-1 rounded-tl-[20px] rounded-tr-none rounded-br-none rounded-bl-none shadow-none border-none">
          <div className="flex justify-between p-4">
            {/* Tabs */}
            <div className="flew-row relative  flex h-auto p-3 rounded-3xl bg-transparent px-2 backdrop-blur-sm">
              <span
                className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
                style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
              >
                <span className="h-full w-full rounded-3xl bg-[#D9D9D9]" />
              </span>
              {allTabs.map((tab, index) => {

                return (
                  <button
                    key={index}
                    ref={(el) => (tabsRef.current[index] = el)}
                    className={`my-auto cursor-pointer select-none rounded-full px-4 text-center font-['IBM_Plex_Sans',Helvetica] text-black text-sm`}
                    onClick={() => setActiveTabIndex(index)}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[29px] min-w-[113px] max-w-[200px] bg-white border-[#949494] rounded-lg flex items-center justify-between px-2"
                  >
                    <span className="text-sm text-gray-600 truncate">{selectedProject}</span>
                    <ChevronDownIcon className="w-4 h-4 flex-shrink-0 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dropdown-content">
                  {projectNames.map((name, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setSelectedProject(name)}
                      className="dropdown-item"
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-[29px] min-w-[113px] max-w-[200px] bg-white border-[#949494] rounded-lg flex items-center justify-between px-2"
                  >
                    <span className="text-sm text-gray-600 truncate">{selectedTime}</span>
                    <ChevronDownIcon className="w-4 h-4 flex-shrink-0 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dropdown-content">
                  {timeFilters.map((time, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className="dropdown-item"
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative h-[29px] w-[219px]">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-full w-full bg-white border-[#949494] rounded-lg pl-8 pr-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <ShiftingDropDown
                trigger={
                  <>
                    <PlusIcon className="w-[17px] h-[18px] mr-1" />
                    Create
                  </>
                }
                items={[
                  { title: "New Project", onClick: () => setIsModalOpen(true) },
                  { title: "New Folder", onClick: () => console.log("New Folder") },
                  { title: "New Document", onClick: () => console.log("New Document") }
                ]}
              />
            </div>
          </div>

          {/* Content sections */}
          <ProjectDirectory
            selectedProject={selectedProject}
            selectedTime={selectedTime}
            searchQuery={searchQuery}
            activeTab={activeTabIndex !== null ? allTabs[activeTabIndex].id : "project-directory"}
          />
        </Card>
        {/* <section className="workspace-section">
          <div className="workspace-header">
            <h2>My Workspace</h2>
            <div className="workspace-actions">
              <button className="btn-new-folder">
                <span>New Folder</span>
              </button>
              <button
                className="btn-create-workspace"
                onClick={() => setIsModalOpen(true)}
              >
                <span>Create Workspace</span>
              </button>
              <button className="btn-more">⋮</button>
            </div>
          </div>


          <div className="workspace-cards">
            {[1, 2, 1, 2, 1].map((imgNum, index) => (
              <div
                key={index}
                className="workspace-card"
                onClick={() => navigate('/workspace')}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url('/workspace/dafult_cover/project_img_${imgNum}.png')`
                  }}
                ></div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>Project {index + 1}</h3>
                    <button
                      className="card-more-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <p className="description">A fascinating project to explore and learn from.</p>
                </div>
              </div>
            ))}

            <div
              className="workspace-card new-project-card"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={32} className="new-project-icon" />
              <span className="new-project-text">Create New Workspace</span>
            </div>
          </div>
        </section> */}
      </main>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkspace}
      />
    </div>
  );
}

export default LandingPage;