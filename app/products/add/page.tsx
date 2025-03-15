'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AddProductPage() {
  // الحقول الرئيسية
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);

  // الخصم (نسبة مئوية)
  const [discount, setDiscount] = useState<number>(0);

  // الأحجام
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');

  // رابط الصورة
  const [imageURL, setImageURL] = useState('');

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // إضافة حجم جديد إلى المصفوفة
  const handleAddSize = () => {
    if (newSize.trim()) {
      setSizes((prev) => [...prev, newSize.trim()]);
      setNewSize('');
    }
  };

  // حذف حجم من المصفوفة
  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes((prev) => prev.filter((size) => size !== sizeToRemove));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name,
        price,
        discount,
        sizes,
        imageURL, // حفظ رابط الصورة في المستند
      });
      router.push('/products'); // العودة لقائمة المنتجات
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);
      alert('حدث خطأ أثناء إضافة المنتج.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
        <h1 className="text-xl font-bold mb-4">إضافة منتج جديد</h1>
        <form onSubmit={handleAddProduct} className="space-y-4">
          {/* اسم المنتج */}
          <div>
            <label className="block mb-1 text-gray-700">اسم المنتج:</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* السعر */}
          <div>
            <label className="block mb-1 text-gray-700">السعر:</label>
            <input
              type="number"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          {/* الخصم */}
          <div>
            <label className="block mb-1 text-gray-700">الخصم (%):</label>
            <input
              type="number"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              أدخل قيمة الخصم كنسبة مئوية (مثلاً 10 يعني 10%).
            </p>
          </div>

          {/* الأحجام */}
          <div>
            <label className="block mb-1 text-gray-700">الأحجام:</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 flex-1"
                placeholder="أدخل حجمًا جديدًا"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                إضافة
              </button>
            </div>
            {/* عرض الأحجام التي تمت إضافتها */}
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center bg-gray-100 border rounded px-2 py-1"
                  >
                    <span className="mr-2">{size}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(size)}
                      className="text-red-500 hover:text-red-700"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* رابط الصورة */}
          <div>
            <label className="block mb-1 text-gray-700">رابط الصورة:</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              أدخل رابط الصورة (URL). يمكنك رفع الصورة في أي خدمة تخزين والحصول على رابطها.
            </p>
          </div>

          {/* زر الإضافة */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
