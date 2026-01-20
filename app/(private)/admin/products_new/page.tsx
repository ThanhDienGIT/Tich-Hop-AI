'use client'
import React, { useState } from 'react';

// Dữ liệu mẫu (để hiển thị sản phẩm đầu tiên khi tải trang)
const MOCK_SCRAPED_DATA = {
  "id": 1,
  "name": "Sản phẩm mẫu AULA F75 (Đây là dữ liệu giả lập)",
  "price": "748.000₫",
  "countSale": "30k+",
  "countEvaluate": "9,5k",
  "start": 5.0,
  "image_url": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ln304g5yiuk3ff_tn",
  "video_url": "https://down-zl-sg.vod.susercontent.com/api/v4/11110105/mms/vn-11110105-6khwi-lzbldt3tdqod1e.16004351751827403.mp4",
  "description_html": "<div><p>Đây là mô tả HTML mẫu cho sản phẩm. Khi bạn cào dữ liệu thật, nội dung HTML bạn cào được sẽ hiển thị ở đây.</p></div>",
  "urlLink": "https://shopee.vn/product/232780266/18794434859"
};


// Component Form để thêm sản phẩm
function ProductAddForm({ onAddProduct }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Thêm state để báo lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null); // Xóa lỗi cũ
    
    try {
      // --- GỌI API ROUTE THẬT SỰ ---
      console.log("Đang gọi API cào dữ liệu từ:", url);
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        // --- PHẦN SỬA LỖI JSON ---
        // Lỗi 500 (API crash) sẽ đi vào đây.
        let errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          // Nếu server *đã* trả về JSON lỗi (như chúng ta mong đợi)
          const errData = await response.json();
          errorMessage = errData.error || 'Cào dữ liệu thất bại';
        } else {
          // Nếu server trả về HTML (vì nó bị crash)
          const errorText = await response.text();
          console.error("API đã trả về HTML (lỗi server):", errorText.substring(0, 500) + "..."); // Log 500 ký tự đầu của HTML lỗi
          errorMessage = `Lỗi 500: API route bị crash. (Hãy kiểm tra console của server Next.js).`;
        }
        throw new Error(errorMessage);
        // --- KẾT THÚC PHẦN SỬA LỖI ---
      }

      const data = await response.json();
      
      // Thêm một ID ngẫu nhiên
      const newData = { ...data, id: Date.now() };
      
      onAddProduct(newData);
      console.log("Đã cào xong:", newData);
      setUrl('');

    } catch (err) {
      console.error("Lỗi khi cào dữ liệu:", err.message);
      setError(err.message); // Hiển thị lỗi cho người dùng
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Thêm sản phẩm mới</h2>
      <div className="flex space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Dán URL sản phẩm Shopee vào đây..."
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Đang cào...' : 'Thêm'}
        </button>
      </div>
      {isLoading && <p className="text-sm text-blue-600 mt-2">Đang xử lý, vui lòng chờ... (Selenium đang khởi chạy...)</p>}
      {error && <p className="text-sm text-red-600 mt-2">Lỗi: {error}</p>}
    </form>
  );
}

// Component Modal để hiển thị chi tiết sản phẩm
function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 truncate pr-4" title={product.name}>
            {product.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột trái: Media */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700">Hình ảnh & Video</h4>
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-auto object-contain rounded-lg border border-gray-200" 
                />
              )}
              {product.video_url && (
                <video 
                  src={product.video_url} 
                  controls 
                  className="w-full rounded-lg border border-gray-200"
                >
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              )}
            </div>

            {/* Cột phải: Mô tả */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Mô tả sản phẩm (Render từ HTML)</h4>
              
              {/* --- PHẦN QUAN TRỌNG: RENDER HTML --- */}
              <div 
                className="prose prose-sm max-w-none p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto max-h-[400px]"
                // Sử dụng 'dangerouslySetInnerHTML' để render chuỗi HTML
                dangerouslySetInnerHTML={{ __html: product.description_html || "<p>Không có mô tả.</p>" }} 
              />
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Thông tin khác</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Giá:</span> {product.price}</p>
                  <p><span className="font-semibold">Đã bán:</span> {product.countSale}</p>
                  <p><span className="font-semibold">Đánh giá:</span> {product.countEvaluate} ({product.start} sao)</p>
                  <a href={product.urlLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Xem link gốc
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component chính của trang
export default function ProductAdminPage() {
  const [products, setProducts] = useState([
    // Thêm một sản phẩm mẫu ban đầu
    MOCK_SCRAPED_DATA
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = (newProduct) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-300">
          Trang Quản lý Sản phẩm
        </h1>
        
        {/* Form thêm sản phẩm */}
        <ProductAddForm onAddProduct={handleAddProduct} />
        
        {/* Danh sách sản phẩm */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hình ảnh</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Đã bán</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={product.name}>
                    {product.name}
                  </td>
                  <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                    {product.price}
                  </td>
                  <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                    {product.countSale}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 font-medium text-xs rounded-full hover:bg-blue-200 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal hiển thị chi tiết */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}