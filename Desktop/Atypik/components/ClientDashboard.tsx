"use client";

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  User, 
  TreePine,
  LogOut,
  Search,
  MapPin,
  Users,
  Euro,
  Star,
  Eye,
  Mail,
  Phone,
  MapPin as LocationIcon
} from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { useRouter } from 'next/navigation';

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
    images: string[];
  };
}

export default function ClientDashboard() {
  const { userProfile, signOut } = useAuthContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    if (userProfile?.id) {
      loadClientData();
    }
  }, [userProfile]);

  const loadClientData = async () => {
    setLoading(true);
    try {
      // Use the new API route instead of direct Supabase query
      const response = await fetch(`/api/bookings/client?clientId=${userProfile!.id}`);
      const result = await response.json();
      
      if (response.ok && result.data) {
        setBookings(result.data);
        console.log('Bookings loaded successfully:', result.data);
      } else {
        console.error('Error loading bookings:', result.error);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      setBookings([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      case 'completed':
        return 'Terminé';
      default:
        return status;
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
                Bonjour, {userProfile?.full_name || 'Utilisateur'}
              </h1>
              <p className="text-sm text-gray-600">Découvrez des hébergements uniques</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher des propriétés..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5" />
              <span>Profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
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
              <span>Parcourir</span>
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
              <span>Mes réservations</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'text-green-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profil</span>
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

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bienvenue sur AtypikHouse
              </h2>
              <p className="text-gray-600 mb-4">
                Découvrez des hébergements insolites et éco-responsables en France et en Europe.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Commencer à explorer
              </button>
            </div>

            {/* My Bookings Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes réservations</h2>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de réservations. Commencez à explorer nos hébergements !
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Parcourir les propriétés
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.properties.name}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{booking.properties.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">€{booking.total_price}</div>
                            <div className="text-sm text-gray-600">total</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Arrivée</p>
                            <p className="text-sm text-gray-900">
                              {new Date(booking.check_in_date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Départ</p>
                            <p className="text-sm text-gray-900">
                              {new Date(booking.check_out_date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">{booking.guest_count} adultes</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Parcourir les propriétés</h2>
            {/* Properties browsing content */}
            <p className="text-gray-600">Exploration des propriétés à venir...</p>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes réservations</h2>
            {/* Detailed bookings management */}
            <p className="text-gray-600">Gestion détaillée des réservations à venir...</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mon profil</h2>
            
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {userProfile?.full_name || 'Utilisateur'}
                  </h3>
                  <p className="text-gray-600">Client</p>
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

                  {userProfile?.reservation_type && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Type de réservation préféré</p>
                        <p className="text-gray-900">{userProfile.reservation_type}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{bookings.length}</p>
                        <p className="text-sm text-gray-600">Réservations</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          €{bookings.reduce((sum, booking) => sum + booking.total_price, 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total dépensé</p>
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