import Link from 'next/link';
import Header from '@/app/(frontend)/components/Header';
import Footer from '@/app/(frontend)/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center max-w-md px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            The product you are looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/"
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 