import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { ChevronLeft, Save, Loader2, MoreVertical, CheckCircle, Download } from 'lucide-react';
import { noteEditorAPI } from '../../api/noteEditor';
import { ConceptExtension } from './extensions/ConceptExtension';
import { ImportedContentExtension } from './extensions/ImportedContentExtension';
import { LatexExtension } from './extensions/LatexExtension';
import { ImageResizeExtension } from './extensions/ImageResizeExtension';
import EditorToolbar from './EditorToolbar';
import ConceptExplanations from './components/ConceptExplanations';
import ModeSelectionDialog from './components/ModeSelectionDialog';
import RightPanel from './components/RightPanel/RightPanel';
import DownloadDialog from './components/DownloadDialog';
import './NoteEditor.css';

interface Concept {
  concept: string;
  explanation: string;
  tag: string;
  text?: string;
  mode?: 'fast' | 'normal' | 'pro';
}

const NoteEditor = () => {
  const { noteId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ from: number; to: number } | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('user_id');
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
      ImageResizeExtension.configure({
        minWidth: 100,
        maxWidth: 1000,
      }),
      ConceptExtension,
      ImportedContentExtension,
      LatexExtension,
    ],
    onCreate({ editor }) {
      editor.on('selectionUpdate', ({ editor }) => {
        const selection = editor.state.selection;
        const node = selection.$anchor.parent;
        if (node.type.name === 'image') {
          const element = document.querySelector(`img[src="${node.attrs.src}"]`);
          if (element) {
            element.classList.add('selected');
          }
        }
      });
    },
  });

  useEffect(() => {
    const loadContent = async () => {
      if (!userId || !noteId || !editor) return;

      try {
        const [contentResponse, explanationsResponse] = await Promise.all([
          noteEditorAPI.getFileInfo(userId, noteId),
          noteEditorAPI.getConceptExplanations(userId, noteId)
        ]);
        
        if (contentResponse.success && contentResponse.content) {
          editor.commands.setContent(contentResponse.content);
        } else {
          setError(contentResponse.error || 'Failed to load content');
        }

        if (explanationsResponse.success && explanationsResponse.explanations) {
          setConcepts(explanationsResponse.explanations);
        }
      } catch (error) {
        setError('Error loading content');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [editor, userId, noteId]);

  // Set up auto-save
  useEffect(() => {
    if (!editor) return;

    // Clear any existing interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    // Set up new auto-save interval
    autoSaveIntervalRef.current = setInterval(() => {
      handleSave();
    }, 30000); // 30 seconds

    // Cleanup on unmount
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [editor]);

  const handleSave = async () => {
    if (!editor || !userId || !noteId || isSaving) return;
    
    setIsSaving(true);
    try {
      const content = editor.getHTML();
      const response = await noteEditorAPI.saveFile(userId, noteId, content);
      
      if (response.success) {
        setSaveSuccess(true);
        
        if (saveButtonRef.current) {
          saveButtonRef.current.classList.add('text-green-500');
          setTimeout(() => {
            saveButtonRef.current?.classList.remove('text-green-500');
            setSaveSuccess(false);
          }, 2000);
        }
      } else {
        setError(response.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setError('Error saving content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateExplanation = async (mode: 'fast' | 'normal' | 'pro') => {
    if (!editor || !pendingSelection) return;

    const { from, to } = pendingSelection;
    setPendingSelection(null);

    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch('https://backend-aec-experimental.onrender.com/note/generate_concept_explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || '',
          filename: noteId ? `${noteId}.md` : 'untitled.md',
          concept: selectedText.trim(),
          occurrence: 1,
          mode: mode
        }),
      });

      const data = await response.json();
      
      if (data.success && data.tag) {
        editor
          .chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('concept', { 
            tag: data.tag,
            mode: mode
          })
          .run();

        const newConcept = {
          concept: selectedText.trim(),
          explanation: data.explanation || '',
          tag: data.tag,
          mode: mode
        };

        setConcepts(prev => [...prev, newConcept]);

        if (mode !== 'fast') {
          setSelectedConcept(newConcept);
        }

        handleSave();
      }
    } catch (error) {
      console.error('Error generating concept explanation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConceptClick = (concept: Concept) => {
    setSelectedConcept(concept);
  };

  const initiateConceptGeneration = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) return;

    setPendingSelection({ from, to });
    setShowModeDialog(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => navigate('/notes')}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="h-16 flex items-center px-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/notes')}
              className="hover:bg-gray-100 rounded-full p-2 transition-colors"
              title="Back to notes"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h1 className="text-xl font-semibold text-gray-800 font-quicksand">
              {noteId}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowDownloadDialog(true)}
              className="hover:bg-gray-100 rounded-full p-2 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              ref={saveButtonRef}
              onClick={handleSave}
              disabled={isSaving}
              className="hover:bg-gray-100 rounded-full p-2 transition-colors disabled:opacity-50"
              title={isSaving ? "Saving..." : "Save"}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              ) : saveSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Save className="w-5 h-5 text-gray-600 transition-colors duration-200" />
              )}
            </button>
            <button className="hover:bg-gray-100 rounded-full p-2 transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <EditorToolbar
          editor={editor}
          onGenerateExplanation={initiateConceptGeneration}
          isGenerating={isGenerating}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="relative">
              <div ref={editorRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <EditorContent editor={editor} className="prose max-w-none" />
              </div>
              <ConceptExplanations 
                concepts={concepts} 
                editorRef={editorRef}
                onConceptClick={handleConceptClick}
              />
            </div>
          )}
        </div>
      </div>

      <ModeSelectionDialog
        isOpen={showModeDialog}
        onClose={() => {
          setShowModeDialog(false);
          setPendingSelection(null);
        }}
        onSelect={handleGenerateExplanation}
      />

      <RightPanel
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />

      <DownloadDialog
        isOpen={showDownloadDialog}
        onClose={() => setShowDownloadDialog(false)}
        content={editor?.getHTML() || ''}
        fileName={noteId || 'untitled'}
      />
    </div>
  );
};

export default NoteEditor;