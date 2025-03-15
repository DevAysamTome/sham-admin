'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function EditProductPage() {
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

  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          setName(productData.name || '');
          setPrice(productData.price || 0);
          setDiscount(productData.discount || 0);
          setSizes(productData.sizes || []);
          setImageURL(productData.imageURL || '');
        } else {
          alert('المنتج غير موجود!');
          router.push('/products');
        }
      } catch (error) {
        console.error('خطأ في جلب المنتج:', error);
        alert('حدث خطأ أثناء جلب المنتج.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  // إضافة حجم جديد
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        name,
        price,
        discount,
        sizes,
        imageURL,
      });
      router.push('/products'); // العودة لقائمة المنتجات
    } catch (error) {
      console.error('خطأ في تحديث المنتج:', error);
      alert('حدث خطأ أثناء تحديث المنتج.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
        <h1 className="text-xl font-bold mb-4">تعديل المنتج</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
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
              أدخل قيمة الخصم كنسبة مئوية (مثلاً 10 يعني 10%)
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
          </div>

          {/* زر التحديث */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'جاري التحديث...' : 'تحديث المنتج'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
