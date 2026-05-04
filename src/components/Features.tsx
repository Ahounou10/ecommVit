'use client';

import { Zap, Truck, Shield, Clock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Ultra rapide',
      description: 'Navigation fluide et instantanée sur tous vos appareils',
    },
    {
      icon: Truck,
      title: 'Commande facile',
      description: 'Commandez via WhatsApp en quelques clics',
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Paiement sûr et confidentiel de vos données',
    },
    {
      icon: Clock,
      title: 'Service 24/7',
      description: 'Nous sommes toujours là pour vous répondre',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-lg text-gray-600">
            Une boutique pensée pour votre confort
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
