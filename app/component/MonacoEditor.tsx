// app/components/MonacoEditor.tsx

"use client"; // Bắt buộc!

import React from 'react';
// Import component Editor chính
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  language: string;       // Ngôn ngữ (vd: 'javascript', 'typescript', 'sql', 'oracle')
  initialValue: string;   // Nội dung file ban đầu
  onChange: (value: string | undefined) => void; // Hàm gọi khi nội dung thay đổi
}

const MonacoEditor = ({ language, initialValue, onChange }: MonacoEditorProps) => {

  // Bạn có thể dùng hook "useRef" để lấy instance của editor
  // và thực hiện các thao tác nâng cao (vd: format code)

  return (
    <Editor
      height="80vh" // Đặt chiều cao cho giống IDE
      language={language}
      theme="vs-dark" // Giao diện tối giống VS Code
      value={initialValue}
      onChange={onChange}
      options={{
        // Các tùy chọn khác của Monaco...
        selectOnLineNumbers: true,
        automaticLayout: true,
      }}
      // Monaco sẽ tự động cung cấp gợi ý cơ bản
      // (từ khóa, biến đã định nghĩa) cho ngôn ngữ đã chọn
    />
  );
};

export default MonacoEditor;