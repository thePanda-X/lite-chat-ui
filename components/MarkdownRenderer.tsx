import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Copy, Check, Download, FileCode, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Custom theme definition for smooth purple, pink, and light green aesthetics
const customPurpleTheme: any = {
  'code[class*="language-"]': {
    color: '#e2d9fa',
    textShadow: 'none',
    fontFamily: 'BerkeleyMono, monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.7',
    tabSize: 4,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#e2d9fa',
    textShadow: 'none',
    fontFamily: 'BerkeleyMono, monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.7',
    tabSize: 4,
    hyphens: 'none',
    margin: 0,
    padding: '1.25rem',
    overflow: 'auto',
    background: 'transparent',
  },
  'comment': { color: '#7a72a3', fontStyle: 'italic' },
  'prolog': { color: '#7a72a3' },
  'doctype': { color: '#7a72a3' },
  'cdata': { color: '#7a72a3' },
  'punctuation': { color: '#c4b5fd' },
  'namespace': { opacity: .7 },
  'property': { color: '#ff79c6' },
  'tag': { color: '#ff79c6' },
  'boolean': { color: '#bd93f9' },
  'number': { color: '#bd93f9' },
  'constant': { color: '#bd93f9' },
  'symbol': { color: '#bd93f9' },
  'deleted': { color: '#ff79c6' },
  'selector': { color: '#86efac' },
  'attr-name': { color: '#86efac' },
  'string': { color: '#86efac' },
  'char': { color: '#86efac' },
  'builtin': { color: '#ff79c6' },
  'inserted': { color: '#86efac' },
  'operator': { color: '#ff79c6' },
  'entity': { color: '#e2d9fa', cursor: 'help' },
  'url': { color: '#e2d9fa' },
  'keyword': { color: '#ff79c6' },
  'atrule': { color: '#ff79c6' },
  'function': { color: '#d8b4fe' },
  'class-name': { color: '#ff79c6' },
  'regex': { color: '#86efac' },
  'important': { color: '#ff79c6', fontWeight: 'bold' },
  'variable': { color: '#bd93f9' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' },
};

// Language display names
const languageNames: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
  python: 'Python',
  rb: 'Ruby',
  go: 'Go',
  rs: 'Rust',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  cs: 'C#',
  php: 'PHP',
  swift: 'Swift',
  kt: 'Kotlin',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  powershell: 'PowerShell',
  dockerfile: 'Dockerfile',
  graphql: 'GraphQL',
  xml: 'XML',
};

const CodeBlock = ({ language, children, ...props }: { language: string, children: React.ReactNode, [key: string]: any }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const codeToCopy = String(children).replace(/\n$/, '');
    await navigator.clipboard.writeText(codeToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const codeToDownload = String(children).replace(/\n$/, '');
    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet.${language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const displayLanguage = languageNames[language?.toLowerCase()] || language?.toUpperCase() || 'CODE';
  const isShell = ['bash', 'sh', 'shell', 'zsh', 'powershell'].includes(language?.toLowerCase());

  return (
    <div className="rounded-2xl overflow-hidden my-5 shadow-xl shadow-black/10 bg-[#13101a] group">
      {/* Header - Subtle gradient instead of hard border */}
      <div className="bg-gradient-to-b from-white/[0.03] to-transparent px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          {isShell ? (
            <Terminal className="h-4 w-4 text-emerald-400/60" />
          ) : (
            <FileCode className="h-4 w-4 text-primary/50" />
          )}
          <span className="font-mono text-xs font-semibold text-foreground/50 tracking-wide">{displayLanguage}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-muted-foreground/30 hover:text-foreground/70 hover:bg-white/5 transition-all duration-200"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isCopied 
                ? 'text-emerald-400/80 bg-emerald-500/10' 
                : 'text-muted-foreground/30 hover:text-foreground/70 hover:bg-white/5'
            }`}
            title={isCopied ? 'Copied!' : 'Copy code'}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <SyntaxHighlighter
          style={customPurpleTheme}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0',
            padding: '1.25rem',
            backgroundColor: '#110e18',
            fontSize: '0.8125rem',
            lineHeight: '1.7',
            fontFamily: 'BerkeleyMono, monospace',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="max-w-none break-words text-foreground leading-relaxed">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Headings
          h1: ({children}) => <h1 className="text-2xl font-bold mt-8 mb-4 pb-2 text-foreground tracking-tight first:mt-0">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-semibold mt-7 mb-3 text-foreground tracking-tight">{children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-semibold mt-6 mb-2 text-foreground tracking-tight">{children}</h3>,
          h4: ({children}) => <h4 className="text-base font-semibold mt-5 mb-2 text-foreground">{children}</h4>,
          h5: ({children}) => <h5 className="text-sm font-semibold mt-4 mb-1.5 text-foreground">{children}</h5>,
          h6: ({children}) => <h6 className="text-xs font-semibold mt-4 mb-1 uppercase tracking-wider text-muted-foreground/70">{children}</h6>,
          
          // Text
          p: ({children}) => <p className="mb-4 leading-7 text-foreground/85 last:mb-0">{children}</p>,
          strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({children}) => <em className="italic text-foreground/85">{children}</em>,
          del: ({children}) => <del className="line-through text-muted-foreground/60">{children}</del>,
          
          // Lists
          ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-foreground/85 marker:text-primary/40">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-foreground/85 marker:text-primary/40">{children}</ol>,
          li: ({children}) => <li className="pl-1 leading-relaxed">{children}</li>,

          // Links & Images
          a: ({href, children}) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary/80 hover:text-primary underline underline-offset-2 decoration-primary/20 hover:decoration-primary/50 transition-colors font-medium"
            >
              {children}
            </a>
          ),
          img: ({src, alt}) => (
            <span className="block my-6">
              <img 
                src={src} 
                alt={alt} 
                className="rounded-2xl bg-secondary/20 shadow-xl shadow-black/10 max-w-full h-auto mx-auto" 
              />
              {alt && <span className="block text-center text-xs text-muted-foreground/50 mt-3">{alt}</span>}
            </span>
          ),
          hr: () => <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />,

          // Code
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isMatch = !!match;

            if (!inline && isMatch) {
              return (
                <CodeBlock language={match![1]} {...props}>
                  {children}
                </CodeBlock>
              );
            }
            
            const isInline = inline === true || !inline;
            
            return (
              <code 
                className={`${!isInline ? 'block bg-secondary/30 p-4 rounded-xl my-3 overflow-x-auto' : 'bg-secondary/40 px-1.5 py-0.5 rounded-md mx-0.5 inline font-mono text-[0.85em] text-foreground/90'} ${className || ''}`} 
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables - Softer styling
          table({children}: any) {
            return (
              <div className="overflow-x-auto my-6 rounded-2xl shadow-lg shadow-black/10 bg-secondary/20">
                <table className="min-w-full divide-y divide-white/5 text-left">{children}</table>
              </div>
            );
          },
          thead({children}: any) {
            return <thead className="bg-white/[0.02]">{children}</thead>;
          },
          tbody({children}: any) {
            return <tbody className="divide-y divide-white/5">{children}</tbody>;
          },
          tr({children}: any) {
            return <tr className="transition-colors hover:bg-white/[0.02]">{children}</tr>;
          },
          th({children}: any) {
             return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{children}</th>
          },
          td({children}: any) {
            return <td className="px-4 py-3 text-sm text-foreground/80">{children}</td>
          },

          // Blockquote - Softer styling
          blockquote({children}: any) {
            return (
              <blockquote className="border-l-2 border-primary/30 bg-primary/5 pl-4 py-3 my-5 rounded-r-xl text-foreground/70">
                {children}
              </blockquote>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
