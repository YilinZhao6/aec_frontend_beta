export interface SectionResponse {
  success: boolean;
  sections?: Section[];
  error?: string;
}

export interface Section {
  id: string;
  title: string;
  isComplete: boolean;
  children?: Section[];
}

export interface MarkdownViewerProps {
  markdownContent: string;
  isComplete: boolean;
  userId: string;
  conversationId: string;
  isArchiveView: boolean;
  onBackClick: () => void;
  isLoading?: boolean;
}