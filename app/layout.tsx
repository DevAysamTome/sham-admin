import './globals.css';
import AuthWrapper from '../components/AuthWrapper';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'لوحة التحكم تطبيق شام',
  description: 'تصميم وبرمجة شركة تكنو كور 2025 ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-100 text-gray-800">
        <AuthWrapper>
          <div className="flex min-h-screen">
            {/* الشريط الجانبي */}
            <Sidebar />

            {/* المحتوى الرئيسي */}
            <div className="flex flex-col flex-1">
              {/* الشريط العلوي */}
              <Topbar />

              {/* المحتوى الداخلي للصفحات */}
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
          <Footer />
        </AuthWrapper>
        
      </body>
    </html>
  );
}
