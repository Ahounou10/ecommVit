export const metadata = {
  title: 'Panier - Boutique',
  description: 'Votre panier',
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Votre panier</h1>
      <p className="text-gray-600 text-sm sm:text-base">Votre panier est vide pour le moment.</p>
    </div>
  );
}
