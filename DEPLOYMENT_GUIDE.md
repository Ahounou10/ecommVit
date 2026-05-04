# 🚀 Guide de Déploiement

## Déploiement sur Vercel (Recommandé)

### Étape 1 : Préparer GitHub

```bash
git add .
git commit -m "Initial commit: Boutique e-commerce"
git push origin main
```

### Étape 2 : Connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Importez le projet `site_ecomvit`
4. Cliquez "Deploy"

### Étape 3 : Variables d'environnement

Dans Vercel :
1. Allez dans "Settings" > "Environment Variables"
2. Ajoutez :
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_PHONE=...
   NEXT_PUBLIC_WHATSAPP=...
   NEXT_PUBLIC_INSTAGRAM=...
   NEXT_PUBLIC_FACEBOOK=...
   NEXT_PUBLIC_ADDRESS=...
   NEXT_PUBLIC_CITY=...
   ```
3. Redéployez

### Étape 4 : Domaine personnalisé

1. Achetez un domaine (.ci, .com, etc.)
2. Dans Vercel, allez dans "Settings" > "Domains"
3. Connectez votre domaine

## Configuration Supabase

### Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Attendez que le projet soit prêt
4. Copiez l'URL et la clé

### Sécurité

1. **Row Level Security (RLS)** - Activez RLS sur les tables
2. **Authentification** - Configurez les providers OAuth
3. **Storage** - Limitez l'accès aux buckets

## DNS et Email

### Configuration DNS

Pointez votre domaine vers Vercel :
- Chez OVH, GoDaddy, etc.
- Mettez à jour les enregistrements NS

### Email transactionnel

Pour les confirmations de commande :
1. Utilisez SendGrid ou Mailgun
2. Intégrez via une API
3. Envoyez les emails après une commande WhatsApp

## Monitoring

### Logs

- Vercel : Onglet "Functions" pour voir les erreurs
- Supabase : Onglet "Logs" pour les requêtes BD

### Analytics

Pour tracker les visiteurs :
1. Installez Google Analytics
2. Ajoutez le script dans `app/layout.tsx`

## Sauvegardes

- **Base de données** : Supabase sauvegarde automatiquement
- **Images** : Stockées chez Supabase (sécurisé)
- **Code** : Sauvegardez sur GitHub

## Performance

- Images optimisées par Next.js
- Cache côté client automatique
- CDN Vercel global pour la vitesse

---

**Votre site est maintenant en ligne ! 🎉**
