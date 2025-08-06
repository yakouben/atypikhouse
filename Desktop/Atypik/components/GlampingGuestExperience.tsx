"use client";

import { useState, useEffect } from 'react';
import { 
  Search,
  MapPin,
  Calendar,
  Users,
  Filter,
  Heart,
  Star,
  Bed,
  Bath,
  Wifi,
  Coffee,
  Car,
  Mountain,
  Tent,
  Home,
  Castle,
  Caravan,
  ArrowRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  Map,
  Share2,
  MoreVertical,
  TreePine,
  User,
  LogOut
} from 'lucide-react';
import { useAuthContext } from '@/components/AuthProvider';

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

const propertyTypes = [
  { name: 'Tous', icon: TreePine, color: '#4A7C59' },
  { name: 'Cabanes', icon: Home, color: '#4A7C59' },
  { name: 'Tipis', icon: Tent, color: '#8B4513' },
  { name: 'Yourtes', icon: Castle, color: '#DAA520' },
  { name: 'Tiny Houses', icon: Home, color: '#2C3E37' },
  { name: 'Pods', icon: Caravan, color: '#6B8E23' },
  { name: 'Tentes Safari', icon: Tent, color: '#CD853F' }
];

const amenities = [
  { name: 'WiFi', icon: Wifi },
  { name: 'Petit-déjeuner', icon: Coffee },
  { name: 'Parking', icon: Car },
  { name: 'Vue montagne', icon: Mountain }
];

export default function GlampingGuestExperience() {
  const { userProfile, getPublishedProperties, signOut } = useAuthContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // Use the new API route to get all published properties
      const response = await fetch('/api/properties?published=true&available=true');
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
        console.log('Sign out successful, redirecting to home...');
        // The AuthProvider will handle the redirect automatically
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'Tous' || getCategoryLabel(property.category) === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'cabane_arbre': 'Cabanes',
      'yourte': 'Yourtes',
      'cabane_flottante': 'Cabanes',
      'autre': 'Autre hébergement'
    };
    return categoryMap[category] || category;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2C3E37] to-[#4A7C59] rounded-xl flex items-center justify-center">
              <TreePine className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E37]">
                Bonjour, {userProfile?.full_name || 'Voyageur'}
              </h1>
              <p className="text-gray-600">Découvrez des hébergements insolites et éco-responsables</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-[#4A7C59] transition-colors">
              <User className="w-5 h-5" />
              <span>Profil</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#4A7C59] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un hébergement, une destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:border-[#4A7C59] transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Filtres</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center space-x-2 transition-colors ${
                activeTab === 'discover' 
                  ? 'text-[#4A7C59] font-medium' 
                  : 'text-gray-600 hover:text-[#4A7C59]'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Découvrir</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center space-x-2 transition-colors ${
                activeTab === 'bookings' 
                  ? 'text-[#4A7C59] font-medium' 
                  : 'text-gray-600 hover:text-[#4A7C59]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Mes réservations</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center space-x-2 transition-colors ${
                activeTab === 'favorites' 
                  ? 'text-[#4A7C59] font-medium' 
                  : 'text-gray-600 hover:text-[#4A7C59]'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Favoris</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#4A7C59] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#4A7C59] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Filter Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-[#2C3E37] mb-4">Types d'Hébergements</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {propertyTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.name}
                      onClick={() => setSelectedFilter(type.name)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all ${
                        selectedFilter === type.name
                          ? 'bg-[#4A7C59] text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Properties Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#2C3E37]">
                  {filteredProperties.length} hébergements trouvés
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="text-[#4A7C59] hover:text-[#2C3E37] transition-colors">
                    <Map className="w-5 h-5" />
                  </button>
                  <button className="text-[#4A7C59] hover:text-[#2C3E37] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hébergement trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('Tous');
                    }}
                    className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
                  >
                    Voir tous les hébergements
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'list' 
                    ? 'grid-cols-1' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Mountain className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <button className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors">
                            <Share2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-[#4A7C59] text-white px-2 py-1 rounded-full text-xs font-medium">
                            {getCategoryLabel(property.category)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[#2C3E37] mb-2">{property.name}</h3>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        
                        {/* Amenities */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center text-gray-600">
                            <Bed className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.max_guests} voyageurs</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Bath className="w-4 h-4 mr-1" />
                            <span className="text-sm">2 salles de bain</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold text-[#2C3E37]">€{property.price_per_night}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{property.rating}</span>
                          </div>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-center space-x-2">
                          <span>Voir les détails</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-[#2C3E37] mb-4">Mes Réservations</h2>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore de réservations. Commencez à explorer nos hébergements !
              </p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
              >
                Découvrir les hébergements
              </button>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-[#2C3E37] mb-4">Mes Favoris</h2>
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori</h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore ajouté d'hébergements à vos favoris.
              </p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
              >
                Découvrir les hébergements
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 