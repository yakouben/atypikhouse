"use client";

import { useState, useEffect } from 'react';
import { Search, Calendar, Users, Heart, Share2, Star, Map, Grid3X3, List, HomeIcon, Filter, X, Menu, ArrowRight, TreePine, Tent, Anchor, Mountain } from 'lucide-react';
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

const properties = [
  {
    id: 1,
    name: 'Eco Lodge',
    type: 'Tiny house',
    rating: 4.78,
    nights: 6,
    adults: 2,
    price: 1089,
    originalPrice: 1389,
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Eco-friendly & Sustainable',
    location: 'Pierrefonds, Oise',
    slug: 'eco-lodge-pierrefonds'
  },
  {
    id: 2,
    name: 'Redwood Retreat',
    type: 'Cabane',
    rating: 4.88,
    nights: 6,
    adults: 2,
    price: 720,
    image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Nature Immersion',
    location: 'Forêt de Compiègne',
    slug: 'redwood-retreat-compiegne'
  },
  {
    id: 3,
    name: 'Sun Shores',
    type: 'A-frame',
    rating: 4.96,
    nights: 6,
    adults: 2,
    price: 1172,
    image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Mountain Views',
    location: 'Alpes françaises',
    slug: 'sun-shores-alpes'
  },
  {
    id: 4,
    name: 'Eco Haven',
    type: 'Cabane',
    rating: 4.72,
    nights: 6,
    adults: 2,
    price: 980,
    image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Lakeside Serenity',
    location: 'Lac de l\'Ailette',
    slug: 'eco-haven-lac-aillette'
  },
  {
    id: 5,
    name: 'Nature Harmony',
    type: '',
    rating: 4.73,
    nights: 6,
    adults: 2,
    price: 850,
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Forest Retreat',
    location: 'Forêt de Retz',
    slug: 'nature-harmony-foret-retz'
  },
  {
    id: 6,
    name: 'Quiet Cove',
    type: '',
    rating: 4.53,
    nights: 6,
    adults: 2,
    price: 650,
    image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Secluded Paradise',
    location: 'Côte d\'Azur',
    slug: 'quiet-cove-cote-azur'
  },
  {
    id: 7,
    name: 'Lakeside Eco Nook',
    type: '',
    rating: 4.91,
    nights: 6,
    adults: 2,
    price: 920,
    image: 'https://images.pexels.com/photos/2962135/pexels-photo-2962135.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Waterfront Luxury',
    location: 'Lac du Der',
    slug: 'lakeside-eco-nook-lac-der'
  },
  {
    id: 8,
    name: 'Forest Refuge',
    type: '',
    rating: 4.85,
    nights: 6,
    adults: 2,
    price: 780,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400',
    care: 'Wilderness Escape',
    location: 'Vosges',
    slug: 'forest-refuge-vosges'
  },
];

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
            <span className="text-gray-700 font-medium">1258 variants</span>
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
                        <span className="text-sm text-gray-500">1258</span>
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
              <span className="text-gray-700 font-medium">1258 variants</span>
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
              <div className={`grid gap-6 ${
              viewType === 'list' 
                ? 'grid-cols-1' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
            }`}>
              {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {/* Image Section */}
                  <div className="relative">
                      <OptimizedImage
                      src={property.image}
                        alt={`${property.name} - AtypikHouse`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-64 object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Favorite Button */}
                      <button className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                        <Heart className="w-5 h-5 text-white" />
                      </button>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
                        </div>
                      </div>
                      
                      {/* Property Type Badge */}
                      {property.type && (
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-green-600 text-white border-0 px-3 py-1 rounded-full text-xs font-medium">
                            {property.type}
                          </Badge>
                    </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6">
                      {/* Property Name */}
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {property.name}
                      </h3>
                      
                      {/* Care/Experience Type */}
                      <p className="text-gray-500 text-sm mb-3">
                        {property.care}
                      </p>
                      
                      {/* Details */}
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <span>{property.nights} nights</span>
                        <span className="mx-2">•</span>
                        <span>{property.adults} adults</span>
                    </div>
                      
                      {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {property.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">${property.originalPrice}</span>
                        )}
                          <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                          <span className="text-gray-500 text-sm">night</span>
                        </div>
                        
                        {/* View Details Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 group-hover:scale-110"
                        >
                          <ArrowRight className="w-4 h-4 text-gray-900" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}