# Projet Individuel - Stack Docker Fullstack (React / Python / MySQL / Adminer)

## 📋 Description

Ce projet a pour objectif de mettre en place une architecture complète en conteneurs Docker avec :

- Une interface **React** avec formulaire.
- Un backend **Python** (Flask ou FastAPI recommandé).
- Une base de données **MySQL**.
- Un outil d'administration de base de données : **Adminer**.

### Fonctionnalités

- Le formulaire React permet d’enregistrer les données utilisateur en base (plus de LocalStorage).
- Affichage de la liste des utilisateurs (informations publiques uniquement).
- Suppression possible d’un utilisateur si connecté en tant qu’administrateur.
- Visualisation des informations privées des utilisateurs via un compte admin.

---

## 🔐 Compte administrateur

Un administrateur est créé automatiquement lors de l’initialisation de la base, via des variables d’environnement :

