import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import SplashVideo from '@/components/SplashVideo'; // 暂时关闭开篇动画，待服务器升级后恢复

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Background effects */}
      <div className="bg-pattern">
        <div className="bg-grid" />
      </div>

      <Header />
      <main className="pt-20 relative">{children}</main>
      <Footer />
    </>
  );
}
