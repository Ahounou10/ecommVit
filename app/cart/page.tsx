export const metadata = {
  title: 'Panier - Boutique',
  description: 'Votre panier',
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
      <p className="text-gray-600">Votre panier est vide pour le moment.</p>
    </div>
  );
}
