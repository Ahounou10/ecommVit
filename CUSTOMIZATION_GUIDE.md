# 🎨 Guide de Customisation

## 🎯 Changer les couleurs

Dans `tailwind.config.ts`, modifiez la palette `emerald` pour utiliser vos couleurs préférées.

### Palettes suggérées :

**Élégant noir/beige** :
```ts
colors: {
  primary: '#000000',
  secondary: '#F5F5DC',
  accent: '#1B4D3E'
}
```

**Premium doré** :
```ts
colors: {
  primary: '#D4AF37',
  secondary: '#FFFFFF',
  accent: '#2D2D2D'
}
```

## 🏢 Changer le nom de la marque

1. Dans les fichiers de composants : `BRAND_NAME = 'Boutique Vêtements'`
2. Dans `src/lib/constants.ts` : `export const BRAND_NAME = 'Votre Nom'`
3. Dans `app/layout.tsx` : Modifiez la balise titre

## 📞 Ajouter vos coordonnées

Dans `.env.local` :
```env
NEXT_PUBLIC_PHONE=+225XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP=+225XXXXXXXXXX
NEXT_PUBLIC_INSTAGRAM=@yourinstagram
NEXT_PUBLIC_FACEBOOK=yourfacebook
NEXT_PUBLIC_ADDRESS=Your Address
NEXT_PUBLIC_CITY=City
```

## 🎨 Logo

Le logo est dans `Header.tsx` avec un "B". Remplacez-le par :
- Votre logo (image)
- Vos initiales
- Un emoji

## 📸 Images Hero

Modifiez `HeroBanner.tsx` pour ajouter une image de fond ou des couleurs différentes.

## 🔤 Typos et Textes

Tous les textes du site sont en français et peuvent être édités directement dans les fichiers `.tsx`.

## 🌙 Mode sombre

Pour ajouter un thème clair/sombre, installez `next-themes` :
```bash
npm install next-themes
```

Puis éditez `app/layout.tsx` pour ajouter le toggle.

## ✨ Animations

Toutes les animations sont en CSS/Tailwind. Modifiez les durées dans `tailwind.config.ts`.

Besoin d'aide ? Consultez la documentation Tailwind CSS !
