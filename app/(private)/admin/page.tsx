// app/ide/page.tsx
// All-in-one file for the Web IDE
// NÂNG CẤP: Đổi Checkbox thành Toggle Switch (gạt)
// và ẨN đi khi không có file nào đang mở.

"use client";

import React, { useState, useRef, CSSProperties } from 'react';
import Editor from '@monaco-editor/react';

// Định nghĩa kiểu
type FileHandle = any;
type DirectoryHandle = any;
type EditorInstance = any; // Kiểu của Monaco Editor instance

export interface FileTreeNode {
  name: string;
  kind: 'file' | 'directory';
  handle: any; // FileSystemHandle
  children?: FileTreeNode[];
}

// =================================================================
// 1. MONACO EDITOR COMPONENT
// =================================================================
interface MonacoEditorProps {
  language: string;
  initialValue: string;
  onChange: (value: string | undefined) => void;
  onMount: (editor: EditorInstance) => void;
}

const MonacoEditor = ({ language, initialValue, onChange, onMount }: MonacoEditorProps) => {
  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={initialValue}
      onChange={onChange}
      onMount={onMount}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
      }}
    />
  );
};

// =================================================================
// 2. FILE TREE COMPONENT (Có collapse/expand)
// =================================================================

// Component con để xử lý state đóng/mở
const FileTreeNodeComponent: React.FC<{ node: FileTreeNode; onFileClick: (handle: any, name: string) => void; }> = ({ node, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    if (node.kind === 'directory') {
      setIsOpen(!isOpen);
    }
  };

  if (node.kind === 'directory') {
    return (
      <li>
        <span
          className="file-tree-entry folder-entry"
          onClick={toggleOpen}
        >
          {isOpen ? '📂 ' : '📁 '}
          {node.name}
        </span>
        {isOpen && node.children && (
          <FileTree tree={node.children} onFileClick={onFileClick} />
        )}
      </li>
    );
  }

  return (
    <li>
      <span
        className="file-tree-entry file-entry"
        onClick={() => onFileClick(node.handle, node.name)}
      >
        📄 {node.name}
      </span>
    </li>
  );
};

// Component FileTree chính
const FileTree: React.FC<{ tree: FileTreeNode[]; onFileClick: (handle: any, name: string) => void; }> = ({ tree, onFileClick }) => {
  const sortedTree = [...tree].sort((a, b) => {
    if (a.kind === 'directory' && b.kind === 'file') return -1;
    if (a.kind === 'file' && b.kind === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="file-tree-container">
      <ul>
        {sortedTree.map((node) => (
          <FileTreeNodeComponent
            key={node.name}
            node={node}
            onFileClick={onFileClick}
          />
        ))}
      </ul>
    </div>
  );
};

// =================================================================
// 3. GEMINI AI PANEL COMPONENT
// =================================================================
interface GeminiPanelProps {
  onInsert: (text: string) => void;
  editorContent: string;
  isFileOpen: boolean; // <-- THAY ĐỔI 1: Nhận biết có file đang mở
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ onInsert, editorContent, isFileOpen }) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [readContext, setReadContext] = useState(true); // Mặc định BẬT

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    
    // Logic gửi dữ liệu không đổi
    // API của bạn sẽ phải xử lý việc 'codeContext'
    // có thể là 'null' hoặc là code thật.
    const payload: { prompt: string; codeContext?: string } = {
      prompt: prompt,
    };

    // Chỉ gửi codeContext nếu:
    // 1. Nút gạt đang BẬT
    // 2. Có 1 file đang MỞ
    if (readContext && isFileOpen) {
      payload.codeContext = editorContent;
    }
    
    try {
      const response = await fetch('/api/callai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), 
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data.message); 
    } catch (err) {
      console.error(err);
      setResult("Lỗi khi gọi AI. Hãy kiểm tra console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result); alert("Đã copy!"); };
  const handleClear = () => { setPrompt(""); setResult(""); };
  const handleInsert = () => { if (result) onInsert(result); };

  return (
    <aside className="ai-pane">
      <h4>Gemini AI Assistant</h4>
      
      {/* THAY ĐỔI 2: Chỉ hiển thị nút gạt nếu isFileOpen là true */}
      {isFileOpen && (
        <div className="ai-context-toggle">
          {/* Đây là cấu trúc HTML của toggle switch */}
          <label className="toggle-switch">
            <input
              type="checkbox"
              id="readContextCheckbox"
              checked={readContext}
              onChange={(e) => setReadContext(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <label htmlFor="readContextCheckbox" className="toggle-label">
            Đọc code đang mở
          </label>
        </div>
      )}
      
      <textarea
        className="ai-textarea"
        rows={6}
        placeholder="Nhập prompt ở đây..."
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      
      <div className="ai-buttons">
        <button className="ide-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang xử lý..." : "Generate"}
        </button>
        <button className="ide-button ide-button-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="ai-result-wrapper">
        {result && (
          <div className="ai-result">
            <pre>{result}</pre>
            <div className="ai-result-actions">
              <button className="ide-button" onClick={handleInsert}>Chèn</button>
              <button className="ide-button ide-button-secondary" onClick={handleCopy}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

// =================================================================
// 4. MAIN IDE PAGE COMPONENT
// =================================================================

// Hàm xây dựng cây thư mục
async function buildFileTree(dirHandle: DirectoryHandle): Promise<FileTreeNode[]> {
  const tree: FileTreeNode[] = [];
  try {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory') {
        const children = await buildFileTree(entry);
        tree.push({ name: entry.name, kind: 'directory', handle: entry, children });
      } else {
        tree.push({ name: entry.name, kind: 'file', handle: entry });
      }
    }
  } catch (err) { console.error("Lỗi khi đọc thư mục:", err); }
  return tree;
}

// === COMPONENT TRANG IDE CHÍNH ===
export default function IDEPage() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [currentFileHandle, setCurrentFileHandle] = useState<FileHandle | null>(null);
  const [currentFileName, setCurrentFileName] = useState('Chưa mở file');
  const [fileContent, setFileContent] = useState('// Click vào 1 file bên trái để bắt đầu');
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<EditorInstance>(null);

  const handleEditorDidMount = (editor: EditorInstance) => {
    editorRef.current = editor;
  };
  
  const handleAiInsert = (text: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      editorRef.current.executeEdits("ai-insert", [
        { range: selection, text: text, forceMoveMarkers: true },
      ]);
      editorRef.current.focus();
    }
  };

  const openDirectory = async () => {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      const status = await dirHandle.requestPermission({ mode: 'readwrite' });
      if (status !== 'granted') { alert("Bạn cần cấp quyền để xem file!"); return; }
      const tree = await buildFileTree(dirHandle);
      setFileTree(tree);
    } catch (err) { console.error("Lỗi khi mở thư mục:", err); }
  };

  const handleFileClick = async (fileHandle: FileHandle, name: string) => {
    try {
      const file = await fileHandle.getFile();
      const content = await file.text();
      setFileContent(content); 
      setCurrentFileHandle(fileHandle); // <-- Đặt file handle (không còn null)
      setCurrentFileName(name);
      if (name.endsWith('.js')) setLanguage('javascript');
      else if (name.endsWith('.ts')) setLanguage('typescript');
      else if (name.endsWith('.css')) setLanguage('css');
      else if (name.endsWith('.json')) setLanguage('json');
      else if (name.endsWith('.sql')) setLanguage('sql');
      else setLanguage('plaintext');
    } catch (err) { console.error("Không thể mở file:", err); }
  };
  
  const saveFile = async () => {
    if (!currentFileHandle) { alert("Chưa có file nào được mở để lưu!"); return; }
    try {
      const writable = await currentFileHandle.createWritable();
      await writable.write(fileContent); 
      await writable.close();
      alert(`Đã lưu file: ${currentFileName}`);
    } catch (err) { console.error("Lỗi khi lưu file:", err); }
  };

  return (
    <>
      <div className="ide-wrapper">
        <div className="ide-container">
          {/* ===== CỘT 1 (SIDEBAR) ===== */}
          <aside className="sidebar">
            <button className="ide-button" onClick={openDirectory}>
              Mở Thư Mục
            </button>
            <FileTree tree={fileTree} onFileClick={handleFileClick} />
          </aside>

          {/* ===== CỘT 2 (EDITOR) ===== */}
          <main className="editor-pane">
            <div className="editor-header">
              <h3>{currentFileName}</h3>
              <button 
                className="ide-button" 
                onClick={saveFile} 
                disabled={!currentFileHandle}
              >
                Lưu File
              </button>
            </div>
            
            <div className="editor-area">
              <MonacoEditor
                language={language}
                initialValue={fileContent}
                key={currentFileName}
                onChange={(value) => setFileContent(value || '')}
                onMount={handleEditorDidMount}
              />
            </div>
          </main>

          {/* ===== CỘT 3 (AI PANEL) ===== */}
          <GeminiPanel 
            onInsert={handleAiInsert} 
            editorContent={fileContent} 
            // THAY ĐỔI 3: Truyền prop boolean (true/false)
            isFileOpen={!!currentFileHandle} 
          />
        </div>
      </div>

      {/* =================================================================
       * 5. CSS (Thêm style cho Toggle Switch)
       * ================================================================= */}
      <style jsx global>{`
        /* CSS Reset (cho phép cuộn "bên ngoài") */
        html, body, #__next {
          height: 100% !important; 
          margin: 0 !important;
          padding: 0 !important;
        }

        .ide-wrapper {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        /* Nút chung */
        .ide-button {
          background-color: #0e639c;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 10px;
          transition: background-color 0.2s;
        }
        .ide-button:hover { background-color: #1177bb; }
        .ide-button:disabled { background-color: #555; cursor: not-allowed; }
        .ide-button-secondary { background-color: #5c5c5c; }
        .ide-button-secondary:hover { background-color: #777777; }

        .ide-container {
          display: flex;
          height: 100%;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #1e1e1e;
          color: #ccc;
        }

        /* CỘT 1: Sidebar (Trái) - Cuộn "bên ngoài" */
        .sidebar {
          width: 250px;
          min-width: 200px;
          background-color: #252526;
          padding: 10px;
          border-right: 1px solid #333;
          resize: horizontal;
          overflow-x: hidden;
          overflow-y: auto;
        }

        /* CỘT 2: Editor (Giữa) */
        .editor-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 300px;
        }
        .editor-header {
          padding: 10px;
          background-color: #1e1e1e;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .editor-header h3 {
          margin: 0;
          font-size: 16px;
          color: #d4d4d4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .editor-area {
          flex: 1;
        }

        /* CỘT 3: AI Panel (Phải) */
        .ai-pane {
          width: 300px;
          min-width: 250px;
          background-color: #252526;
          border-left: 1px solid #333;
          padding: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          resize: horizontal;
        }
        .ai-pane h4 {
          margin-top: 0;
          border-bottom: 1px solid #444;
          padding-bottom: 8px;
        }
        
        .ai-textarea {
          width: 100%;
          box-sizing: border-box;
          background-color: #3c3c3c;
          color: #d4d4d4;
          border: 1px solid #555;
          border-radius: 4px;
          padding: 8px;
          font-size: 14px;
          font-family: inherit;
        }
        .ai-buttons {
          margin-top: 10px;
          display: flex;
        }
        .ai-result-wrapper {
          flex: 1;
          overflow-y: auto;
          margin-top: 15px;
        }
        .ai-result {
          background-color: #1e1e1e;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 10px;
        }
        .ai-result pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
          font-family: inherit;
          color: #d4d4d4;
        }
        .ai-result-actions {
          margin-top: 10px;
          border-top: 1px solid #333;
          padding-top: 10px;
          display: flex;
        }

        /* Cây thư mục (không cuộn riêng nữa) */
        .file-tree-container { 
          margin-top: 10px;
        }
        .file-tree-container ul {
          list-style: none;
          padding-left: 15px;
          margin: 0;
        }
        .file-tree-container li { padding: 2px 0; }
        .file-tree-entry {
          padding: 4px 8px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          white-space: nowrap;
        }
        .file-tree-entry:hover { background-color: #37373d; }
        .folder-entry { font-weight: bold; }
        .file-entry { color: #9cdcfe; }
        
        /* THAY ĐỔI 4: CSS cho Toggle Switch */
        .ai-context-toggle {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .toggle-label { /* Chữ "Đọc code đang mở" */
          margin-left: 10px;
          font-size: 13px;
          color: #ccc;
          cursor: pointer;
          user-select: none;
        }
        .toggle-switch { /* Đây là cái hộp bên ngoài */
          position: relative;
          display: inline-block;
          width: 44px; /* Giảm kích thước 1 chút */
          height: 24px;
        }
        .toggle-switch input { /* Ẩn checkbox gốc */
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider { /* Đây là cái thanh trượt (track) */
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #555; /* Màu khi TẮT */
          transition: .4s;
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before { /* Đây là cái nút gạt (knob) */
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #0e639c; /* Màu khi BẬT */
        }
        input:checked + .slider.round:before {
          transform: translateX(20px); /* Di chuyển nút gạt */
        }
      `}</style>
    </>
  );
}