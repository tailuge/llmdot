import { useEffect, useRef } from 'react';
import { instance } from '@viz-js/viz';

interface DiagramOutputProps {
  dotCode: string;
}

export function DiagramOutput({ dotCode }: DiagramOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotCode || !containerRef.current) return;

    // Clean up previous content
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    instance().then(viz => {
      try {
        const element = viz.renderSVGElement(dotCode);
        if (containerRef.current) {
          element.style.width = '100%';
          element.style.height = '100%';
          containerRef.current.appendChild(element);
        }
      } catch (error: any) {
        console.error('Error rendering diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
              <div class="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                Error rendering diagram: ${error.message}
              </div>
            </div>
          `;
        }
      }
    }).catch(error => {
      console.error('Error loading viz instance:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full">
            <div class="text-red-500 text-center p-4 bg-red-50 rounded-lg">
              Error loading viz instance: ${error.message}
            </div>
          </div>
        `;
      }
    });

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [dotCode]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-white rounded-lg shadow-inner overflow-auto p-4"
    >
      {!dotCode && (
        <div className="h-full flex items-center justify-center text-gray-400">
          Diagram will appear here
        </div>
      )}
    </div>
  );
}