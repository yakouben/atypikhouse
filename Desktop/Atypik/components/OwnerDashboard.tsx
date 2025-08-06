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
  Phone,
  MapPin as LocationIcon
} from 'lucide-react';
import { useAuthContext } from './AuthProvider';

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

export default function OwnerDashboard() {
  const { userProfile, getOwnerProperties, getOwnerBookings, signOut } = useAuthContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Bienvenue, {userProfile?.full_name || 'Propriétaire'}
              </h1>
              <p className="text-sm text-gray-600">Gérez vos propriétés et réservations</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5" />
              <span>Profil</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'text-green-600 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Tableau de bord</span>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'properties' 
                ? 'text-green-600 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Mes propriétés</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'bookings' 
                ? 'text-green-600 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Réservations</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 transition-colors ${
              activeTab === 'settings' 
                ? 'text-green-600 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
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
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Propriétés</p>
                    <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                  </div>
                  <Home className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Réservations</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{bookings.reduce((sum, booking) => sum + booking.total_price, 0).toLocaleString()}
                    </p>
                  </div>
                  <Euro className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Add Property Button */}
            <div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span>Ajouter une propriété</span>
              </button>
            </div>

            {/* Properties Grid */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes propriétés</h2>
              {properties.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété</h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de propriétés. Commencez par en ajouter une !
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Ajouter ma première propriété
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="relative h-48 bg-gray-200">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Home className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.max_guests} adultes</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">€{property.price_per_night}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes propriétés</h2>
            {/* Properties management content */}
            <p className="text-gray-600">Gestion des propriétés à venir...</p>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Réservations</h2>
            {/* Bookings management content */}
            <p className="text-gray-600">Gestion des réservations à venir...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres</h2>
            
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {userProfile?.full_name || 'Propriétaire'}
                  </h3>
                  <p className="text-gray-600">Propriétaire</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{userProfile?.email || 'Non renseigné'}</p>
                    </div>
                  </div>
                  
                  {userProfile?.address && (
                    <div className="flex items-center space-x-3">
                      <LocationIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Adresse</p>
                        <p className="text-gray-900">{userProfile.address}</p>
                      </div>
                    </div>
                  )}

                  {userProfile?.what_you_own && (
                    <div className="flex items-center space-x-3">
                      <Home className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ce que vous possédez</p>
                        <p className="text-gray-900">{userProfile.what_you_own}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{properties.length}</p>
                        <p className="text-sm text-gray-600">Propriétés</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{bookings.length}</p>
                        <p className="text-sm text-gray-600">Réservations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Modifier mon profil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 