import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PT. Wahana Jaya Distribusi - Industrial Equipment Supplier',
  description: 'Leading industrial equipment supplier in Indonesia, providing high-quality products and solutions for various industrial applications.',
  keywords: 'industrial equipment, supplier, Indonesia, industrial solutions',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}