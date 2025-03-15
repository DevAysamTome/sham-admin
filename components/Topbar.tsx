'use client';
import { useAuth } from './AuthProvider';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold">مرحبًا بك في لوحة التحكم</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* لا نظهر أي معلومات إلا إذا كان هناك مستخدم */}
        {user && (
          <>
            <span className="text-sm text-gray-600">مسجّل باسم: {user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              تسجيل الخروج
            </button>
          </>
        )}
      </div>
    </header>
  );
}
