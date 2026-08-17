import React, { useState, useRef } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Table,
  Image as ImageIcon,
  Code,
  Link as LinkIcon,
  Quote,
  Eye,
  Edit3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = "min-h-[300px]"
}) => {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;

    const updated = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  return (
    <div className="border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl overflow-hidden bg-white dark:bg-[#181A20] shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2.5 bg-[#FAF7F2] dark:bg-[#22252E] border-b border-[#EAE2D5] dark:border-[#2C303B]">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Heading 1"
            onClick={() => insertText('# ', '', 'Heading 1')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => insertText('## ', '', 'Heading 2')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => insertText('### ', '', 'Heading 3')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-[#EAE2D5] dark:bg-[#2C303B] mx-1" />

          <button
            type="button"
            title="Bold"
            onClick={() => insertText('**', '**', 'bold text')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => insertText('*', '*', 'italic text')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-[#EAE2D5] dark:bg-[#2C303B] mx-1" />

          <button
            type="button"
            title="Bullet List"
            onClick={() => insertText('\n- ', '', 'List item')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() => insertText('\n> ', '', 'Key insight or quote')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Code Block"
            onClick={() => insertText('\n```javascript\n', '\n```\n', '// Code snippet here')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Table"
            onClick={() => insertText('\n| Column 1 | Column 2 |\n| --- | --- |\n| Item A | Item B |\n', '', '')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Link"
            onClick={() => insertText('[', '](https://example.com)', 'Link Text')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Image"
            onClick={() => insertText('![Image description](', ')', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#EAE2D5]/60 dark:bg-[#2C303B] p-0.5 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              tab === 'edit'
                ? 'bg-white dark:bg-[#181A20] text-[#1F1B18] dark:text-[#F7F5F0] shadow-xs'
                : 'text-[#756E65] dark:text-[#9E9B96]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              tab === 'preview'
                ? 'bg-white dark:bg-[#181A20] text-[#1F1B18] dark:text-[#F7F5F0] shadow-xs'
                : 'text-[#756E65] dark:text-[#9E9B96]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {tab === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your article in Markdown..."
          className={`w-full p-4 font-mono text-sm bg-transparent text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none resize-y ${minHeight}`}
        />
      ) : (
        <div className={`p-6 max-w-none ${minHeight} bg-white dark:bg-[#181A20]`}>
          {value ? (
            <div className="space-y-4 whitespace-pre-wrap font-sans">
              {value.split('\n\n').map((block, idx) => {
                if (block.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{block.replace('# ', '')}</h1>;
                }
                if (block.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{block.replace('## ', '')}</h2>;
                }
                if (block.startsWith('### ')) {
                  return <h3 key={idx} className="text-lg font-semibold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{block.replace('### ', '')}</h3>;
                }
                if (block.startsWith('> ')) {
                  return (
                    <blockquote key={idx} className="border-l-4 border-[#B5824C] dark:border-[#DFB267] pl-4 italic text-[#756E65] dark:text-[#9E9B96] my-2">
                      {block.replace('> ', '')}
                    </blockquote>
                  );
                }
                if (block.startsWith('```')) {
                  return (
                    <pre key={idx} className="p-3 bg-[#1F1B18] text-[#F7F5F0] rounded-xl text-xs overflow-x-auto">
                      <code>{block.replace(/```[a-z]*\n?/g, '')}</code>
                    </pre>
                  );
                }
                return <p key={idx} className="text-[#756E65] dark:text-[#9E9B96] leading-relaxed">{block}</p>;
              })}
            </div>
          ) : (
            <p className="text-[#756E65] dark:text-[#9E9B96] italic">No content to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
