import { useEffect, useState } from 'react';
import { MarkdownFile } from './types';
import { loadMarkdownFiles } from './utils/markdownParser';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import ContentView from './components/ContentView';

function App() {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarkdownFiles().then(loadedFiles => {
      setFiles(loadedFiles);
      setLoading(false);
    });
  }, []);

  const handleSelectSection = (fileIndex: number, sectionIndex?: number) => {
    setSelectedFile(fileIndex);
    setSelectedSection(sectionIndex ?? null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          files={files}
          onSelectSection={handleSelectSection}
          selectedFile={selectedFile}
          selectedSection={selectedSection}
          searchQuery={searchQuery}
        />
        <ContentView
          file={selectedFile !== null ? files[selectedFile] : null}
          sectionIndex={selectedSection}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}

export default App;
