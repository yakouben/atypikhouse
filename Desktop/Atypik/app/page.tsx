"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mountain, 
  TreePine, 
  Castle, 
  Caravan, 
  Home as HomeIcon,
  MapPin,
  Users,
  Euro,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/AuthProvider';
import HeroSection from '@/components/HeroSection';
import ReservationModal from '@/components/ReservationModal';

// Only the 4 database categories
const accommodationCategories = [
  {
    id: 1,
    name: 'Cabanes dans les arbres',
    description: 'Vivez une expérience unique perchée dans les arbres. Nos cabanes offrent une vue imprenable sur la nature et un confort moderne en harmonie avec l\'environnement.',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: TreePine,
    slug: 'cabanes-arbres',
    seoTitle: 'Cabanes dans les arbres - Hébergements insolites AtypikHouse',
    seoDescription: 'Découvrez nos cabanes dans les arbres pour un séjour unique en pleine nature. Réservez votre cabane perchée avec AtypikHouse.',
    category: 'cabane_arbre'
  },
  {
    id: 2,
    name: 'Yourtes',
    description: 'Découvrez le confort traditionnel des yourtes. Ces hébergements circulaires offrent une expérience authentique et chaleureuse au cœur de la nature.',
    image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Castle,
    slug: 'yourtes',
    seoTitle: 'Yourtes traditionnelles - Hébergements insolites AtypikHouse',
    seoDescription: 'Séjournez dans nos yourtes traditionnelles pour une expérience authentique. Réservez votre yourte avec AtypikHouse.',
    category: 'yourte'
  },
  {
    id: 3,
    name: 'Cabanes flottantes',
    description: 'Sur l\'eau, en harmonie avec les éléments. Nos cabanes flottantes vous offrent une expérience unique entre ciel et eau.',
    image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Caravan,
    slug: 'cabanes-flottantes',
    seoTitle: 'Cabanes flottantes - Hébergements insolites AtypikHouse',
    seoDescription: 'Vivez une expérience unique dans nos cabanes flottantes. Réservez votre cabane sur l\'eau avec AtypikHouse.',
    category: 'cabane_flottante'
  },
  {
    id: 4,
    name: 'Autres hébergements',
    description: 'Explorez notre collection d\'hébergements insolites. Des cabanes A-frame aux tiny houses, chaque option est unique.',
    image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: HomeIcon,
    slug: 'autres-hebergements',
    seoTitle: 'Autres hébergements insolites - AtypikHouse',
    seoDescription: 'Découvrez notre collection d\'hébergements insolites : cabanes A-frame, tiny houses et plus encore avec AtypikHouse.',
    category: 'autre'
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedPropertyName, setSelectedPropertyName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    loadProperties();
  }, [selectedCategory]);

  const loadProperties = async () => {
    try {
    setPropertiesLoading(true);
      const url = selectedCategory === 'all' 
        ? '/api/properties?published=true&available=true' 
        : `/api/properties?category=${selectedCategory}&published=true&available=true`;
      
      const response = await fetch(url);
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
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleReservationClick = (e: React.MouseEvent, propertyId: string, propertyName: string) => {
    e.stopPropagation();
    console.log('🔍 Reservation button clicked:', { propertyId, propertyName });
    setSelectedPropertyId(propertyId);
    setSelectedPropertyName(propertyName);
    setShowReservationModal(true);
    console.log('🔍 Modal state updated:', { showReservationModal: true, selectedPropertyId: propertyId });
  };

  const handleCloseReservationModal = () => {
    console.log('🔍 Closing reservation modal');
    setShowReservationModal(false);
    setSelectedPropertyId('');
    setSelectedPropertyName('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cabane_arbre':
        return TreePine;
      case 'yourte':
        return Castle;
      case 'cabane_flottante':
        return Caravan;
      case 'autre':
        return HomeIcon;
      default:
        return Mountain;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cabane_arbre':
        return 'Cabanes dans les arbres';
      case 'yourte':
        return 'Yourtes';
      case 'cabane_flottante':
        return 'Cabanes flottantes';
      case 'autre':
        return 'Autres hébergements';
      default:
        return category;
  }
  };

  const handleReserverClick = () => {
    router.push('/search');
  };

  const handleAddPropertyClick = () => {
    router.push('/host');
  };

  const handleConnexionClick = () => {
    router.push('/auth/login');
  };

  const handleInscriptionClick = () => {
    router.push('/auth/register');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Old Hero Section */}
        <HeroSection 
        onReserverClick={handleReserverClick}
        onAddPropertyClick={handleAddPropertyClick}
          onConnexionClick={handleConnexionClick}
          onInscriptionClick={handleInscriptionClick}
        />

      {/* Category Filter Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-4">
              Filtrez par catégorie
              </h2>
            <p className="text-[#696969] text-lg">
              Choisissez le type d'hébergement qui vous convient
              </p>
            </div>
            
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                selectedCategory === 'all'
                  ? 'bg-[#2d5016] text-white shadow-xl'
                  : 'bg-white text-[#333333] hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Mountain className="w-5 h-5" />
              <span>Tous</span>
            </button>
            
            {/* Category Buttons - Only the 4 database categories */}
            {accommodationCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.category)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                    selectedCategory === category.category
                      ? 'bg-[#2d5016] text-white shadow-xl'
                      : 'bg-white text-[#333333] hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <span className="text-gray-700 font-medium">
              {properties.length} {selectedCategory === 'all' ? 'hébergements' : getCategoryLabel(selectedCategory).toLowerCase()}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewType === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('grid')}
                className="w-10 h-10 p-0"
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="w-full h-full bg-current rounded-sm"></div>
                  <div className="w-full h-full bg-current rounded-sm"></div>
                  <div className="w-full h-full bg-current rounded-sm"></div>
                  <div className="w-full h-full bg-current rounded-sm"></div>
                </div>
              </Button>
              <Button
                variant={viewType === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('list')}
                className="w-10 h-10 p-0"
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                </div>
                </Button>
              </div>
            </div>

            {/* Property Grid */}
            {propertiesLoading ? (
              <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2d5016]"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun hébergement trouvé
              </h3>
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? 'Aucune propriété disponible pour le moment' 
                  : `Aucune propriété trouvée dans la catégorie "${getCategoryLabel(selectedCategory)}"`
                }
              </p>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewType === 'list' 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
              {properties.map((property) => {
                const CategoryIcon = getCategoryIcon(property.category);
                return (
                  <div 
                    key={property.id} 
                    className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100 hover:border-green-200"
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
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#333333] shadow-lg">
                          <CategoryIcon className="w-3 h-3 text-[#2d5016]" />
                          <span>{getCategoryLabel(property.category)}</span>
                        </div>
                      </div>
                      
                      {/* Price Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-[#2d5016]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          €{property.price_per_night}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 lg:p-4 xl:p-5">
                      <h3 className="text-lg sm:text-xl font-bold text-[#333333] mb-2 group-hover:text-[#2d5016] transition-colors">
                        {property.name}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-[#696969] text-sm mb-3">
                        <MapPin className="w-4 h-4 text-[#2d5016]" />
                        <span>{property.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-[#696969]">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-[#2d5016]" />
                            <span>{property.max_guests} guests</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-[#2d5016] font-semibold">
                            <Euro className="w-4 h-4" />
                            <span>{property.price_per_night}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🔍 Button clicked directly:', property.id, property.name);
                              handleReservationClick(e, property.id, property.name);
                            }}
                            className="flex items-center space-x-1 bg-[#2d5016] text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-[#1a3a0f] transition-colors"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Réservations</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showReservationModal}
        onClose={handleCloseReservationModal}
        propertyId={selectedPropertyId}
        propertyName={selectedPropertyName}
      />
    </div>
  );
}