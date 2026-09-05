# Feuille de route

## Fait

**Projets, zones et persistance : terminé.** Les projets, leurs zones et les collections
de favoris sont enregistrés dans le stockage local du navigateur. Un projet porte les
coordonnées du client et contient une ou plusieurs zones, chacune avec sa propre
sélection. Les documents et la coupe agrègent l'ensemble des zones, avec des
sous-totaux par zone sur le récapitulatif interne.

Limite connue : le stockage est propre à chaque appareil et à chaque navigateur. Les
projets créés sur l'iPad ne sont pas visibles sur le PC. Une synchronisation demanderait
un compte et un serveur, ce qui sort du cadre d'un site statique.

**Photographies : terminé.** 757 vues couvrant 338 des 341 espèces, extraites de la
photothèque Jardisoft dont l'utilisateur détient les droits, recadrées au carré en
480 px et recompressées de 101 à 40 Mo. Le rapprochement se fait par le nom latin
normalisé : assets/photos/<nom-latin>-<n>.jpg. Trois espèces restent sans image :
Bulbine frutescens, Cardamine pratensis et Isopogon formosus.

**Fiches horticoles : terminé.** 341 fiches rédigées, couvrant les 594 écritures du
catalogue et la totalité des 1 884 références commerciales. Le système d'alias rattache
les variantes d'écriture du fournisseur à la fiche correspondante.

## Prioritaire

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

- Actualiser les tarifs à chaque nouveau catalogue fournisseur, sans perdre les fiches
- Marges et prix de vente, aujourd'hui absents : seul le prix d'achat HT figure
- Synchronisation des projets entre iPad et PC
- Export et import des projets par fichier, à défaut de synchronisation

## Vérifications avant usage réel

- Relire les noms latins : le découpage espèce / cultivar est automatique et
  quelques cultivars ont pu être classés comme espèces
- Valider les densités, qui déterminent les quantités et donc les montants
- Vérifier les rusticités limites : Viburnum tinus, Rosmarinus, Salvia microphylla,
  Euphorbia characias
