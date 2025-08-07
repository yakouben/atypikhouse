"use client";

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  Settings, 
  Plus, 
  Edit, 
  Eye, 
  Star, 
  MapPin, 
  Users, 
  Euro,
  TreePine,
  LogOut,
  Mail,
  TrendingUp,
  TrendingDown,
  Camera,
  Wifi,
  Coffee,
  Car,
  Bath,
  Bed,
  Mountain,
  Tent,
  Castle,
  Caravan,
  Filter,
  MoreVertical,
  Trash2,
  Menu
} from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import PropertyForm from './PropertyForm';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  category: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  rating: number;
  is_available: boolean;
  images: string[];
  description: string;
  maps_link: string;
  created_at: string;
}

export default function GlampingDashboard() {
  const { userProfile, getOwnerProperties, getOwnerBookings, signOut } = useAuthContext();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProperties(),
        loadBookings()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties?ownerId=' + userProfile?.id);
      const result = await response.json();
      
      if (response.ok && result.data) {
        setProperties(result.data);
      } else {
        console.error('Error loading properties:', result.error);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
        setProperties([]);
      }
    };

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/bookings?ownerId=' + userProfile?.id);
      const result = await response.json();
      
      if (response.ok && result.data) {
        setBookings(result.data);
      } else {
        console.error('Error loading bookings:', result.error);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }

    setDeletingProperty(propertyId);
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== propertyId));
      } else {
        const result = await response.json();
        alert('Erreur lors de la suppression: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeletingProperty(null);
    }
  };

  const handlePropertySuccess = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
    loadProperties();
  };

  const handlePropertyClick = (propertyId: string) => {
    console.log('🔍 Navigating to property:', propertyId);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Target URL:', `/properties/${propertyId}`);
    
    // Force navigation
    window.location.href = `/properties/${propertyId}`;
  };

  const handleSignOut = async () => {
    try {
      console.log('User initiated sign out...');
      const result = await signOut();
      
      if (result.error) {
        console.error('Sign out error:', result.error);
        alert('Erreur lors de la déconnexion. Veuillez réessayer.');
      } else {
        console.log('Sign out successful, redirecting to old hero section...');
        // Redirect to the old hero section
        router.push('/hero');
      }
    } catch (error) {
      console.error('Sign out exception:', error);
      alert('Erreur lors de la déconnexion. Veuillez réessayer.');
    }
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2C3E37] to-[#4A7C59] rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#2C3E37]">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-sm">Gérez vos propriétés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button className="flex items-center space-x-2 text-green-600 font-medium">
              <LayoutDashboard className="w-5 h-5" />
              <span>Tableau de bord</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Home className="w-5 h-5" />
              <span>Mes propriétés</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Calendar className="w-5 h-5" />
              <span>Réservations</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-sm border border-red-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Bonjour Banner */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {getGreeting()}, {userProfile?.full_name?.split(' ')[0] || 'Propriétaire'}!
              </h2>
              <p className="text-green-100 text-lg">
                Découvrez vos propriétés et gérez vos réservations
              </p>
            </div>
          <button
              onClick={() => setShowPropertyForm(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all hover:bg-white/30 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Ajouter une propriété
          </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher vos propriétés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-600 text-sm">Total Propriétés</p>
                <p className="text-2xl font-bold text-[#2C3E37]">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              </div>
            </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Réservations</p>
                <p className="text-2xl font-bold text-[#2C3E37]">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revenus</p>
                <p className="text-2xl font-bold text-[#2C3E37]">€{properties.reduce((sum, p) => sum + p.price_per_night, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Euro className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
              </div>
            </div>

        {/* Properties Section */}
        <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Propriétés</h2>
            <button
              onClick={() => setShowPropertyForm(true)}
              className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-4 py-2 rounded-xl font-medium transition-all hover:shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
                </button>
              </div>
              
              {properties.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété</h3>
                  <p className="text-gray-600 mb-6">
                Commencez par ajouter votre première propriété pour la louer
              </p>
              <button
                onClick={() => setShowPropertyForm(true)}
                className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
              >
                Ajouter une propriété
                  </button>
                </div>
              ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties
                .filter(property => 
                  property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  property.location.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((property) => (
                <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                  <div className="relative h-48 sm:h-52 lg:h-48 xl:h-52 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
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
                          <div className="flex items-center text-gray-600">
                            <Bath className="w-4 h-4 mr-1" />
                        <span className="text-sm">2 baths</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold text-[#2C3E37]">€{property.price_per_night}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{property.rating || 4.9}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProperty(property);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 hover:scale-105"
                      >
                            <Edit className="w-4 h-4" />
                        <span>Edit</span>
                          </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropertyClick(property.id);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 hover:scale-105"
                      >
                            <Eye className="w-4 h-4" />
                        <span>View</span>
                          </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProperty(property.id);
                        }}
                        disabled={deletingProperty === property.id}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 hover:scale-105"
                      >
                        {deletingProperty === property.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          isOpen={showPropertyForm}
          onClose={() => {
            setShowPropertyForm(false);
            setEditingProperty(null);
          }}
          property={editingProperty}
          onSuccess={handlePropertySuccess}
        />
      )}
    </div>
  );
} 