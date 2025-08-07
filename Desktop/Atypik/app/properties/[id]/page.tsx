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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
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
      'cabane_arbre': ['Minimalist', 'Beach House', 'Tropic', 'Private Pool'],
      'yourte': ['Authentic', 'Nature', 'Comfort', 'Unique'],
      'cabane_flottante': ['Waterfront', 'Peaceful', 'Floating', 'Scenic'],
      'autre': ['Unique', 'Comfortable', 'Modern', 'Cozy']
    };
    return tags[category as keyof typeof tags] || ['Comfortable', 'Unique', 'Modern'];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Property Title and Rating */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {property.name}
          </h1>
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-900">4.92</span>
              <span className="text-gray-600">(116 reviews)</span>
            </div>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">Entire home</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">Hosted by {userProfile?.full_name?.split(' ')[0] || 'Host'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">{property.location}</span>
          </div>
        </div>

        {/* Enhanced Property Images - Mobile Horizontal Scroll */}
        <div className="mb-6 sm:mb-8">
          {property.images && property.images.length > 0 ? (
            <div className="relative">
              {/* Desktop Grid Layout */}
              <div className="hidden sm:grid sm:grid-cols-4 gap-2 sm:gap-4">
                {/* Main large image */}
                <div className="col-span-2 row-span-2 relative group">
                  <img
                    src={property.images[selectedImage] || property.images[0]}
                    alt={property.name}
                    className="w-full h-48 sm:h-96 object-cover rounded-xl sm:rounded-2xl cursor-pointer hover:opacity-90 transition-all duration-300 group-hover:scale-105"
                    onClick={() => setShowFullImage(true)}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* View fullscreen indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View fullscreen
                  </div>
                </div>
                {/* Smaller images */}
                {property.images.slice(0, 3).map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`${property.name} - Image ${index + 1}`}
                      className="w-full h-24 sm:h-48 object-cover rounded-xl sm:rounded-2xl cursor-pointer hover:opacity-80 transition-all duration-300 group-hover:scale-105"
                      onClick={() => setSelectedImage(index)}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Image number indicator */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      {index + 2}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Horizontal Scroll Layout */}
              <div className="sm:hidden relative">
                <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 pb-4 -mx-4 px-4">
                  {property.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-80 h-64 snap-center relative group"
                    >
                      <img
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                        onClick={() => {
                          setSelectedImage(index);
                          setShowFullImage(true);
                        }}
                      />
                      {/* Image overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Image counter */}
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {index + 1} / {property.images.length}
                      </div>
                      
                      {/* Tap to view indicator */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to view
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Scroll indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImage ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation arrows for mobile */}
              <div className="sm:hidden absolute top-1/2 left-4 transform -translate-y-1/2">
                <button
                  onClick={prevImage}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="sm:hidden absolute top-1/2 right-4 transform -translate-y-1/2">
                <button
                  onClick={nextImage}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          ) : (
            <div className="col-span-4 h-48 sm:h-96 bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <span className="text-gray-500 text-sm sm:text-base">No images available</span>
            </div>
          )}
        </div>

        {/* Property Tags */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {getCategoryTags(property.category).map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1 sm:px-3 text-xs sm:text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Hotel Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium">Wi-Fi</span>
          </div>
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium">King Bed</span>
          </div>
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium">Bathup</span>
          </div>
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium">Breakfast</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {['description', 'feature', 'virtual', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-6 sm:mb-8">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Our House</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {property.description || `Experience the ultimate comfort and luxury in our ${getCategoryLabel(property.category)}. 
                  This deluxe accommodation offers a perfect blend of modern amenities and natural beauty, 
                  making it ideal for couples, families, or solo travelers seeking a unique and memorable stay. 
                  With ${property.max_guests} guests capacity and stunning views, this property provides everything 
                  you need for a relaxing and enjoyable vacation.`}
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 text-sm sm:text-base">
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
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm sm:text-base">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-4 h-4 text-green-600" />
                  <span className="text-sm sm:text-base">Comfortable Bedding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="w-4 h-4 text-green-600" />
                  <span className="text-sm sm:text-base">Private Bathroom</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4 text-green-600" />
                  <span className="text-sm sm:text-base">Breakfast Included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm sm:text-base">Max {property.max_guests} Guests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Euro className="w-4 h-4 text-green-600" />
                  <span className="text-sm sm:text-base">€{property.price_per_night}/night</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'virtual' && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Virtual Tour</h3>
              <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-48 sm:h-64 flex items-center justify-center">
                <span className="text-gray-500 text-sm sm:text-base">Virtual tour coming soon</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Reviews</h3>
              <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-48 sm:h-64 flex items-center justify-center">
                <span className="text-gray-500 text-sm sm:text-base">Reviews coming soon</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Map Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Location</h3>
          <div className="relative">
            {property.maps_link ? (
              <div className="relative">
                {/* Map Preview */}
                <div className="relative h-64 sm:h-80 bg-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  {/* Google Maps Embed - Using the owner's provided maps_link */}
                  <iframe
                    src={property.maps_link.includes('embed') ? property.maps_link : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.location)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl sm:rounded-2xl"
                  />
                  
                  {/* Map Overlay with Info */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Property Location</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">{property.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Open in Maps Button */}
                  <div className="absolute bottom-4 right-4">
                    <Button
                      onClick={() => window.open(property.maps_link, '_blank')}
                      className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-xl border border-gray-100 flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">Open in Maps</span>
                    </Button>
                  </div>
                  
                  {/* Map Controls Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-gray-100 hover:bg-white transition-all duration-300 hover:scale-105">
                      <MapPin className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-gray-100 hover:bg-white transition-all duration-300 hover:scale-105">
                      <Star className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                {/* Fallback map using Google Maps embed with location */}
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.location)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl sm:rounded-2xl"
                />
                
                {/* Map Overlay with Info */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Property Location</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{property.location}</p>
                    </div>
                  </div>
                </div>
                
                {/* Open in Maps Button */}
                <div className="absolute bottom-4 right-4">
                  <Button
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(property.location)}`, '_blank')}
                    className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-xl border border-gray-100 flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Open in Maps</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Luxury Booking Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ready to Book?</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Experience luxury and comfort in this amazing {getCategoryLabel(property.category).toLowerCase()}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">4.9</span>
                    <span className="text-sm text-gray-600">(127 reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Max {property.max_guests} guests</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">€{property.price_per_night}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Book Now
                </Button>
              </div>
            </div>
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