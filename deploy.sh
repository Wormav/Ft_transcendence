#!/bin/bash

echo "🚀 Déploiement de la démo Ft_transcendence sur GitHub Pages"

# Vérifier que nous sommes sur la bonne branche
echo "📋 Vérification de la branche..."
BRANCH=$(git branch --show-current)
echo "Branche actuelle: $BRANCH"

# Vérifier que le repository est clean
if [[ `git status --porcelain` ]]; then
    echo "⚠️  Il y a des changements non commités. Veuillez commiter vos changements avant de déployer."
    exit 1
fi

# Build du projet en mode démo
echo "🔨 Build du projet en mode démo..."
npm run build:demo

# Vérification que le build s'est bien passé
if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

# Déploiement sur GitHub Pages
echo "🌐 Déploiement sur GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "🎉 Déploiement réussi!"
    echo "🔗 Votre démo sera disponible à: https://Wormav.github.io/42_Ft_transcendence"
    echo "⏱️  Il peut falloir quelques minutes pour que les changements soient visibles"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
