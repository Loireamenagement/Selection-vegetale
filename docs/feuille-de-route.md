# Feuille de route

## Fait

**Photographies : terminé.** 757 vues couvrant 338 des 341 espèces, extraites de la
photothèque Jardisoft dont l'utilisateur détient les droits, recadrées au carré en
480 px et recompressées de 101 à 40 Mo. Le rapprochement se fait par le nom latin
normalisé : assets/photos/<nom-latin>-<n>.jpg. Trois espèces restent sans image :
Bulbine frutescens, Cardamine pratensis et Isopogon formosus.

**Fiches horticoles : terminé.** 341 fiches rédigées, couvrant les 594 écritures du
catalogue et la totalité des 1 884 références commerciales. Le système d'alias rattache
les variantes d'écriture du fournisseur à la fiche correspondante.

## Prioritaire

**Rendre les favoris persistants.** Les collections disparaissent au rechargement.
À stocker sur le poste puis, à terme, sur un compte synchronisé entre iPad et PC.

**Générer la proposition client.** Le bouton d'envoi est simulé. Il doit produire un
PDF (récapitulatif chiffré et fiches techniques des espèces retenues) et l'envoyer
par email.

## Ensuite

**Mise en PWA.** Manifeste et service worker, pour installer l'application sur
l'écran d'accueil de l'iPad et la lancer sans barre de navigateur.

**Enrichissement depuis une base externe.** Rapprochement sur le nom latin avec
VégéBase (Plante & Cité) ou l'API Trefle, pour compléter automatiquement les fiches
restantes.

## À étudier

- Mémoriser les sélections par client, et les retrouver d'une visite à l'autre
- Actualiser les tarifs à chaque nouveau catalogue fournisseur, sans perdre les fiches
- Marges et prix de vente, aujourd'hui absents : seul le prix d'achat HT figure
- Vue par massif, pour composer plusieurs zones dans une même proposition

## Vérifications avant usage réel

- Relire les noms latins : le découpage espèce / cultivar est automatique et
  quelques cultivars ont pu être classés comme espèces
- Valider les densités, qui déterminent les quantités et donc les montants
- Vérifier les rusticités limites : Viburnum tinus, Rosmarinus, Salvia microphylla,
  Euphorbia characias
