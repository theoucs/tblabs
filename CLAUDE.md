# CLAUDE.md — TBLabs Website

> Documentation pour Claude Code

---

## Overview

Site personnel de Theo Bodart hébergé sur **GitHub Pages** avec le domaine personnalisé **tblabs.dev**.

- **Repo GitHub** : https://github.com/theoucs/tblabs
- **URL live** : https://tblabs.dev
- **Stack** : HTML/CSS pur (pas de framework)
- **Hébergement** : GitHub Pages
- **Domaine** : Acheté chez OVH

---

## Structure du site

```
tblabs/
├── CNAME                          # Domaine personnalisé (tblabs.dev)
├── index.html                     # Page d'accueil
├── style.css                      # CSS global (design system dark mode)
├── cv/
│   └── index.html                 # tblabs.dev/cv - CV de Theo
└── apps/
    ├── index.html                 # tblabs.dev/apps - Liste des apps
    └── drip/
        ├── index.html             # tblabs.dev/apps/drip - Page de l'app
        ├── logo.png               # Logo de Drip (goutte irisée)
        ├── screenshot.png         # Screenshot de l'app (sans status bar)
        ├── privacy-policy.html    # Politique de confidentialité
        └── terms.html             # Conditions d'utilisation
```

---

## Design System

- **Theme** : Dark mode sobre, style "award winning"
- **Couleurs principales** :
  - Background : `#0a0a0a`
  - Accent : `#3b82f6` (bleu)
  - Accent secondaire : `#8b5cf6` (violet)
- **Animations** :
  - Glow pulsant autour du screenshot Drip
  - Hover effects sur les feature cards
  - Hover scale sur le screenshot du téléphone

---

## Pages

### Homepage (`/`)
Page d'accueil minimaliste avec liens vers Apps et CV.

### Apps (`/apps`)
Liste des applications iOS. Actuellement : Drip uniquement.

### Drip (`/apps/drip`)
Page de présentation de l'app Drip :
- Logo + screenshot dans un phone frame
- Description et features (Live Countdown, Widgets, Dynamic Island)
- Liens vers Privacy Policy et Terms
- Bouton "Coming Soon on App Store" (désactivé pour l'instant)

### Privacy Policy (`/apps/drip/privacy-policy`)
Politique de confidentialité pour Drip. Contenu :
- Location (GPS local uniquement, envoyé à WeatherKit)
- Push notifications (Firebase)
- In-App Purchases (géré par Apple)
- Pas de tracking, pas d'analytics, pas de comptes utilisateur
- Contact : contact@tblabs.dev

### Terms of Service (`/apps/drip/terms`)
Conditions d'utilisation pour Drip. Contenu :
- Description du service
- Abonnements Premium (trial 7 jours, mensuel, annuel)
- Données météo (WeatherKit, pas de garantie 100%)
- Propriété intellectuelle
- Loi française applicable

### CV (`/cv`)
CV de Theo Bodart orienté "iOS Developer & AI Enthusiast" :
- Skills : Product/Functional (User Research, Agile, User Stories) + Dev (Swift, SwiftUI, Claude, Make)
- Projects : Drip, TBLabs
- Experience : Banque de France (MOA actuel), BNP Paribas (automation), Tackops (relation client)
- Education : Ingénieur UTT
- Contact : contact@tblabs.dev + LinkedIn

---

## Configuration DNS (OVH)

Enregistrements configurés dans la Zone DNS OVH :

```
tblabs.dev      A       185.199.108.153
tblabs.dev      A       185.199.109.153
tblabs.dev      A       185.199.110.153
tblabs.dev      A       185.199.111.153
www.tblabs.dev  CNAME   theoucs.github.io.
```

---

## Email

- **Adresse** : contact@tblabs.dev
- **Service** : Zimbra Mail (OVH)
- **Webmail** : https://webmail.mail.ovh.net

---

## Déploiement

Le site se déploie automatiquement via GitHub Pages à chaque push sur `main`.

```bash
# Pour déployer des changements
git add -A
git commit -m "Description du changement"
git push origin main
```

---

## À faire / Ideas futures

- [ ] Ajouter le vrai lien App Store quand Drip sera publié
- [ ] Ajouter d'autres apps quand elles seront créées
- [ ] Potentiellement ajouter des animations de pluie en fond (comme dans l'app)

---

*Dernière mise à jour : Janvier 2026*
