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
  User,
  LogOut,
  Search,
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
  Heart,
  Share2,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import PropertyForm from './PropertyForm';

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

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  guest_count: number;
  properties: {
    name: string;
    location: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

const propertyTypes = [
  { name: 'Cabanes', icon: Home, color: '#4A7C59' },
  { name: 'Tipis', icon: Tent, color: '#8B4513' },
  { name: 'Yourtes', icon: Castle, color: '#DAA520' },
  { name: 'Tiny Houses', icon: Home, color: '#2C3E37' },
  { name: 'Pods', icon: Caravan, color: '#6B8E23' },
  { name: 'Tentes Safari', icon: Tent, color: '#CD853F' }
];

export default function GlampingDashboard() {
  const { userProfile, getOwnerProperties, getOwnerBookings, signOut } = useAuthContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.id) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [propertiesData, bookingsData] = await Promise.all([
        getOwnerProperties(userProfile!.id),
        getOwnerBookings(userProfile!.id)
      ]);

      if (propertiesData.data) setProperties(propertiesData.data);
      if (bookingsData.data) setBookings(bookingsData.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  const handlePropertySuccess = () => {
    loadDashboardData();
    setShowPropertyForm(false);
    setEditingProperty(null);
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
        method: 'DELETE'
      });

      if (response.ok) {
        await loadDashboardData();
      } else {
        const error = await response.json();
        alert(`Erreur lors de la suppression: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Erreur lors de la suppression de la propriété');
    } finally {
      setDeletingProperty(null);
    }
  };

  const getMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth();
    return bookings
      .filter(booking => new Date(booking.created_at).getMonth() === currentMonth)
      .reduce((sum, booking) => sum + booking.total_price, 0);
  };

  const getMonthlyBookings = () => {
    const currentMonth = new Date().getMonth();
    return bookings.filter(booking => new Date(booking.created_at).getMonth() === currentMonth).length;
  };

  const getActiveProperties = () => {
    return properties.filter(property => property.is_available).length;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'cabane_arbre': 'Cabanes dans les arbres',
      'yourte': 'Yourtes',
      'cabane_flottante': 'Cabanes flottantes',
      'autre': 'Autre hébergement'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C3E37] to-[#4A7C59] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Chargement de votre espace glamping...</p>
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
                Bienvenue, {userProfile?.full_name || 'Propriétaire'}
              </h1>
              <p className="text-gray-600">Gérez vos hébergements insolites comme un professionnel</p>
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

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'text-[#4A7C59] font-medium' 
                : 'text-gray-600 hover:text-[#4A7C59]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Tableau de bord</span>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'properties' 
                ? 'text-[#4A7C59] font-medium' 
                : 'text-gray-600 hover:text-[#4A7C59]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Mes propriétés</span>
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
            <span>Réservations</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'settings' 
                ? 'text-[#4A7C59] font-medium' 
                : 'text-gray-600 hover:text-[#4A7C59]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#4A7C59]" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Propriétés Actives</p>
                  <p className="text-3xl font-bold text-[#2C3E37]">{getActiveProperties()}</p>
                  <p className="text-sm text-green-600 mt-1">+2 ce mois</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations du Mois</p>
                  <p className="text-3xl font-bold text-[#2C3E37]">{getMonthlyBookings()}</p>
                  <p className="text-sm text-green-600 mt-1">+15% vs mois dernier</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Euro className="w-6 h-6 text-purple-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus Générés</p>
                  <p className="text-3xl font-bold text-[#2C3E37]">€{getMonthlyRevenue().toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+8% vs mois dernier</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-[#2C3E37] mb-4">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowPropertyForm(true)}
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#4A7C59] hover:bg-green-50 transition-all"
                >
                  <Plus className="w-6 h-6 text-[#4A7C59]" />
                  <span className="font-medium text-[#2C3E37]">Ajouter une propriété</span>
                </button>
                <button className="flex items-center space-x-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#4A7C59] hover:bg-green-50 transition-all">
                  <Calendar className="w-6 h-6 text-[#4A7C59]" />
                  <span className="font-medium text-[#2C3E37]">Gérer les réservations</span>
                </button>
                <button className="flex items-center space-x-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#4A7C59] hover:bg-green-50 transition-all">
                  <Settings className="w-6 h-6 text-[#4A7C59]" />
                  <span className="font-medium text-[#2C3E37]">Paramètres</span>
                </button>
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#2C3E37]">Propriétés Récentes</h2>
                <button 
                  onClick={() => setActiveTab('properties')}
                  className="text-[#4A7C59] hover:text-[#2C3E37] transition-colors"
                >
                  Voir tout
                </button>
              </div>
              
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété</h3>
                  <p className="text-gray-600 mb-6">
                    Votre première aventure glamping commence ici
                  </p>
                  <button 
                    onClick={() => setShowPropertyForm(true)}
                    className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
                  >
                    Ajouter ma première propriété
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.slice(0, 3).map((property) => (
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
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.max_guests} voyageurs</span>
                          </div>
                          <div className="text-lg font-bold text-[#2C3E37]">€{property.price_per_night}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditProperty(property)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Modifier</span>
                          </button>
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>Voir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2C3E37]">Mes Propriétés</h2>
              <button 
                onClick={() => setShowPropertyForm(true)}
                className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter une propriété</span>
              </button>
            </div>

            {/* Filter Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-[#2C3E37] mb-4">Filtrer par Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété</h3>
                  <p className="text-gray-600 mb-6">
                    Commencez par ajouter votre premier hébergement glamping
                  </p>
                  <button 
                    onClick={() => setShowPropertyForm(true)}
                    className="bg-gradient-to-r from-[#4A7C59] to-[#2C3E37] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
                  >
                    Ajouter ma première propriété
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
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
                            <Camera className="w-12 h-12 text-gray-400" />
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
                            <span className="text-sm">{property.max_guests} lits</span>
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
                            <span className="text-sm text-gray-600">{property.rating || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditProperty(property)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Modifier</span>
                          </button>
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>Voir</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletingProperty === property.id}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E37] mb-4">Réservations</h2>
            <p className="text-gray-600">Gestion des réservations à venir...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E37] mb-4">Paramètres</h2>
            <p className="text-gray-600">Paramètres à venir...</p>
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      <PropertyForm
        isOpen={showPropertyForm}
        onClose={() => {
          setShowPropertyForm(false);
          setEditingProperty(null);
        }}
        property={editingProperty}
        onSuccess={handlePropertySuccess}
      />
    </div>
  );
} 