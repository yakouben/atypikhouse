"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/AuthProvider';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  const { user, userProfile, loading } = useAuthContext();
  const router = useRouter();

  const handleReserverClick = () => {
    router.push('/search');
  };

  const handleAddPropertyClick = () => {
    router.push('/host');
  };

  const handleConnexionClick = () => {
    router.push('/auth/login');
  };

  const handleInscriptionClick = () => {
    router.push('/auth/register');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection 
        onReserverClick={handleReserverClick}
        onAddPropertyClick={handleAddPropertyClick}
        onConnexionClick={handleConnexionClick}
        onInscriptionClick={handleInscriptionClick}
      />

      {/* Add more sections here as needed */}
      {/* Example: About section, Features section, etc. */}
      
    </div>
  );
}