# 🛍️ Boutique Vêtements - E-Commerce Premium

Une boutique e-commerce moderne et responsive pour vêtements, avec tableau de bord admin ultra-simple.

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration Supabase

#### Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez votre `URL` et `Clé Anon`

#### Variables d'environnement

Renommez `.env.local.example` en `.env.local` et remplissez-le :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PHONE=+225XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP=+225XXXXXXXXXX
NEXT_PUBLIC_INSTAGRAM=@your_instagram
NEXT_PUBLIC_FACEBOOK=your_facebook
NEXT_PUBLIC_ADDRESS=Your Address
NEXT_PUBLIC_CITY=City
```

### 3. Créer les tables Supabase

Connectez-vous à Supabase et exécutez ce SQL :

```sql
-- Table des produits
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(50),
  subcategory VARCHAR(50),
  sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock INTEGER DEFAULT 0,
  promo_percent INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table d'authentification admin
CREATE TABLE auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Bucket pour les images
-- Allez dans Storage et créez un bucket nommé "product-images"
```

### 4. Lancer le serveur

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 📱 Pages Client

- **/** - Accueil avec hero, catégories et promo
- **/boutique** - Catalogue avec filtres
- **/product/[id]** - Détail du produit avec option WhatsApp
- **/about** - À propos
- **/contact** - Contact

## 🎯 Tableau de Bord Admin

- **/admin/login** - Connexion
- **/admin/dashboard** - Vue d'ensemble
- **/admin/products/new** - Ajouter un produit
- **/admin/products/[id]** - Modifier un produit

### Créer un compte admin

Dans Supabase, allez à "Authentication" et créez un nouvel utilisateur avec vos identifiants.

---

## 🎨 Personnalisation

### Couleurs de la marque

Modifiez le vert émeraude dans `tailwind.config.ts` :

```js
theme: {
  colors: {
    emerald: {
      600: '#10b981', // Changez cette valeur
      700: '#059669',
    }
  }
}
```

### Informations de contact

Éditez les variables dans `.env.local` :

```env
NEXT_PUBLIC_PHONE=+225XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP=+225XXXXXXXXXX
NEXT_PUBLIC_INSTAGRAM=@your_instagram
NEXT_PUBLIC_FACEBOOK=your_facebook
NEXT_PUBLIC_ADDRESS=Your Address
NEXT_PUBLIC_CITY=City
```

---

## 📦 Déploiement sur Vercel

1. Poussez votre code sur GitHub
2. Connectez votre repo à Vercel
3. Ajoutez les variables d'environnement
4. Déployez !

```bash
git push
```

---

## 🔐 Sécurité

- Les images sont uploadées sur Supabase Storage
- L'authentification admin via Supabase Auth
- Les données produit en base de données PostgreSQL

---

## 📝 Structure du Projet

```
site_ecomvit/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── products/
│   ├── boutique/
│   ├── product/[id]/
│   ├── about/
│   ├── contact/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── supabase/
│   └── types/
└── public/
```

---

## 🤝 Support

Pour toute question, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Bon business! 🚀**
