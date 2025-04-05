import React from 'react';
import { BookOpen } from 'lucide-react';
import { sectionsAPI } from '../../../../api/markdownViewer/sections';

interface Section {
  id: string;
  title: string;
  isComplete: boolean;
  children?: Section[];
}

interface DocumentSectionsPanelProps {
  userId: string;
  conversationId: string;
  isArchiveView: boolean;
}

const DocumentSectionsPanel: React.FC<DocumentSectionsPanelProps> = ({ 
  userId, 
  conversationId, 
  isArchiveView 
}) => {
  const [sections, setSections] = React.useState<Section[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSections = async () => {
      if (!userId || !conversationId) return;

      try {
        const response = await sectionsAPI.getSections(userId, conversationId);
        if (response.sections) {
          setSections(response.sections);
        } else {
          setError('Failed to load sections');
        }
      } catch (err) {
        setError('Error loading sections');
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [userId, conversationId]);

  const renderSection = (section: Section, level: number = 0) => (
    <div 
      key={section.id}
      className={`pl-${level * 4} py-2`}
    >
      <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors
        ${section.isComplete ? 'text-gray-900' : 'text-gray-500'}
        hover:bg-gray-100`}
      >
        <BookOpen size={16} />
        <span className="font-quicksand text-sm">{section.title}</span>
      </div>
      {section.children?.map(child => renderSection(child, level + 1))}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 text-gray-500 font-quicksand">
        Loading sections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 font-quicksand">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0F0] border border-[#CCCCCC] rounded-lg overflow-hidden w-full">
      <div className="bg-[#F0F0F0] p-3 border-b border-[#CCCCCC]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 font-quicksand">
            Document Sections
          </span>
        </div>
      </div>
      <div className="p-2 max-h-[calc(100vh-120px)] overflow-y-auto">
        {sections.map(section => renderSection(section))}
      </div>
    </div>
  );
};

export default DocumentSectionsPanel;