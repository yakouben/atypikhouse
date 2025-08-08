"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/AuthProvider';
import HeroSection from '@/components/HeroSection';
import { Mountain, TreePine, Castle, Caravan, Home as HomeIcon, Star, MapPin, Users, Euro, Shield, Heart, Zap, Globe } from 'lucide-react';

export default function Home() {
  const { user, userProfile, loading } = useAuthContext();
  const router = useRouter();

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

  const handleCategoryClick = (category: string) => {
    router.push(`/dashboard/client?category=${category}`);
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  // Featured properties data
  const featuredProperties = [
    {
      id: '1',
      name: 'Cabane A-Frame en pleine nature',
      location: 'Forêt de Tazekka, Maroc',
      price: 130,
      guests: 10,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Cabanes dans les arbres'
    },
    {
      id: '2',
      name: 'Yourte traditionnelle',
      location: 'Montagnes de l\'Atlas',
      price: 95,
      guests: 6,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Yourtes'
    },
    {
      id: '3',
      name: 'Cabane flottante sur le lac',
      location: 'Lac d\'Ifni, Maroc',
      price: 180,
      guests: 8,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Cabanes flottantes'
    }
  ];

  // Categories data
  const categories = [
    {
      id: 1,
      name: 'Cabanes dans les arbres',
      description: 'Vivez une expérience unique perchée dans les arbres',
      image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: TreePine,
      count: 12
    },
    {
      id: 2,
      name: 'Yourtes',
      description: 'Découvrez le confort traditionnel des yourtes',
      image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Castle,
      count: 8
    },
    {
      id: 3,
      name: 'Cabanes flottantes',
      description: 'Sur l\'eau, en harmonie avec les éléments',
      image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Caravan,
      count: 6
    },
    {
      id: 4,
      name: 'Autres hébergements',
      description: 'Explorez notre collection d\'hébergements insolites',
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: HomeIcon,
      count: 15
    }
  ];

  // Why choose us features
  const features = [
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Tous nos hébergements sont vérifiés et sécurisés pour votre tranquillité d\'esprit'
    },
    {
      icon: Heart,
      title: 'Expériences authentiques',
      description: 'Découvrez des lieux uniques et des expériences mémorables en pleine nature'
    },
    {
      icon: Zap,
      title: 'Réservation instantanée',
      description: 'Réservez en quelques clics et recevez une confirmation immédiate'
    },
    {
      icon: Globe,
      title: 'Destinations variées',
      description: 'Plus de 40 hébergements insolites au Maroc et en Europe'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection 
        onReserverClick={handleReserverClick}
        onAddPropertyClick={handleAddPropertyClick}
        onConnexionClick={handleConnexionClick}
        onInscriptionClick={handleInscriptionClick}
      />

      {/* Featured Properties Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hébergements en vedette
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos hébergements les plus populaires et réservez votre prochaine aventure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.map((property) => (
              <div 
                key={property.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-green-200"
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800 shadow-lg">
                      <Mountain className="w-3 h-3 text-green-600" />
                      <span>{property.category}</span>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{property.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {property.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>{property.guests} voyageurs</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-green-600 font-semibold">
                        <Euro className="w-4 h-4" />
                        <span className="text-lg">{property.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={handleReserverClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Voir tous les hébergements
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choisissez le type d'hébergement qui correspond à votre style de voyage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={category.id}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                  onClick={() => handleCategoryClick(category.id.toString())}
                >
                  <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {category.count} hébergements
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-green-300 transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-green-100 text-sm mb-4 opacity-90">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-green-200 group-hover:text-green-300 transition-colors">
                        <span className="font-medium">Découvrir</span>
                        <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir AtypikHouse ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous vous offrons une expérience unique et mémorable pour vos voyages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={handleInscriptionClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Commencer l'aventure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}