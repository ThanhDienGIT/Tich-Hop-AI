'use client';

import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

// --- HÀM HỖ TRỢ ĐỌC SỐ TIỀN THÀNH CHỮ (TIẾNG VIỆT) ---
const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';
const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
const chuHangTram = ('không một' + defaultNumbers).split(' ');

function docBlock(so: string) {
  let kq = '';
  let tram = parseInt(so[0]);
  let chuc = parseInt(so[1]);
  let donvi = parseInt(so[2]);
  
  kq += chuHangTram[tram] + ' trăm ';
  if (chuc === 0 && donvi !== 0) kq += 'lẻ ';
  if (chuc !== 0 && chuc !== 1) kq += chuHangChuc[chuc] + ' mươi ';
  if (chuc === 1) kq += 'mười ';
  switch (donvi) {
    case 1: kq += (chuc !== 0 && chuc !== 1) ? 'mốt ' : chuHangDonVi[donvi] + ' '; break;
    case 5: kq += (chuc === 0) ? chuHangDonVi[donvi] + ' ' : 'lăm '; break;
    default: if (donvi !== 0) kq += chuHangDonVi[donvi] + ' '; break;
  }
  return kq;
}

function numberToWordsVN(number: number): string {
  if (number === 0) return 'Không đồng';
  let str = number.toString();
  let blocks = [];
  while (str.length > 0) {
    blocks.push(str.substring(Math.max(0, str.length - 3), str.length));
    str = str.substring(0, Math.max(0, str.length - 3));
  }
  let blockNames = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let kq = '';
  for (let i = 0; i < blocks.length; i++) {
    if (parseInt(blocks[i]) === 0) continue;
    let blockStr = blocks[i].padStart(3, '0');
    let words = docBlock(blockStr);
    kq = words + blockNames[i] + ' ' + kq;
  }
  kq = kq.replace(/^không trăm lẻ /g, '').replace(/^không trăm /g, '').trim();
  return kq.charAt(0).toUpperCase() + kq.slice(1) + ' đồng';
}

// --- MAIN COMPONENT ---
export default function ExcelToXmlConverter() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // State để nhận biết đang kéo file

  // Hàm xử lý file chung cho cả Click chọn và Kéo thả
  const processFile = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert sheet to array of arrays (header: 1)
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<Invoices>\n';

        // Dữ liệu bắt đầu từ dòng 3 (index = 2)
        for (let i = 2; i < data.length; i++) {
          const row = data[i];
          
          if (!row || row.length === 0 || !row[2]) continue;

          const cusCode = row[2] || '';       // Cột C
          const cusName = row[3] || '';       // Cột D
          const cusTaxCode = row[5] || '';    // Cột F
          const cusAddress = row[7] || '';    // Cột H
          
          const prodName = row[18] || '';     // Cột S
          const prodUnit = row[19] || '';     // Cột T
          const prodQuantity = row[24] || 0;  // Cột Y
          const prodPrice = row[25] || 0;     // Cột Z
          const totalAC = row[28] || 0;       // Cột AC
          const vatRate = row[30] || 0;       // Cột AE
          const vatAmountAF = row[31] || 0;   // Cột AF
          
          const vatAmountAG = row[32] || 0;   // Cột AG
          const amountAI = row[34] || 0;      // Cột AI

          const amountInWords = numberToWordsVN(Number(amountAI));

          xml += `  <Inv>\n`;
          xml += `    <key></key>\n`;
          xml += `    <Invoice>\n`;
          xml += `      <KindOfService></KindOfService>\n`;
          xml += `      <CusCode>${cusCode}</CusCode>\n`;
          xml += `      <CusName>${cusName}</CusName>\n`;
          xml += `      <CusAddress>${cusAddress}</CusAddress>\n`;
          xml += `      <CusTaxCode>${cusTaxCode}</CusTaxCode>\n\n`;
          
          xml += `      <Products>\n`;
          xml += `        <Product>\n`;
          xml += `          <ProdName>${prodName}</ProdName>\n`;
          xml += `          <ProdUnit>${prodUnit}</ProdUnit>\n`;
          xml += `          <ProdQuantity>${prodQuantity}</ProdQuantity>\n`;
          xml += `          <ProdPrice>${prodPrice}</ProdPrice>\n`;
          xml += `          <Total>${totalAC}</Total>\n`;
          xml += `          <Amount>${totalAC}</Amount>\n`;
          xml += `          <VATRate>${vatRate}</VATRate>\n`;
          xml += `          <VATAmount>${vatAmountAF}</VATAmount>\n`;
          xml += `          <IsSum>0</IsSum>\n`;
          xml += `        </Product>\n`;
          xml += `      </Products>\n\n`;
          
          xml += `      <Total>${totalAC}</Total>\n`;
          xml += `      <VATAmount>${vatAmountAG}</VATAmount>\n`;
          xml += `      <Amount>${amountAI}</Amount>\n`;
          xml += `      <AmountInWords>${amountInWords}</AmountInWords>\n`;
          xml += `    </Invoice>\n`;
          xml += `  </Inv>\n`;
        }
        
        xml += '</Invoices>';

        // Download
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hoadon_export.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error);
        alert('Đã có lỗi xảy ra khi xử lý file!');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  // Các hàm xử lý sự kiện
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = ''; // Reset input
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      processFile(file);
    } else {
      alert("Vui lòng chỉ tải lên file Excel (.xlsx, .xls) hoặc .csv");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Convert Excel to XML</h1>
      <p className="text-sm text-gray-500">
        Kéo thả hoặc nhấn để upload file Excel (.xlsx) để tự động mapping và tải về file XML.
      </p>
      
      <div 
        className="flex items-center justify-center w-full"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label 
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
            <svg 
              className={`w-10 h-10 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`} 
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              {isDragging ? 'Thả file vào đây...' : 'Nhấn hoặc Kéo thả file Excel vào đây'}
            </p>
            <p className="text-xs text-gray-500">Định dạng hỗ trợ: .xlsx, .xls, .csv</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>
      </div>
      {isProcessing && <p className="text-center text-blue-600 font-medium">Đang xử lý và tạo file XML...</p>}
    </div>
  );
}