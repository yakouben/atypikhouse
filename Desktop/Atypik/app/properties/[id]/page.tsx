"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Wifi, 
  Bed, 
  Bath, 
  Coffee, 
  Star, 
  Heart, 
  Share2, 
  ArrowLeft,
  Users,
  Euro,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/components/AuthProvider';

interface Property {
  id: string;
  name: string;
  location: string;
  category: string;
  price_per_night: number;
  max_guests: number;
  description: string;
  images: string[];
  maps_link?: string;
  is_published: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuthContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      loadProperty(params.id as string);
    }
  }, [params.id]);

  // Keyboard navigation for full image modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showFullImage) return;
      
      switch (event.key) {
        case 'Escape':
          setShowFullImage(false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
      }
    };

    if (showFullImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showFullImage]);

  // Touch gesture support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const loadProperty = async (id: string) => {
    try {
      console.log('🔍 Loading property with ID:', id);
      const response = await fetch(`/api/properties/${id}`);
      const result = await response.json();
      
      if (response.ok && result.data) {
        console.log('✅ Property loaded successfully:', result.data);
        setProperty(result.data);
      } else {
        console.error('❌ Error loading property:', result.error);
      }
    } catch (error) {
      console.error('❌ Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.images) {
      setSelectedImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2d5016]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Property not found</h1>
          <Button onClick={() => router.back()} className="bg-[#2d5016] hover:bg-[#1a3a0f] text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const categories = {
      'cabane_arbre': 'Cabanes dans les arbres',
      'yourte': 'Yourtes',
      'cabane_flottante': 'Cabanes flottantes',
      'autre': 'Autre hébergement'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryTags = (category: string) => {
    const tags = {
      'cabane_arbre': ['Authentic', 'Nature', 'Comfort', 'Unique'],
      'yourte': ['Authentic', 'Nature', 'Comfort', 'Unique'],
      'cabane_flottante': ['Authentic', 'Nature', 'Comfort', 'Unique'],
      'autre': ['Authentic', 'Nature', 'Comfort', 'Unique']
    };
    return tags[category as keyof typeof tags] || ['Authentic', 'Nature', 'Comfort', 'Unique'];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean, minimal top bar */}
      <div className="bg-white shadow-sm border-b border-[#696969]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Close button on top left */}
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 text-[#333333]" />
            </button>
            
            {/* Floating action buttons on top right */}
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-[#333333]" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-[#333333]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Property Title & Rating Section - Enhanced typography */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-3">
            {property.name}
          </h1>
          
          {/* Star rating system */}
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-[#daa520] fill-current" />
            <span className="font-bold text-[#333333] text-lg">4.92</span>
            <span className="text-[#696969] text-sm">(116 reviews)</span>
          </div>
          
          {/* Property type and host information */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-[#333333] font-medium">Entire home</span>
            <span className="text-[#696969]">•</span>
            <span className="text-[#333333]">Hosted by {userProfile?.full_name?.split(' ')[0] || 'Host'}</span>
          </div>
          
          {/* Location with pin icon */}
          <div className="flex items-center text-[#333333]">
            <MapPin className="w-4 h-4 mr-2 text-[#2d5016]" />
            <span className="text-sm sm:text-base font-medium">{property.location}</span>
          </div>
        </div>

        {/* Image Gallery - Full-width carousel slider */}
        <div className="mb-6 sm:mb-8">
          {property.images && property.images.length > 0 ? (
            <div className="relative">
              {/* Full-width carousel */}
              <div className="relative h-64 sm:h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={property.images[selectedImage]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Image counter overlay */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedImage + 1} / {property.images.length}
                </div>
                
                {/* Navigation arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#333333]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-[#333333]" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Carousel indicators */}
              {property.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImage ? 'bg-[#2d5016]' : 'bg-[#696969]/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 sm:h-80 bg-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-[#696969] text-sm sm:text-base">No images available</span>
            </div>
          )}
        </div>

        {/* Property Tags - Rounded pill buttons */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {getCategoryTags(property.category).map((tag, index) => (
            <Badge 
              key={index} 
              className="px-4 py-2 bg-[#87a96b]/20 text-[#333333] border border-[#87a96b]/30 rounded-full font-medium hover:bg-[#87a96b]/30 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Amenities Section - 2x2 grid layout */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-[#333333] mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-[#696969]/20">
              <div className="w-10 h-10 bg-[#2d5016]/10 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-[#2d5016]" />
              </div>
              <span className="font-medium text-[#333333]">Wi-Fi</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-[#696969]/20">
              <div className="w-10 h-10 bg-[#2d5016]/10 rounded-lg flex items-center justify-center">
                <Bed className="w-5 h-5 text-[#2d5016]" />
              </div>
              <span className="font-medium text-[#333333]">King Bed</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-[#696969]/20">
              <div className="w-10 h-10 bg-[#2d5016]/10 rounded-lg flex items-center justify-center">
                <Bath className="w-5 h-5 text-[#2d5016]" />
              </div>
              <span className="font-medium text-[#333333]">Bathup</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-[#696969]/20">
              <div className="w-10 h-10 bg-[#2d5016]/10 rounded-lg flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#2d5016]" />
              </div>
              <span className="font-medium text-[#333333]">Breakfast</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Enhanced with underline indicator */}
        <div className="border-b border-[#696969]/20 mb-6 sm:mb-8">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto">
            {['description', 'feature', 'virtual', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm sm:text-base capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-[#2d5016] text-[#2d5016]'
                    : 'border-transparent text-[#696969] hover:text-[#333333] hover:border-[#696969]/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content - Enhanced styling */}
        <div className="mb-6 sm:mb-8">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4">Our House</h3>
              <div className="prose max-w-none">
                <p className="text-[#333333] leading-relaxed text-sm sm:text-base">
                  {property.description || `Experience the ultimate comfort and luxury in our ${getCategoryLabel(property.category)}. 
                  This deluxe accommodation offers a perfect blend of modern amenities and natural beauty, 
                  making it ideal for couples, families, or solo travelers seeking a unique and memorable stay. 
                  With ${property.max_guests} guests capacity and stunning views, this property provides everything 
                  you need for a relaxing and enjoyable vacation.`}
                </p>
                <p className="text-[#333333] leading-relaxed mt-4 text-sm sm:text-base">
                  The property features comfortable sleeping arrangements, modern bathroom facilities, 
                  and a cozy living space designed for your comfort. Whether you're looking for a romantic getaway, 
                  a family vacation, or a peaceful retreat, this accommodation offers the perfect setting 
                  for creating lasting memories.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'feature' && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Wifi className="w-5 h-5 text-[#2d5016]" />
                  <span className="text-[#333333] font-medium">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Bed className="w-5 h-5 text-[#2d5016]" />
                  <span className="text-[#333333] font-medium">Comfortable Bedding</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Bath className="w-5 h-5 text-[#2d5016]" />
                  <span className="text-[#333333] font-medium">Private Bathroom</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Coffee className="w-5 h-5 text-[#2d5016]" />
                  <span className="text-[#333333] font-medium">Breakfast Included</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-[#2d5016]" />
                  <span className="text-[#333333] font-medium">Max {property.max_guests} Guests</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Euro className="w-5 h-5 text-[#2d5016]" />
                  <span className="text-[#333333] font-medium">€{property.price_per_night}/night</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'virtual' && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4">Virtual Tour</h3>
              <div className="bg-white rounded-2xl h-48 sm:h-64 flex items-center justify-center shadow-sm border border-[#696969]/20">
                <span className="text-[#696969] text-sm sm:text-base">Virtual tour coming soon</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4">Reviews</h3>
              <div className="bg-white rounded-2xl h-48 sm:h-64 flex items-center justify-center shadow-sm border border-[#696969]/20">
                <span className="text-[#696969] text-sm sm:text-base">Reviews coming soon</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Map Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4">Location</h3>
          <div className="relative">
            <div className="relative h-64 sm:h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={property.maps_link?.includes('embed') ? property.maps_link : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.location)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
              
              {/* Map Overlay with Info */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-[#696969]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2d5016]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#2d5016]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333] text-sm sm:text-base">Property Location</h4>
                    <p className="text-[#696969] text-xs sm:text-sm">{property.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Open in Maps Button */}
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => window.open(property.maps_link || `https://www.google.com/maps/search/${encodeURIComponent(property.location)}`, '_blank')}
                  className="bg-white/95 backdrop-blur-sm text-[#333333] hover:bg-white shadow-xl border border-[#696969]/20 flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Open in Maps</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Booking Card */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#696969]/20 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[#696969] text-sm">18 - 21 Oct • 3 nights</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#333333]">€{property.price_per_night}</span>
            </div>
            <Button className="bg-[#2d5016] hover:bg-[#1a3a0f] text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Book now
            </Button>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && property.images && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={property.images[selectedImage]}
              alt={property.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* Close button */}
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Navigation arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              {selectedImage + 1} / {property.images.length}
            </div>
            
            {/* Property name overlay */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold">{property.name}</h3>
              <p className="text-sm opacity-90">{property.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 