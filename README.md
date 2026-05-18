# MonGaragiste 🔧

> Votre garagiste, à portée de clic.

Plateforme de mise en relation entre garagistes et clients. Les garagistes s'inscrivent, définissent leurs horaires et services. Les clients recherchent un garage et réservent un créneau en ligne.

---

## Stack technique

- **Framework** : Next.js 14 (App Router) + TypeScript
- **Style** : Tailwind CSS — couleur principale `#1D9E75`
- **Base de données** : PostgreSQL + Prisma ORM
- **Auth** : NextAuth.js (credentials + Google OAuth)
- **Emails** : Nodemailer
- **SMS** : Twilio
- **Upload fichiers** : Uploadthing

---

## Installation

### 1. Cloner le repo

\`\`\`bash
git clone https://github.com/webcodejulien/mongaragiste.git
cd mongaragiste
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configurer les variables d'environnement

\`\`\`bash
cp .env.example .env
\`\`\`

Remplis les valeurs dans `.env` (DATABASE_URL, NEXTAUTH_SECRET, etc.)

### 4. Initialiser la base de données

\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 5. Lancer en développement

\`\`\`bash
npm run dev
\`\`\`

Ouvre [http://localhost:3000](http://localhost:3000)

---

## Fonctionnalités

### Côté garagiste
- Inscription multi-étapes (infos, horaires, services, documents, abonnement)
- Dashboard avec agenda semaine/jour
- Gestion des rendez-vous (confirmer, annuler, terminer)
- Notifications en temps réel
- Statistiques et avis clients

### Côté client
- Recherche par ville, service, disponibilité
- Page profil du garage avec avis et créneaux
- Réservation en ligne avec confirmation SMS + email
- Historique des rendez-vous

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL PostgreSQL |
| `NEXTAUTH_SECRET` | Clé secrète NextAuth |
| `NEXTAUTH_URL` | URL de l'app |
| `GOOGLE_CLIENT_ID` | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `SMTP_HOST` | Serveur email |
| `TWILIO_SID` | Twilio SMS |
| `UPLOADTHING_SECRET` | Upload fichiers |

---

## Licence

MIT — mongaragiste.app
