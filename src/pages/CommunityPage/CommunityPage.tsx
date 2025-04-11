import React, { useState } from 'react';
import { Instagram, Linkedin, MessageSquare, Globe } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import './CommunityPage.css';

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  qrCode: string;
  color: string;
}

const platforms: SocialPlatform[] = [
  {
    name: 'Discord',
    icon: <MessageSquare className="w-8 h-8" />,
    qrCode: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=250&auto=format&fit=crop',
    color: 'bg-[#5865F2]'
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-8 h-8" />,
    qrCode: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=250&auto=format&fit=crop',
    color: 'bg-[#0077B5]'
  },
  {
    name: 'Instagram',
    icon: <Instagram className="w-8 h-8" />,
    qrCode: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=250&auto=format&fit=crop',
    color: 'bg-[#E4405F]'
  },
  {
    name: 'WeChat',
    icon: <MessageSquare className="w-8 h-8" />,
    qrCode: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=250&auto=format&fit=crop',
    color: 'bg-[#7BB32E]'
  },
  {
    name: 'Red Note',
    icon: <Globe className="w-8 h-8" />,
    qrCode: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=250&auto=format&fit=crop',
    color: 'bg-[#FF2442]'
  }
];

const CommunityPage = () => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="community-container">
        <div className="community-header">
          <h1 className="page-title">Join Our Community</h1>
          <p className="page-subtitle">Connect with us across different platforms</p>
        </div>

        <div className="platforms-grid">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className={`platform-card ${flippedCard === platform.name ? 'is-flipped' : ''}`}
              onClick={() => setFlippedCard(flippedCard === platform.name ? null : platform.name)}
            >
              <div className="card-face card-front">
                <div className={`platform-icon ${platform.color}`}>
                  {platform.icon}
                </div>
                <h3 className="platform-name">{platform.name}</h3>
              </div>
              <div className="card-face card-back">
                <img 
                  src={platform.qrCode} 
                  alt={`${platform.name} QR Code`} 
                  className="qr-code"
                />
                <p className="scan-text">Scan to Join</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;