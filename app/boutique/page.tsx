import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BoutiqueClient from './BoutiqueClient';

function BoutiqueWrapper() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  return <BoutiqueClient category={category} />;
}

export default function BoutiquePage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <BoutiqueWrapper />
    </Suspense>
  );
}