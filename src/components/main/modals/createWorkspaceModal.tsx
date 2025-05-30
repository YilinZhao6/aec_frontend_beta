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

  // Sample tag data for mapping
  const tagColors = [
    "bg-[#60adff]",
    "bg-[#72b17b]",
    "bg-[#ffcc58]",
    "bg-[#ff6b6b]",
    "bg-[#9c6bff]",
    "bg-[#ff9c6b]",
  ];

  // Sample cover images data for mapping
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
      <div className="w-full max-w-[800px] h-[500px] pt-4 pb-6 px-6 mx-auto overflow-hidden overflow-y-scroll font-['IBM_Plex_Sans',Helvetica] bg-white rounded-[10px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <button className="w-full flex flex-col " onClick={onClose}><X className="self-end" /></button>
        <div className="flex flex-col items-center mb-6 ">
          <h2 className="text-2xl font-normal text-black">
            Create New Workspace
          </h2>
          <p className="text-lg text-[#898989] text-center max-w-[485px] mt-2">
            Workspaces are where you have your study materials organized by
            subject, topic, or your interest
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 px-4">
          {/* Workspace Name Field */}
          <div className="space-y-2">
            <label className="text-lg font-normal">
              Workspace Name <span className="text-[#e72a2a]">*</span>
            </label>
            <Input
              className="h-[50px] rounded-[20px] border-2 border-[#e2e2e2] px-4  placeholder:text-[20px] "
              placeholder="Name your workspace"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Select Profile Field */}
          <div className="space-y-2">
            <label className="text-lg font-normal">
              Select Profile <span className="text-[#e72a2a]">*</span>
            </label>
            <div className="">
              <Select onValueChange={(value) => handleInputChange('description', value)}>
                <SelectTrigger className="h-[50px] rounded-[20px] border-2 border-[#e2e2e2] flex items-center px-4 text-[20px]">
                  <SelectValue placeholder=" Create New Profile" />
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

        {/* Tags Section */}
        <div className="mt-6 px-4">
          <label className="text-lg font-normal block mb-2">
            Tags (Optional)
          </label>
          <Input
            className="h-[50px] rounded-[20px] border-2 border-[#e2e2e2] px-4 text-xl text-[#898989]"
            placeholder='Type and press Enter to add tags'
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyPress={handleTagKeyPress}
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {formData.tags.map((tag, index) => (
              <Badge
                variant="outline"
                key={index}
                className={`${tagColors[index % tagColors.length]} text-white text-xl py-1 px-3 h-10 rounded-[20px] cursor-pointer   transition-transform hover:scale-105 `}
                onClick={() => removeTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Collaborator Section */}
        <div className="mt-6 px-4">
          <label className="text-lg font-normal block mb-2">
            Collaborator (Optional)
          </label>
          <Input
            className="h-[50px] rounded-[20px] border-2 border-[#e2e2e2] px-4 text-xl text-[#898989]"
            placeholder="Invite collaborator"
            value={formData.background}
            onChange={(e) => handleInputChange('background', e.target.value)}
          />
        </div>

        {/* Workspace Cover Section */}
        <div className="mt-6 px-4">
          <label className="text-lg font-normal block mb-2">
            Select Workspace Cover
          </label>

          <div className="grid grid-cols-3 gap-4">
            <Card className="w-[194px] h-[130px] bg-[#f4f4f4] rounded-[5px] border-2 border-[#d9d9d9] flex flex-col items-center justify-center">
              <UploadCloudIcon className="w-12 h-12 mb-2" />
              <p className="text-base text-[#898989]">Upload from computer</p>
            </Card>

            {coverImages.map((image) => (
              <div
                key={image.id}
                className="w-[194px] h-[130px] cursor-pointer"
                onClick={() => handleInputChange('coverImage', image.src)}
              >
                <img
                  className="w-full h-full object-cover rounded-[5px]"
                  alt={image.alt}
                  src={image.src}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <Button
            className="bg-[#EDECEC] rounded-[17px] font-['IBM_Plex_Sans',Helvetica] text-[1.2rem] font-normal text-black w-[108px] h-[45px] self-end hover:bg-[#447af0] hover:text-white"
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