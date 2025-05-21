import { useState } from 'react';
import { ChevronDownIcon, Languages, LogIn, MoreVertical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import CreateWorkspaceModal from '../../../components/main/modals/createWorkspaceModal';
import './LandingPage.css';

import Sidebar from '../../../components/main/sidebar/Sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (index: number) => {
    console.log(`Deleting project ${index}`);
  };

  const handleCreateWorkspace = (data: any) => {
    console.log('Creating workspace with data:', data);
    setIsModalOpen(false);
  };

  return (
    <div className="landing-page">

      <Sidebar />
      <main className="main-content">

        <header className="header">
          <div className="header-actions">
            <p className="font-['IBM_Plex_Sans',Helvetica] text-[22px]">
              My Workspaces
            </p>
            <div>
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-[20px] border-[#bcbcbc] h-[45px] px-2"
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <Avatar className="w-[30px] h-[30px] ">
                        <AvatarImage
                          src="public/main/landing_page/avatars.png"
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
                <DropdownMenuContent className='z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'>
                  <DropdownMenuItem className='relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0'>Profile</DropdownMenuItem>
                  <DropdownMenuItem className='relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0'>Settings</DropdownMenuItem>
                  <DropdownMenuItem className='relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0'>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </header>

        <section className="workspace-section">
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
        </section>
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