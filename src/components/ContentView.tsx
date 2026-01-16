import { MarkdownFile } from '../types';

interface ContentViewProps {
  file: MarkdownFile | null;
  sectionIndex: number | null;
  searchQuery: string;
}

export default function ContentView({ file, sectionIndex, searchQuery }: ContentViewProps) {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a file or section to view its content</p>
        </div>
      </div>
    );
  }

  const getContentToDisplay = () => {
    if (sectionIndex !== null && file.sections[sectionIndex]) {
      return {
        title: file.sections[sectionIndex].title,
        content: file.sections[sectionIndex].content
      };
    }
    return {
      title: file.title,
      content: file.fullContent
    };
  };

  const { title, content } = getContentToDisplay();

  const parseMarkdownLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkUrl = match[2];

      parts.push(
        <a
          key={`link-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {linkText}
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const highlightSearchInContent = (text: string) => {
    const withLinks = parseMarkdownLinks(text);

    if (!searchQuery) return withLinks;

    if (typeof withLinks === 'string') {
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      const parts = withLinks.split(regex);

      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 px-1">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    }

    return withLinks;
  };

  const renderContent = () => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mt-6 mb-4">{highlightSearchInContent(line.substring(2))}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-semibold mt-5 mb-3">{highlightSearchInContent(line.substring(3))}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-semibold mt-4 mb-2">{highlightSearchInContent(line.substring(4))}</h3>;
      } else if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-6 mb-1">
            {highlightSearchInContent(line.substring(2))}
          </li>
        );
      } else if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      } else {
        return <p key={i} className="mb-2">{highlightSearchInContent(line)}</p>;
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 border-b pb-4">
          {title}
        </h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
