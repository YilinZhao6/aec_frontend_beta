import { UploadCloudIcon, X } from "lucide-react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import './createWorkspaceModal.css';
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select";
import { useState } from "react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkspaceData) => void;
}

interface WorkspaceData {
  name: string;
  description: string;
  coverImage: string;
  tags: string[];
  background: string;
}

const CreateWorkspaceModal = ({ isOpen, onClose, onSubmit }: CreateWorkspaceModalProps) => {
  const [formData, setFormData] = useState<WorkspaceData>({
    name: '',
    description: '',
    coverImage: '',
    tags: [],
    background: ''
  });

  const [tagInput, setTagInput] = useState('');

  const tagColors = [
    "bg-[#60adff]",
    "bg-[#72b17b]",
    "bg-[#ffcc58]",
    "bg-[#ff6b6b]",
    "bg-[#9c6bff]",
    "bg-[#ff9c6b]",
  ];

  const coverImages = [
    { id: 1, src: "/main/landing_page/projectRectangle/rectangle-1.png", alt: "Rectangle" },
    { id: 2, src: "/main/landing_page/projectRectangle/rectangle-2.png", alt: "Rectangle" },
    { id: 3, src: "/main/landing_page/projectRectangle/rectangle-3.png", alt: "Rectangle" },
    { id: 4, src: "/main/landing_page/projectRectangle/rectangle-4.png", alt: "Rectangle" },
    { id: 5, src: "/main/landing_page/projectRectangle/rectangle-5.png", alt: "Rectangle" },
  ];

  const handleInputChange = (field: keyof WorkspaceData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="relative w-[700px] h-[500px] mx-auto bg-white rounded-[10px] overflow-hidden">
        <div className="absolute right-4 top-4 z-10">
          <button
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-[600px] mx-auto h-[calc(100%-60px)] overflow-y-auto py-8 px-4 font-['IBM Plex Sans'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-['IBM Plex Sans'] font-normal text-black">
              Create New Workspace
            </h2>
            <p className="text-sm font-['IBM Plex Sans'] text-[#898989] text-center max-w-[450px] mt-2">
              Workspaces are where you have your study materials organized by
              subject, topic, or your interest
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-['IBM Plex Sans'] font-normal">
                Workspace Name <span className="text-[#e72a2a]">*</span>
              </label>
              <Input
                className="h-[40px] rounded-[15px] border-2 border-[#e2e2e2] px-4 placeholder:text-sm font-['IBM Plex Sans']"
                placeholder="Name your workspace"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-['IBM Plex Sans'] font-normal">
                Select Profile <span className="text-[#e72a2a]">*</span>
              </label>
              <div className="">
                <Select onValueChange={(value) => handleInputChange('description', value)}>
                  <SelectTrigger className="h-[40px] rounded-[15px] border-2 border-[#e2e2e2] flex items-center px-4 text-sm font-['IBM Plex Sans']">
                    <SelectValue placeholder="Create New Profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-['IBM Plex Sans'] font-normal block mb-2">
              Tags (Optional)
            </label>
            <Input
              className="h-[40px] rounded-[15px] border-2 border-[#e2e2e2] px-4 text-sm text-[#898989] font-['IBM Plex Sans']"
              placeholder='Type and press Enter to add tags'
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <Badge
                  variant="outline"
                  key={index}
                  className={`${tagColors[index % tagColors.length]} text-white text-sm py-1 px-3 h-7 rounded-[15px] cursor-pointer transition-transform hover:scale-105 font-['IBM Plex Sans']`}
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-['IBM Plex Sans'] font-normal block mb-2">
              Collaborator (Optional)
            </label>
            <Input
              className="h-[40px] rounded-[15px] border-2 border-[#e2e2e2] px-4 text-sm text-[#898989] font-['IBM Plex Sans']"
              placeholder="Invite collaborator"
              value={formData.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-['IBM Plex Sans'] font-normal block mb-2">
              Select Workspace Cover
            </label>

            <div className="grid grid-cols-3 gap-3 pr-1">
              <Card className="aspect-[3/2] bg-[#f4f4f4] rounded-[5px] border-2 border-[#d9d9d9] flex flex-col items-center justify-center hover:border-[#80A5E4] transition-colors">
                <UploadCloudIcon className="w-8 h-8 mb-2" />
                <p className="text-xs text-[#898989] font-['IBM Plex Sans']">Upload from computer</p>
              </Card>

              {coverImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-[3/2] cursor-pointer overflow-hidden rounded-[5px] ${formData.coverImage === image.src
                      ? 'ring-2 ring-[#80A5E4] ring-offset-1'
                      : ''
                    }`}
                  onClick={() => handleInputChange('coverImage', image.src)}
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-[1.02]"
                    alt={image.alt}
                    src={image.src}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[60px] px-8 flex items-center justify-end bg-white border-t border-gray-100">
          <Button
            className="bg-[#80A5E4] rounded-[15px] text-sm font-['IBM Plex Sans'] font-normal text-white w-[100px] h-[36px] hover:bg-[#6B8ED4]"
            onClick={handleSubmit}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;