#!/usr/bin/env node

/**
 * Quick Start Script
 * Lance les étapes essentielles pour démarrer votre boutique
 */

const steps = [
  {
    title: "✅ Copier le fichier d'environnement",
    command: "cp .env.local.example .env.local",
    description: "Créer le fichier de configuration"
  },
  {
    title: "🔑 Remplir les variables d'environnement",
    description: "Ouvrir .env.local et ajouter:\n" +
                 "- NEXT_PUBLIC_SUPABASE_URL\n" +
                 "- NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
                 "- NEXT_PUBLIC_WHATSAPP\n" +
                 "- etc..."
  },
  {
    title: "🗄️ Créer les tables Supabase",
    description: "Exécuter le SQL de README_SETUP.md dans Supabase SQL Editor"
  },
  {
    title: "👤 Créer un compte admin",
    description: "Supabase > Authentication > Add user"
  },
  {
    title: "🚀 Lancer le serveur",
    command: "npm run dev",
    description: "Démarrer le développement"
  },
  {
    title: "🌐 Ouvrir le site",
    url: "http://localhost:3000",
    description: "Votre boutique en ligne!"
  }
];

console.log("\n🎉 BIENVENUE DANS VOTRE BOUTIQUE E-COMMERCE!\n");
console.log("=" .repeat(50));

steps.forEach((step, index) => {
  console.log(`\n${index + 1}. ${step.title}`);
  if (step.command) {
    console.log(`   $ ${step.command}`);
  }
  if (step.url) {
    console.log(`   🔗 ${step.url}`);
  }
  console.log(`   ${step.description}`);
});

console.log("\n" + "=".repeat(50));
console.log("\n📚 Documentation complète:");
console.log("   - GETTING_STARTED.md");
console.log("   - README_SETUP.md");
console.log("   - ADMIN_GUIDE.md");
console.log("\n💪 Vous êtes prêt! Commencez maintenant!\n");
