import { MarkdownFile, MarkdownSection } from '../types';

export function parseMarkdownFile(fileName: string, content: string): MarkdownFile {
  const lines = content.split('\n');
  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | null = null;
  let title = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      title = line.substring(2).trim();
    } else if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.substring(3).trim(),
        content: '',
        level: 2
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return {
    fileName,
    title: title || fileName.replace('.md', ''),
    sections,
    fullContent: content
  };
}

export async function loadMarkdownFiles(): Promise<MarkdownFile[]> {
  const modules = import.meta.glob('/data/*.md', { as: 'raw' });
  const files: MarkdownFile[] = [];

  for (const path in modules) {
    const content = await modules[path]();
    const fileName = path.split('/').pop() || '';
    const parsed = parseMarkdownFile(fileName, content as string);
    files.push(parsed);
  }

  return files.sort((a, b) => a.title.localeCompare(b.title));
}
