import { useState } from 'react';
import { Languages, LogIn, MoreVertical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../../../components/main/leftsidebar/LeftSidebar';
import CreateWorkspaceModal from '../../../components/main/modals/createWorkspaceModal';
import './LandingPage.css';
import DecryptedText from '../../../components/main/decryptedText/decryptedText';
import Squares from '../../../components/main/background/Squares';
import TiltedCard from '../../../components/main/tiltedCard/TiltedCard';
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
      <LeftSidebar />

      <main className="main-content">
        <Squares
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#222'
        />
        <header className="header">
          <div className="header-actions">
            <div className="logo-container">
              <img
                src="/main/landing_page/hyperknow_logo_with_text.svg"
                alt="Hyperknow"
                className="header-logo"
              />
            </div>
            <button className="translate-button">
              <Languages size={20} />
            </button>
            <button className="login-button">
              <LogIn size={20} />
            </button>
          </div>
        </header>

        <div className="hero-section">
          <DecryptedText
            text="Good Evening! Yilin"
            animateOn="view"
            revealDirection="center"
            speed={70}
            parentClassName="text-4xl"
            className="text-4xl"
          />
          {/* <h1>Good Evening! Yilin</h1> */}
          <DecryptedText
            text="Select a workspace to start, or just learn out of your curiosity"
            animateOn="view"
            revealDirection="center"
            speed={70}
            parentClassName="text-4xl"
            className="text-4xl"
          />
          {/* <p>Select a workspace to start, or just learn out of your curiosity</p> */}
        </div>

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