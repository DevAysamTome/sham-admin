'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function EditCategoryPage() {
  const [name, setName] = useState('');
  const [imageUrl, setimageUrl] = useState(''); // <-- حقل الصورة
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const docRef = doc(db, 'categories', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const categoryData = docSnap.data();
          setName(categoryData.name || '');
          setimageUrl(categoryData.imageUrl || ''); // <-- تعبئة حقل الصورة
        } else {
          alert('الصنف غير موجود!');
          router.push('/categories');
        }
      } catch (error) {
        console.error('خطأ في جلب الصنف:', error);
        alert('حدث خطأ أثناء جلب الصنف.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, 'categories', id);
      await updateDoc(docRef, {
        name,
        imageUrl, // <-- تحديث رابط الصورة
      });
      router.push('/categories'); // العودة لقائمة الأصناف
    } catch (error) {
      console.error('خطأ في تحديث الصنف:', error);
      alert('حدث خطأ أثناء تحديث الصنف.');
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
        <h1 className="text-xl font-bold mb-4">تعديل الصنف</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'جاري التحديث...' : 'تحديث الصنف'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
