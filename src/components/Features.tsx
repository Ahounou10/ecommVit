import { Clock, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Commande simple',
      description: 'Choisissez vos articles et transmettez votre commande directement.',
    },
    {
      icon: Truck,
      title: 'Livraison organisée',
      description: 'Les modalités de livraison sont confirmées avec vous.',
    },
    {
      icon: ShieldCheck,
      title: 'Échanges transparents',
      description: 'Les informations utiles sont communiquées avant la validation.',
    },
    {
      icon: Clock,
      title: 'Un contact direct',
      description: 'Notre équipe reste disponible pour répondre à vos questions.',
    },
  ];

  return (
    <section className="bg-[#f5f5f3] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Nos engagements
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
            Une expérience sans complication
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="border-t border-gray-300 pt-5">
                <Icon className="h-5 w-5 text-[#34463d]" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-gray-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
