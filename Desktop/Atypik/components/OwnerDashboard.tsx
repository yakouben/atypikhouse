"use client";

import { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Euro, 
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Mail,
  MapPin as LocationIcon
} from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import OwnerBookingsDashboard from './OwnerBookingsDashboard';

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
        console.log('Sign out successful, redirecting to landing page...');
        // The signOut function will handle the redirect automatically
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Tableau de bord propriétaire</h1>
          </div>
          <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bonjour, {userProfile?.full_name || 'Propriétaire'}
              </span>
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-[#2d5016] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Tableau de bord</span>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'properties' 
                ? 'bg-[#2d5016] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Propriétés</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'bookings' 
                ? 'bg-[#2d5016] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Réservations</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-[#2d5016] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </div>

        {/* Content */}
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ajouter une nouvelle propriété
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez à louer votre propriété en l'ajoutant à notre plateforme
                  </p>
                  <button className="inline-flex items-center space-x-2 bg-[#2d5016] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a3a0f] transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Ajouter une propriété</span>
                  </button>
                </div>
              </div>

              {/* Recent Bookings */}
              {bookings.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Réservations récentes</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{booking.properties.name}</h4>
                            <p className="text-sm text-gray-600">{booking.properties.location}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">€{booking.total_price}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmée' :
                               booking.status === 'pending' ? 'En attente' : booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                </div>
              )}
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
              <OwnerBookingsDashboard />
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
    </div>
  );
} 