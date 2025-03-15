'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [imageUrl, setimageUrl] = useState('');  // <-- حقل رابط الصورة
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'categories'), {
        name,
        imageUrl, // <-- حفظ رابط الصورة
      });
      router.push('/categories'); // العودة لقائمة الأصناف
    } catch (error) {
      console.error('خطأ في إضافة الصنف:', error);
      alert('حدث خطأ أثناء إضافة الصنف.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
        <h1 className="text-xl font-bold mb-4">إضافة صنف جديد</h1>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">اسم الصنف:</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">رابط الصورة:</label>
            <input
              type="text"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={imageUrl}
              onChange={(e) => setimageUrl(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              أدخل رابط الصورة (URL). يمكنك رفع الصورة في أي خدمة تخزين والحصول على رابطها.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة الصنف'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
