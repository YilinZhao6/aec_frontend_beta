import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Loader2, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import mermaid from 'mermaid';
import { customComponents } from './utils/markdownUtils';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

interface MarkdownContentProps {
  content: string;
  isLoading: boolean;
  qaComponents: { id: string; component: React.ReactNode }[];
  zoom: number;
  userId: string;
  conversationId: string;
  isComplete: boolean;
  diagramData: { diagram: string; related_topics: string[] } | null;
  isDiagramLoading: boolean;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  isLoading,
  qaComponents,
  zoom,
  userId,
  conversationId,
  isComplete,
  diagramData,
  isDiagramLoading
}) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramRenderedRef = useRef(false);
  const [diagramZoom, setDiagramZoom] = useState(100);
  const [isFullWidth, setIsFullWidth] = useState(false);

  useEffect(() => {
    if (!diagramData?.diagram || !diagramRef.current || diagramRenderedRef.current) return;

    const renderDiagram = async () => {
      try {
        // Clear previous content and reset the rendered flag
        diagramRef.current!.innerHTML = '';
        diagramRenderedRef.current = false;

        // Create a unique ID for this diagram
        const diagramId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Clean the diagram code
        const cleanDiagram = diagramData.diagram
          .replace(/^\s+|\s+$/g, '')
          .replace(/[\u200B-\u200D\uFEFF]/g, '')
          .replace(/^[\n\r]+|[\n\r]+$/g, '')
          .trim();

        // Initialize Mermaid with specific config
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Quicksand',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            rankSpacing: 50,
            nodeSpacing: 50,
            padding: 15
          },
          themeVariables: {
            fontSize: '16px',
            fontFamily: 'Quicksand',
            primaryColor: '#e5e7eb',
            primaryBorderColor: '#d1d5db',
            primaryTextColor: '#374151',
            lineColor: '#4b5563',
            secondaryColor: '#e5e7eb',
            tertiaryColor: '#e5e7eb'
          },
          themeCSS: `
            .edgeLabel { background-color: transparent; }
            .node rect { 
              fill: #e5e7eb !important;
              stroke: #d1d5db !important;
              stroke-width: 1px !important;
            }
            .node .label { 
              font-family: Quicksand !important;
              color: #374151 !important;
            }
            .edgeLabel { 
              font-family: Quicksand !important;
              color: #4b5563 !important;
            }
            g[id*="-link-"] { display: none !important; }
            .marker { display: none !important; }
            .flowchart-link { 
              stroke: #4b5563 !important;
              stroke-width: 1.5px !important;
            }
            .node .label foreignObject { overflow: visible; }
            .node foreignObject { overflow: visible; }
            .node .label div { 
              text-align: center;
              color: #374151 !important;
            }
          `
        });
        
        // Create the diagram container
        const diagramContainer = document.createElement('div');
        diagramContainer.id = diagramId;
        diagramContainer.className = 'mermaid';
        diagramContainer.textContent = cleanDiagram;
        
        // Add to DOM
        diagramRef.current!.appendChild(diagramContainer);

        // Render the diagram
        await mermaid.run({
          nodes: [diagramContainer],
          suppressErrors: true
        });

        // Mark as successfully rendered
        diagramRenderedRef.current = true;

        // Add extra cleanup for any remaining interactive elements
        const svg = diagramContainer.querySelector('svg');
        if (svg) {
          // Remove any interactive handles or markers
          svg.querySelectorAll('[id*="-link-"],[id*="-marker-"]').forEach(el => el.remove());
          
          // Ensure proper viewBox
          if (!svg.getAttribute('viewBox')) {
            const bbox = svg.getBBox();
            svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
          }
          
          // Set initial width to ensure it scales correctly
          svg.style.width = '100%';
          svg.style.height = 'auto';
          
          // Add a class to the SVG for styling
          svg.classList.add('concept-map-svg');
          
          // Apply current zoom level
          svg.style.transform = `scale(${diagramZoom / 100})`;
          svg.style.transformOrigin = 'top left';
        }
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        diagramRenderedRef.current = false;
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(renderDiagram, 100);
  }, [diagramData, diagramZoom]);

  const handleZoomIn = () => {
    setDiagramZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setDiagramZoom(prev => Math.max(prev - 10, 50));
  };

  const toggleFullWidth = () => {
    setIsFullWidth(prev => !prev);
  };

  useEffect(() => {
    if (!diagramRef.current) return;

    const svgElement = diagramRef.current.querySelector('svg');
    if (svgElement) {
      svgElement.style.transform = `scale(${diagramZoom / 100})`;
      svgElement.style.transformOrigin = 'top left';
    }
  }, [diagramZoom]);

  // Handle keyboard shortcuts for zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only apply shortcuts when diagram exists
      if (!diagramRef.current || !diagramData?.diagram) return;
      
      // Check if focus is not in an input or textarea
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).hasAttribute('contenteditable')
      )) {
        return;
      }
      
      // Ctrl + plus for zoom in
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      }
      
      // Ctrl + minus for zoom out
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
      
      // Ctrl + 0 for reset zoom
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        setDiagramZoom(100);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [diagramData]); // No need to add handleZoomIn and handleZoomOut as dependencies since they don't change

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeHighlight,
          [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
          rehypeRaw
        ]}
        className="markdown-content"
        components={customComponents(qaComponents)}
      />

      {diagramData && (
        <>
          {diagramData.related_topics && diagramData.related_topics.length > 0 && (
            <div className="related-topics-container">
              <h3 className="related-topics-title">Related Topics</h3>
              <div className="related-topics-list">
                {diagramData.related_topics.map((topic, index) => (
                  <span
                    key={index}
                    className="related-topic-item"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {diagramData.diagram && (
            <div className={`concept-map-container ${isFullWidth ? 'concept-map-fullwidth' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="concept-map-title">Concept Map</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleZoomOut}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    title="Zoom out (Ctrl -)"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <button
                    onClick={() => setDiagramZoom(100)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    title="Reset zoom (Ctrl 0)"
                  >
                    {diagramZoom}%
                  </button>
                  <button 
                    onClick={handleZoomIn}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    title="Zoom in (Ctrl +)"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button 
                    onClick={toggleFullWidth}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 ml-2"
                    title={isFullWidth ? "Normal view" : "Full width view"}
                  >
                    {isFullWidth ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                </div>
              </div>
              <div 
                ref={diagramRef} 
                className="diagram-container overflow-auto"
                style={{ 
                  maxHeight: isFullWidth ? '80vh' : '500px',
                  transition: 'max-height 0.3s ease'
                }}
              />
            </div>
          )}
        </>
      )}

      {isDiagramLoading && (
        <div className="mt-8 flex items-center justify-center py-8 bg-white rounded-lg border border-gray-200">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-3" />
          <span className="text-gray-600">Generating concept map...</span>
        </div>
      )}
    </>
  );
};

export default MarkdownContent;