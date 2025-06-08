# 🎭 Ft_transcendence - Version Démo

Cette version démo de Ft_transcendence fonctionne **sans backend** et utilise des données fictives pour permettre une démonstration complète de l'interface utilisateur et des fonctionnalités.

## ✨ Fonctionnalités de la Démo

### 🔐 Authentification Simulée
- **Connexion automatique** : Pas besoin de saisir d'identifiants
- **Utilisateur démo** : DemoPlayer avec un profil complet
- **Gestion de session** : Simulation des tokens JWT

### 👥 Système d'Amis Complet
- **3 amis préchargés** : PlayerOne, GameMaster, PongChamp
- **Demandes d'ami** : Simulation d'envoi, acceptation et refus
- **Profils détaillés** : Statistiques, réalisations, historique
- **Statuts en ligne** : Simulation des statuts de connexion

### 🎮 Historique de Jeux
- **25 matchs simulés** avec scores et timestamps réalistes
- **5 tournois** avec brackets et résultats
- **Statistiques détaillées** : Taux de victoire, séries, temps de jeu
- **Graphiques interactifs** : Évolution des performances

### 📊 Dashboard & Analytics
- **Statistiques globales** : 72% de taux de victoire, 15h32m de jeu
- **Graphiques de progression** : Victoires/défaites sur 7 jours
- **Classement** : Position #42 avec 1847 points
- **Réalisations** : Système de badges et accomplissements

### 🏆 Classement & Actualités
- **Top 50 joueurs** avec statistiques complètes
- **Actualités du jeu** : Tournois, mises à jour, nouveautés
- **Matchs récents** : Flux temps réel des parties

### 💬 Chat & Notifications
- **Messages d'amis** simulés avec timestamps
- **Notifications** : Demandes d'ami, invitations, tournois
- **Système de paramètres** : Notifications, confidentialité, jeu

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd 42_Ft_transcendence

# Installer les dépendances
npm install
```

### Lancement de la Démo

#### Mode Développement
```bash
# Démarrer en mode démo avec rechargement à chaud
npm run dev:demo

# L'application sera disponible sur http://localhost:5173
# Le mode démo sera automatiquement activé
```

#### Mode Production
```bash
# Construire pour la démo
npm run build:demo

# Prévisualiser la version construite
npm run preview:demo

# L'application sera disponible sur http://localhost:4173
```

## 🎯 Utilisation de la Démo

### Navigation
1. **Page d'accueil** : Connexion automatique en 2 secondes
2. **Dashboard** : Vue d'ensemble des statistiques et activités
3. **Profil** : Modification du profil utilisateur (simulée)
4. **Amis** : Gestion des relations sociales
5. **Historique** : Consultation des matchs et tournois
6. **Paramètres** : Configuration de l'interface

### Interactions Simulées
- ✅ **Modifier le profil** : Nom d'utilisateur, email, avatar
- ✅ **Gérer les amis** : Ajouter, accepter, refuser, supprimer
- ✅ **Naviguer l'historique** : Filtrer par date, type de match
- ✅ **Consulter les statistiques** : Graphiques interactifs
- ✅ **Paramétrer l'application** : Thème, notifications, jeu

## 🛠️ Configuration Technique

### Variables d'Environnement
Le fichier `.env.demo` active automatiquement le mode démo :
```env
VITE_DEMO_MODE=true
VITE_DEMO_AUTO_LOGIN=true
VITE_DEMO_API_DELAY_MIN=200
VITE_DEMO_API_DELAY_MAX=800
```

### Architecture de la Démo
```
src/
├── config/demo.ts              # Configuration du mode démo
├── utils/
│   ├── demoData.ts            # Données fictives complètes
│   └── customFetch.ts         # Intercepteur d'API pour la démo
├── components/
│   └── DemoBanner/           # Bannière d'indication du mode démo
└── context/                  # Contextes mis à jour pour la démo
```

### Données Simulées
- **👤 Utilisateur** : DemoPlayer avec profil complet
- **👥 Amis** : 3 amis + 1 demande en attente
- **🎮 Matchs** : 25 parties avec scores réalistes
- **🏆 Tournois** : 5 tournois avec brackets
- **📊 Stats** : Graphiques sur 7 jours
- **🏅 Classement** : Top 50 avec position utilisateur
- **📰 News** : 3 actualités récentes
- **💬 Chat** : Messages avec timestamps
- **🔔 Notifications** : Système complet

## 🎨 Indicateurs Visuels

### Bannière de Démo
Une bannière bleue en haut de l'écran indique clairement le mode démo :
```
🎭 MODE DÉMO - Interface sans backend
```

### Console de Développement
Les appels API interceptés sont loggés avec le préfixe `[DEMO]` pour le débogage.

## 📦 Déploiement

### Hébergement Statique
Cette version démo peut être hébergée sur n'importe quel service de fichiers statiques :

- **Netlify** : `npm run build:demo` puis drag & drop du dossier `dist/`
- **Vercel** : Push sur GitHub avec `build:demo` en commande de build
- **GitHub Pages** : Action automatique avec workflow personnalisé
- **Firebase Hosting** : `firebase deploy` après build

### URL de Démo Suggérée
- `demo.ft-transcendence.com`
- `ft-transcendence-demo.netlify.app`
- `[username].github.io/ft-transcendence-demo`

## 🔧 Personnalisation

### Ajouter des Données
Modifiez `/src/utils/demoData.ts` pour :
- Ajouter des amis
- Créer de nouveaux matchs
- Personnaliser les statistiques
- Modifier les actualités

### Désactiver le Mode Démo
Changez `VITE_DEMO_MODE=false` dans `.env.demo` ou supprimez la variable.

## 🎯 Cas d'Usage

### 🎤 Présentations
- Démonstration en direct sans dépendances
- Portfolio professionnel
- Présentation client/jury

### 👨‍💻 Développement
- Test d'interface sans backend
- Développement frontend isolé
- Tests d'intégration des composants

### 🚀 Marketing
- Page de démonstration publique
- Aperçu avant inscription
- Showcase des fonctionnalités

---

## 🔗 Liens Utiles

- **Code Source** : [GitHub Repository]
- **Documentation Technique** : `README.md`
- **Version Production** : Nécessite le backend complet

---

> 💡 **Note** : Cette démo simule toutes les interactions avec des données locales. Aucune donnée n'est sauvegardée et tout est remis à zéro à chaque rechargement de page.
