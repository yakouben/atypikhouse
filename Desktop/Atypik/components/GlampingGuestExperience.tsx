"use client";

import { useState, useEffect } from 'react';
import { 
  MapPin,
  Calendar,
  Users,
  Star,
  Bed,
  Bath,
  Wifi,
  Coffee,
  Car,
  Mountain,
  Home,
  Castle,
  Caravan,
  ArrowRight,
  Grid3X3,
  List,
  TreePine,
  User,
  LogOut
} from 'lucide-react';
import { useAuthContext } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  rating: number;
  is_available: boolean;
  images: string[];
  amenities: string[];
  description: string;
  category: string; // Added category field
}

// Only the 4 database categories
const accommodationCategories = [
  { name: 'Tous', icon: TreePine, category: 'all' },
  { name: 'Cabanes dans les arbres', icon: TreePine, category: 'cabane_arbre' },
  { name: 'Yourtes', icon: Castle, category: 'yourte' },
  { name: 'Cabanes flottantes', icon: Caravan, category: 'cabane_flottante' },
  { name: 'Autres hébergements', icon: Home, category: 'autre' }
];

const amenities = [
  { name: 'WiFi', icon: Wifi },
  { name: 'Petit-déjeuner', icon: Coffee },
  { name: 'Parking', icon: Car },
  { name: 'Vue montagne', icon: Mountain }
];

export default function GlampingGuestExperience() {
  const { userProfile, getPublishedProperties, signOut } = useAuthContext();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProperties();
  }, [selectedCategory]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all' 
        ? '/api/properties?published=true&available=true' 
        : `/api/properties?category=${selectedCategory}&published=true&available=true`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok && result.data) {
        setProperties(result.data);
        console.log('Properties loaded successfully:', result.data);
      } else {
        console.error('Error loading properties:', result.error);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('User initiated sign out...');
      const result = await signOut();
      
      if (result.error) {
        console.error('Sign out error:', result.error);
        // You could show an error message to the user here
      } else {
        console.log('Sign out successful, redirecting to old hero section...');
        // Redirect to the old hero section
        router.push('/hero');
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      'cabane_arbre': 'Cabanes dans les arbres',
      'yourte': 'Yourtes',
      'cabane_flottante': 'Cabanes flottantes',
      'autre': 'Autres hébergements'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const handlePropertyClick = (propertyId: string) => {
    console.log('🔍 Navigating to property:', propertyId);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Target URL:', `/properties/${propertyId}`);
    
    // Force navigation
    window.location.href = `/properties/${propertyId}`;
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C3E37] to-[#4A7C59] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Découverte des hébergements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Découvrir</h1>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-sm border border-red-200 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un hébergement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Category Filters - Only the 4 database categories */}
            <div className="flex flex-wrap gap-2">
              {accommodationCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.category)}
                    className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hébergement trouvé</h3>
            <p className="text-gray-500">
              {selectedCategory === 'all' 
                ? 'Aucune propriété disponible pour le moment' 
                : `Aucune propriété trouvée dans la catégorie "${getCategoryLabel(selectedCategory)}"`
              }
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'list' 
              ? 'grid-cols-1' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="relative h-48 sm:h-52 lg:h-48 xl:h-52 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Mountain className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-[#4A7C59] text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                      {getCategoryLabel(property.category)}
                    </span>
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-100">
                      <span className="text-sm font-bold text-gray-900">€{property.price_per_night}</span>
                      <span className="text-xs text-gray-600 ml-1">/night</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-5 lg:p-4 xl:p-5">
                  <h3 className="font-semibold text-[#2C3E37] mb-2 text-base sm:text-lg group-hover:text-green-600 transition-colors duration-300 line-clamp-1">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{property.location}</span>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.max_guests} guests</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-[#2C3E37]">€{property.price_per_night}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{property.rating || 4.9}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePropertyClick(property.id);
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 