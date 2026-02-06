# Guide de Déploiement - Le Trio des Petits Pas

Votre site est prêt à être mis en ligne ! Voici comment procéder simplement avec **Vercel** (recommandé pour Next.js).

## 1. Prérequis
- Un compte [GitHub](https://github.com/) (pour héberger votre code).
- Un compte [Vercel](https://vercel.com/) (pour mettre le site en ligne).
- Vos identifiants Supabase (URL et Clé publique).

## 2. Héberger le code (GitHub)
Si ce n'est pas déjà fait, envoyez votre code sur GitHub :
1. Créez un nouveau "Repository" sur GitHub (ex: `le-trio-site`).
2. Dans votre terminal (VS Code), exécutez :
   ```bash
   git init
   git add .
   git commit -m "Version finale pour lancement"
   git branch -M main
   git remote add origin https://github.com/VOTRE_PSEUDO/le-trio-site.git
   git push -u origin main
   ```

## 3. Déployer sur Vercel
1. Allez sur votre tableau de bord [Vercel](https://vercel.com/dashboard).
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Sélectionnez votre repository GitHub (`le-trio-site`) et cliquez sur **"Import"**.
4. Dans la section **"Environment Variables"**, ajoutez les variables suivantes (les mêmes que dans votre fichier `.env.local`) :
   - `NEXT_PUBLIC_SUPABASE_URL`: `votre_url_supabase`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `votre_clé_publique_supabase`
5. Cliquez sur **"Deploy"**.

## 4. Finalisation
Vercel va construire votre site. Une fois terminé (environ 1-2 minutes), vous obtiendrez une URL (ex: `le-trio-site.vercel.app`).
Vous pourrez ensuite connecter votre propre nom de domaine (`letriodespetitspas.fr`) dans les paramètres Vercel ("Settings" > "Domains").

🚀 **Félicitations, votre site est en ligne !**
