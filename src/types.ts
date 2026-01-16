export interface MarkdownSection {
  title: string;
  content: string;
  level: number;
}

export interface MarkdownFile {
  fileName: string;
  title: string;
  sections: MarkdownSection[];
  fullContent: string;
}
