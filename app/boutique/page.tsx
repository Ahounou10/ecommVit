import BoutiqueClient from './BoutiqueClient';

type BoutiquePageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

const VALID_CATEGORIES = ['homme', 'femme', 'mixte'];

export default async function BoutiquePage({
  searchParams,
}: BoutiquePageProps) {
  const params = await searchParams;
  const requestedCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const category = VALID_CATEGORIES.includes(requestedCategory ?? '')
    ? requestedCategory ?? null
    : null;

  return <BoutiqueClient category={category} />;
}
