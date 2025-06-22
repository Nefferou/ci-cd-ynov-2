# ci-cd-ynov-yves-estrada

Projet ReactJS développé dans le cadre d’un projet à rendre lié à l’intégration continue et au déploiement continu (CI/CD).  
Ce projet permet d’expérimenter le cycle de vie d’une application front-end, de son développement local jusqu'à ses tests automatisés.

## 🧰 Prérequis

Avant de lancer le projet, assurez-vous d’avoir les éléments suivants installés sur votre machine :

- **Node.js** (version recommandée : `>=18.x`)
- **npm** (installé avec Node.js)

Vous pouvez vérifier vos versions avec les commandes suivantes :

```bash
node -v
npm -v
```

> 💡 Ce projet utilise React, donc tous les outils de base du frontend moderne (webpack, babel, etc.) sont déjà inclus via `create-react-app`.

## 🚀 Lancer l'application

1. Clonez le dépôt si ce n’est pas déjà fait :

```bash
git clone https://github.com/Arseid/ci-cd-ynov.git
cd ci-cd-ynov-yves-estrada
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez l'application :

```bash
npm start
```

L’application sera disponible sur [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🧪 Lancer les tests

Pour exécuter les tests (via `react-scripts` / Jest) :

```bash
npm test
```

> Cela lancera l’environnement de test en mode interactif. Vous pouvez appuyer sur `a` pour exécuter tous les tests, ou `q` pour quitter.
