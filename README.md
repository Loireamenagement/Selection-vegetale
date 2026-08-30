# Sélection végétale

Outil de conseil client pour la prescription végétale sur le terrain.

Application web utilisable sur iPad Pro en clientèle et sur PC au bureau. Elle permet
de filtrer les végétaux selon les conditions du site et les souhaits du client, de
consulter une fiche technique par espèce, de composer une sélection et de l'envoyer
au client sous forme de proposition chiffrée.

## Lancer l'application

Ouvrir `index.html` dans un navigateur. Aucune installation, aucun serveur.

Une fois le dépôt publié via GitHub Pages, l'application est accessible à une adresse
web depuis n'importe quel appareil connecté.

## Organisation des fichiers

```
index.html                    structure de la page
css/styles.css                mise en forme
js/app.js                     filtres, fiches, favoris, sélection
data/plantes.js               base végétale (généré, ne pas éditer à la main)
docs/                         modèle de données et feuille de route
outils/                       scripts de génération de la base
```

## Régénérer la base végétale

La base est produite à partir du catalogue tarifaire du fournisseur et des fiches
horticoles saisies dans `outils/fiches.py`.

```bash
pip install pandas openpyxl
python3 outils/nettoyage.py            # nettoie le catalogue fournisseur
python3 outils/construire_donnees.py   # écrit data/plantes.js
python3 outils/construire_tableur.py   # écrit le classeur de travail
```

Le catalogue source attendu est le fichier `AD_V_Production_Catalogue_Paysage_Générique_2026_27.xlsx`,
dont le chemin est indiqué en tête de `outils/nettoyage.py`.

## État d'avancement

| Élément | État |
|---|---|
| Espèces issues du catalogue | 594 |
| Fiches horticoles complètes | 270 (couvrant 409 écritures et 90 % des références) |
| Références commerciales | 1 884 |
| Filtres | Type, exposition, sol, humidité, rusticité, littoral, hauteur, feuillage, floraison, plantation, entretien |
| Chiffrage | Par surface (densité) et par longueur (distance de plantation) |
| Favoris | Collections par usage, en mémoire de session uniquement |
| Documents | Palette client sans prix · Récapitulatif interne chiffré |
| Envoi au client | Simulé |

## Données commerciales

Ce dépôt contient les tarifs négociés avec le fournisseur. **Il doit rester privé.**

## À faire

Voir `docs/feuille-de-route.md`.
