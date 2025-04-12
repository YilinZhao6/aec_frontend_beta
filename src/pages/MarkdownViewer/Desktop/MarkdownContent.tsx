import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Loader2, ZoomIn, ZoomOut, Move } from 'lucide-react';
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
  const diagramZoomRef = useRef(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

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
          svg.style.transform = `scale(${diagramZoom / 100}) translate(${position.x}px, ${position.y}px)`;
          svg.style.transformOrigin = 'top left';
          svg.style.cursor = 'grab';
        }
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        diagramRenderedRef.current = false;
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(renderDiagram, 100);
  }, [diagramData, diagramZoom, position]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    diagramZoomRef.current = diagramZoom;
  }, [diagramZoom]);

  const handleZoomIn = () => {
    const newZoom = Math.min(diagramZoomRef.current + 10, 200);
    setDiagramZoom(newZoom);
    diagramZoomRef.current = newZoom;
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(diagramZoomRef.current - 10, 50);
    setDiagramZoom(newZoom);
    diagramZoomRef.current = newZoom;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!diagramRef.current) return;
    
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: positionRef.current.x, y: positionRef.current.y });
    
    svg.style.cursor = 'grabbing';
    svg.classList.add('dragging');
    document.body.style.userSelect = 'none';
    document.body.classList.add('dragging-active');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !diagramRef.current) return;
    
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const newX = dragOffset.x + dx;
    const newY = dragOffset.y + dy;
    
    positionRef.current = { x: newX, y: newY };
    svg.style.transform = `scale(${diagramZoom / 100}) translate(${newX}px, ${newY}px)`;
  };

  const handleMouseUp = () => {
    if (!diagramRef.current || !isDragging) return;
    
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;
    
    setPosition(positionRef.current);
    setIsDragging(false);
    
    svg.style.cursor = 'grab';
    svg.classList.remove('dragging');
    document.body.style.userSelect = '';
    document.body.classList.remove('dragging-active');
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!diagramRef.current) return;

    e.preventDefault();
    
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;
    
    // 确定鼠标位置相对于SVG的坐标
    const rect = diagramRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 当前的缩放级别
    const currentZoom = diagramZoomRef.current;
    
    // 计算新的缩放级别，滚轮向上滚动时放大，向下滚动时缩小
    let newZoom = currentZoom;
    if (e.deltaY < 0) {
      // 放大
      newZoom = Math.min(currentZoom + 5, 200);
    } else {
      // 缩小
      newZoom = Math.max(currentZoom - 5, 50);
    }
    
    // 如果缩放级别没有变化，则不进行任何操作
    if (newZoom === currentZoom) return;
    
    // 计算鼠标位置在缩放前后的变化，以便在缩放时保持鼠标位置不变
    const scaleChange = newZoom / currentZoom;
    
    // 计算新的位置，使鼠标位置保持不变
    const currentPos = positionRef.current;
    
    // 鼠标在当前缩放下的"真实"位置
    const mouseRealX = (mouseX / (currentZoom / 100)) - currentPos.x;
    const mouseRealY = (mouseY / (currentZoom / 100)) - currentPos.y;
    
    // 计算新位置，使鼠标在新缩放下对应的屏幕位置相同
    const newX = -(mouseRealX * (newZoom / 100) - mouseX);
    const newY = -(mouseRealY * (newZoom / 100) - mouseY);
    
    // 更新位置和缩放
    positionRef.current = { x: newX, y: newY };
    diagramZoomRef.current = newZoom;
    
    // 直接更新DOM以获得即时反馈
    svg.style.transform = `scale(${newZoom / 100}) translate(${newX}px, ${newY}px)`;
    
    // 更新状态（节流处理，避免过多渲染）
    requestAnimationFrame(() => {
      setPosition({ x: newX, y: newY });
      setDiagramZoom(newZoom);
    });
  };

  const resetPosition = () => {
    const newPosition = { x: 0, y: 0 };
    const newZoom = 100;
    
    setPosition(newPosition);
    setDiagramZoom(newZoom);
    
    positionRef.current = newPosition;
    diagramZoomRef.current = newZoom;
    
    if (diagramRef.current) {
      const svg = diagramRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = `scale(${newZoom / 100}) translate(0px, 0px)`;
      }
    }
  };

  useEffect(() => {
    if (!diagramRef.current) return;

    const svgElement = diagramRef.current.querySelector('svg');
    if (svgElement) {
      svgElement.style.transform = `scale(${diagramZoom / 100}) translate(${position.x}px, ${position.y}px)`;
      svgElement.style.transformOrigin = 'top left';
    }
  }, [diagramZoom, position]);

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
            <div className="concept-map-container">
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
                    onClick={resetPosition}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    title="Reset position"
                  >
                    <Move size={18} />
                  </button>
                </div>
              </div>
              <div 
                ref={diagramRef} 
                className="diagram-container"
                style={{ 
                  maxHeight: '500px',
                  transition: 'max-height 0.3s ease',
                  width: '100%',
                  overflow: 'auto',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
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