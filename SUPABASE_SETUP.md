# Configuration Supabase - Formulaire de Contact

## 1. Créer la table dans Supabase

1. Va sur ton projet Supabase : https://supabase.com/dashboard
2. Clique sur **SQL Editor** dans la barre latérale
3. Clique sur **New Query**
4. Copie-colle le contenu du fichier `supabase-schema.sql`
5. Clique sur **Run** pour exécuter le script

Cela va créer :
- ✅ La table `contact_messages` avec toutes les colonnes
- ✅ Les index pour optimiser les performances
- ✅ Les policies RLS pour la sécurité (insertions publiques, lecture réservée aux admins)
- ✅ Les contraintes de validation (email valide, message minimum 10 caractères)

## 2. Récupérer tes credentials Supabase

1. Va dans **Settings** > **API** dans ton projet Supabase
2. Copie les valeurs suivantes :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (commence par `eyJ...`)

## 3. Configurer les variables d'environnement

1. Crée un fichier `.env.local` à la racine du projet portfolio :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...ta-clé-anon...
```

2. **IMPORTANT** : Ne commit jamais ce fichier ! Il est déjà dans `.gitignore`

## 4. Redémarrer le serveur de développement

```bash
npm run dev
```

## 5. Tester le formulaire

1. Va sur http://localhost:3000/contact
2. Remplis le formulaire et envoie-le
3. Va dans Supabase > **Table Editor** > `contact_messages`
4. Tu devrais voir ton message enregistré ! ✅

## Structure de la table

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (auto-généré) |
| `name` | TEXT | Nom complet (obligatoire) |
| `email` | TEXT | Email (obligatoire, validé) |
| `company` | TEXT | Entreprise (optionnel) |
| `phone` | TEXT | Téléphone (optionnel) |
| `project_type` | TEXT | Type de projet |
| `budget` | TEXT | Budget estimé |
| `message` | TEXT | Message (obligatoire, min 10 caractères) |
| `created_at` | TIMESTAMP | Date de création (auto) |
| `read` | BOOLEAN | Lu ou non (défaut: false) |

## Sécurité (RLS - Row Level Security)

- ✅ **Insertions publiques** : N'importe qui peut envoyer un message via le formulaire
- ✅ **Lecture protégée** : Seuls les utilisateurs authentifiés (admins) peuvent lire les messages
- ✅ **Validation** : Email et message validés au niveau de la base de données

## Consulter les messages

### Option 1 : Via Supabase Dashboard
1. Va sur Supabase > **Table Editor**
2. Sélectionne la table `contact_messages`
3. Tu peux voir, filtrer et marquer les messages comme lus

### Option 2 : Créer un dashboard admin (à venir)
Tu pourras créer une page `/admin` protégée par mot de passe pour consulter les messages directement depuis ton site.

## Notifications (optionnel)

Pour recevoir un email à chaque nouveau message, tu peux :
1. Utiliser **Supabase Edge Functions** avec Resend/SendGrid
2. Configurer un **Webhook** vers un service externe
3. Utiliser **Supabase Realtime** pour des notifications en temps réel

## Troubleshooting

### Erreur "Missing Supabase environment variables"
→ Vérifie que `.env.local` existe et contient les bonnes valeurs

### Erreur "new row violates row-level security policy"
→ Vérifie que la policy "Allow public insert" est bien créée

### Les messages ne s'affichent pas
→ Va dans Supabase > **Authentication** et connecte-toi pour voir les messages (RLS)

## Support

Si tu as des questions, consulte la [documentation Supabase](https://supabase.com/docs) ou contacte-moi !
