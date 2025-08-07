"use client";

import { useState, useEffect } from 'react';
import { Search, Calendar, Users, Heart, Share2, Star, Map, Grid3X3, List, HomeIcon, Filter, X, Menu, ArrowRight, TreePine, Tent, Anchor, Mountain, MapPin, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import HeroSection from '@/components/HeroSection';
import SignInModal from '@/components/SignInModal';
import OptimizedImage from '@/components/OptimizedImage';
import { useAuthContext } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

// SEO-optimized data with proper French keywords
const propertyTypes = [
  { name: 'Tous', active: true, slug: 'tous' },
  { name: 'Cabane', active: false, slug: 'cabane' },
  { name: 'Tiny house', active: false, slug: 'tiny-house' },
  { name: 'A-frame', active: false, slug: 'a-frame' },
  { name: 'Yourte', active: false, slug: 'yourte' },
  { name: 'Dôme', active: false, slug: 'dome' },
  { name: 'Cabane dans les arbres', active: false, slug: 'cabane-arbres' },
  { name: 'Maison flottante', active: false, slug: 'maison-flottante' },
];

const accommodationCategories = [
  {
    id: 1,
    name: 'Cabanes dans les arbres',
    description: 'Vivez une expérience unique perchée dans les arbres. Nos cabanes offrent une vue imprenable sur la nature et un confort moderne en harmonie avec l\'environnement.',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: TreePine,
    slug: 'cabanes-arbres',
    seoTitle: 'Cabanes dans les arbres - Hébergements insolites AtypikHouse',
    seoDescription: 'Découvrez nos cabanes dans les arbres pour un séjour unique en pleine nature. Réservez votre cabane perchée avec AtypikHouse.'
  },
  {
    id: 2,
    name: 'Yourtes',
    description: 'Découvrez le confort traditionnel des yourtes. Ces hébergements circulaires offrent une expérience authentique et chaleureuse au cœur de la nature.',
    image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Tent,
    slug: 'yourtes',
    seoTitle: 'Yourtes traditionnelles - Hébergements insolites AtypikHouse',
    seoDescription: 'Séjournez dans nos yourtes traditionnelles pour une expérience authentique. Réservez votre yourte avec AtypikHouse.'
  },
  {
    id: 3,
    name: 'Cabanes flottantes',
    description: 'Sur l\'eau, en harmonie avec les éléments. Nos cabanes flottantes vous offrent une expérience unique entre ciel et eau.',
    image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Anchor,
    slug: 'cabanes-flottantes',
    seoTitle: 'Cabanes flottantes - Hébergements insolites AtypikHouse',
    seoDescription: 'Vivez une expérience unique dans nos cabanes flottantes. Réservez votre cabane sur l\'eau avec AtypikHouse.'
  },
  {
    id: 4,
    name: 'Autres hébergements',
    description: 'Explorez notre collection d\'hébergements insolites. Des cabanes A-frame aux tiny houses, chaque option est unique.',
    image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Mountain,
    slug: 'autres-hebergements',
    seoTitle: 'Autres hébergements insolites - AtypikHouse',
    seoDescription: 'Découvrez notre collection d\'hébergements insolites : cabanes A-frame, tiny houses et plus encore avec AtypikHouse.'
  },
];

interface Property {
  id: string;
  name: string;
  category: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  description: string;
  images: string[];
  is_published: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const { user, userProfile, loading } = useAuthContext();
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState(['Tous']);
  const [priceRange, setPriceRange] = useState([1, 1500]);
  const [budgetType, setBudgetType] = useState('Per Night');
  const [viewType, setViewType] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInMode, setSignInMode] = useState<'login' | 'signup' | 'userType'>('login');
  const [userType, setUserType] = useState<'owner' | 'client' | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && user && userProfile) {
      const userType = userProfile.user_type;
      if (userType === 'owner') {
        router.push('/dashboard/owner');
      } else if (userType === 'client') {
        router.push('/dashboard/client');
      }
    }
  }, [user, userProfile, loading, router]);

  // Load properties
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setPropertiesLoading(true);
    try {
      const response = await fetch('/api/properties?published=true&available=true');
      const result = await response.json();
      
      if (response.ok && result.data) {
        setProperties(result.data);
        console.log('✅ Properties loaded successfully:', result.data);
        console.log('✅ Number of properties:', result.data.length);
        if (result.data.length > 0) {
          console.log('✅ First property:', result.data[0]);
        }
      } else {
        console.error('❌ Error loading properties:', result.error);
        setProperties([]);
      }
    } catch (error) {
      console.error('❌ Error loading properties:', error);
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const togglePropertyType = (type: string) => {
    if (type === 'Tous') {
      setSelectedTypes(['Tous']);
    } else {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type && t !== 'Tous')
        : [...selectedTypes.filter(t => t !== 'Tous'), type];
      
      setSelectedTypes(newTypes.length === 0 ? ['Tous'] : newTypes);
    }
  };

  const handleOpenSignIn = () => {
    setShowSignInModal(true);
  };

  const handleConnexionClick = () => {
    setSignInMode('login');
    setUserType(null);
    setShowSignInModal(true);
  };

  const handleInscriptionClick = () => {
    setSignInMode('userType');
    setUserType(null);
    setShowSignInModal(true);
  };

  const handleCloseModal = () => {
    setShowSignInModal(false);
    setSignInMode('login');
    setUserType(null);
  };

  const handlePropertyClick = (propertyId: string) => {
    console.log('🔍 Navigating to property:', propertyId);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Target URL:', `/properties/${propertyId}`);
    
    // Force navigation
    window.location.href = `/properties/${propertyId}`;
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      'cabane_arbre': 'Cabanes dans les arbres',
      'yourte': 'Yourtes',
      'cabane_flottante': 'Cabanes flottantes',
      'autre': 'Autre hébergement'
    };
    return categories[category as keyof typeof categories] || category;
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user && userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirection vers votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-slate-100">
        {/* Hero Section */}
        <HeroSection 
          onReserverClick={handleOpenSignIn} 
          onAddPropertyClick={handleOpenSignIn}
          onConnexionClick={handleConnexionClick}
          onInscriptionClick={handleInscriptionClick}
        />

        {/* Sign In Modal */}
        <SignInModal 
          isOpen={showSignInModal} 
          onClose={handleCloseModal}
          initialStep={signInMode}
          initialUserType={userType}
        />

        {/* Categories Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Nos Catégories d'Hébergements
              </h2>
              <p className="text-gray-600 text-base max-w-xl mx-auto">
                Découvrez nos différents types d'hébergements insolites et éco-responsables
              </p>
            </div>
            
            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {accommodationCategories.map((category, index) => (
                <article key={category.id} className="relative group cursor-pointer">
                  {/* Background Image */}
                  <div className="relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden">
                    <img
                      src={`/img${(index % 6) + 1}.jpg`}
                      alt={`${category.name} - AtypikHouse`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                        <div className="space-y-2">
                          <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                            {category.name}
                          </h3>
                          <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {category.description}
                          </p>
                      </div>
                      </div>
                    </div>
                    
                    {/* Arrow Button */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <ArrowRight className="w-3 h-3 text-gray-900" />
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Desktop Search Bar */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                className="pl-10 py-3 border-0 bg-gray-50 rounded-xl text-gray-700"
                placeholder="Lake Tahoe, California"
                value="Lake Tahoe, California"
              />
            </div>
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Mon, 10.07 - Sun, 10.13</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">2 adult • 0 children</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-medium">
              Search
            </Button>
          </div>
        </div>

          <div className="flex flex-col gap-4 lg:gap-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">{properties.length} variants</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              <Button
                variant={viewType === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('grid')}
                className="w-10 h-10 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('list')}
                className="w-10 h-10 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Mobile Filter Content */}
                <div className="space-y-6">
                  {/* Map */}
                  <div className="bg-white rounded-2xl border p-4">
                    <div className="w-full h-32 bg-gradient-to-br from-teal-300 to-teal-500 rounded-xl relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Button variant="outline" size="sm" className="bg-white/90 w-8 h-8 p-0">
                          <Map className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property type</h3>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.name}
                          onClick={() => togglePropertyType(type.name)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedTypes.includes(type.name)
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your budget</h3>
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                      <button
                        onClick={() => setBudgetType('Per Night')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          budgetType === 'Per Night'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        Per Night
                      </button>
                      <button
                        onClick={() => setBudgetType('Entire stay')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          budgetType === 'Entire stay'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        Entire stay
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>from</span>
                        <span>to</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-16 text-center text-sm"
                        />
                        <div className="flex-1">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1500}
                            min={1}
                            step={10}
                            className="w-full"
                          />
                        </div>
                        <span className="text-sm text-gray-600">1500+</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="all-rating-mobile" defaultChecked />
                          <label htmlFor="all-rating-mobile" className="text-sm text-gray-700">All</label>
                        </div>
                        <span className="text-sm text-gray-500">{properties.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="5-stars-mobile" />
                          <label htmlFor="5-stars-mobile" className="text-sm text-gray-700">5 stars</label>
                        </div>
                        <span className="text-sm text-gray-500">33</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="4-stars-mobile" />
                          <label htmlFor="4-stars-mobile" className="text-sm text-gray-700">4 stars</label>
                        </div>
                        <span className="text-sm text-gray-500">289</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="3-stars-mobile" />
                          <label htmlFor="3-stars-mobile" className="text-sm text-gray-700">3 stars</label>
                        </div>
                        <span className="text-sm text-gray-500">615</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
            <div className="w-full">
            {/* Desktop Results Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <span className="text-gray-700 font-medium">{properties.length} variants</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                  className="w-10 h-10 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  className="w-10 h-10 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Property Grid */}
            {propertiesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hébergement trouvé</h3>
                <p className="text-gray-500">Aucune propriété disponible pour le moment</p>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewType === 'list' 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {properties.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100 hover:border-green-200"
                    onClick={() => {
                      console.log('🎯 Property clicked:', property.id, property.name);
                      handlePropertyClick(property.id);
                    }}
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={`${property.name} - AtypikHouse`}
                          className="w-full h-48 sm:h-64 object-cover rounded-t-2xl sm:rounded-t-3xl group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            console.log('❌ Image failed to load:', property.images[0]);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl sm:rounded-t-3xl flex items-center justify-center">
                          <Mountain className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Favorite Button */}
                      <button 
                        className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle favorite
                        }}
                      >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </button>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 shadow-lg">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs sm:text-sm font-semibold text-gray-900">4.9</span>
                        </div>
                      </div>
                      
                      {/* Property Type Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-green-600 text-white border-0 px-2 py-1 sm:px-3 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                          {getCategoryLabel(property.category)}
                        </Badge>
                      </div>
                      
                      {/* Price Tag */}
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-100">
                          <span className="text-sm sm:text-base font-bold text-gray-900">€{property.price_per_night}</span>
                          <span className="text-xs text-gray-600 ml-1">/night</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-4 sm:p-6">
                      {/* Property Name */}
                      <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-1">
                        {property.name}
                      </h3>
                      
                      {/* Location */}
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      
                      {/* Details */}
                      <div className="flex items-center text-gray-600 text-sm mb-4 space-x-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{property.max_guests} guests</span>
                        </div>
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>2 beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>2 baths</span>
                        </div>
                      </div>
                      
                      {/* CTA Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">€{property.price_per_night}</span>
                          <span className="text-gray-500 text-sm">night</span>
                        </div>
                        
                        {/* View Details Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300 group-hover:scale-110 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('🎯 View details clicked for:', property.id);
                            handlePropertyClick(property.id);
                          }}
                        >
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900 group-hover:text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}