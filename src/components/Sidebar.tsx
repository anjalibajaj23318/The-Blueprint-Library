import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useState } from 'react';
import { MarkdownFile } from '../types';

interface SidebarProps {
  files: MarkdownFile[];
  onSelectSection: (fileIndex: number, sectionIndex?: number) => void;
  selectedFile: number | null;
  selectedSection: number | null;
  searchQuery: string;
}

export default function Sidebar({
  files,
  onSelectSection,
  selectedFile,
  selectedSection,
  searchQuery
}: SidebarProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFiles(newExpanded);
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-1">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const fileMatchesSearch = (file: MarkdownFile) => {
    if (!searchQuery) return true;
    return file.fullContent.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Files</h2>
        <div className="space-y-1">
          {files.map((file, fileIndex) => {
            const isExpanded = expandedFiles.has(fileIndex);
            const hasSections = file.sections.length > 0;
            const matchesSearch = fileMatchesSearch(file);

            if (searchQuery && !matchesSearch) return null;

            return (
              <div key={fileIndex} className="space-y-1">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    selectedFile === fileIndex && selectedSection === null
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-200 text-gray-700'
                  } ${matchesSearch && searchQuery ? 'ring-2 ring-yellow-300' : ''}`}
                  onClick={() => {
                    if (hasSections) {
                      toggleExpanded(fileIndex);
                    } else {
                      onSelectSection(fileIndex);
                    }
                  }}
                >
                  {hasSections && (
                    <span className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                  {!hasSections && <FileText className="w-4 h-4 flex-shrink-0" />}
                  <span className="font-medium truncate">
                    {highlightMatch(file.title)}
                  </span>
                </div>

                {hasSections && isExpanded && (
                  <div className="ml-6 space-y-1">
                    {file.sections.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                          selectedFile === fileIndex && selectedSection === sectionIndex
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                        onClick={() => onSelectSection(fileIndex, sectionIndex)}
                      >
                        {section.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
