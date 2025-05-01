import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kimsberlin - Opticals , Eyeglasses - Providing you the best eyeglasses solution Specialist',
  description: 'Kimsberlin - Opticals , Eyeglasses',
  robots: 'index,follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}