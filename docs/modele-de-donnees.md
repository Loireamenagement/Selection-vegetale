# Modèle de données

Une espèce botanique = une fiche. Les déclinaisons commerciales (cultivar, conteneur,
taille, prix) sont rattachées à la fiche sous forme de références.

## Champs d'une espèce

| Clé | Champ | Rôle | Valeurs |
|---|---|---|---|
| `lat` | Nom latin | Clé unique, liaison avec une base botanique externe | Genre + espèce |
| `fr` | Nom commun | Affichage client | Texte |
| `type` | Type de végétal | Filtre | Arbre · Arbuste · Conifère · Couvre-sol · Vivace · Graminée · Grimpante · Fruitier · Aromatique |
| `h` / `l` | Hauteur / largeur adultes | Filtre + fiche | Mètres |
| `expo` | Exposition | Filtre | Plein soleil · Soleil à mi-ombre · Mi-ombre · Mi-ombre à ombre · Soleil à ombre · Ombre |
| `sol` | Nature de sol | Filtre | Tout type · Drainé · Profond · Humifère · Sec · Frais · Calcaire toléré · Acide · Argileux toléré · Pauvre toléré · Caillouteux |
| `hum` | Humidité du sol | Filtre | Sec · Sec à frais · Frais · Frais à humide · Humide |
| `rust` | Rusticité | Filtre | Entier négatif, en °C |
| `bdm` | Exposition au littoral | Filtre hiérarchique | Front de mer · Second rideau · Déconseillé en bord de mer |
| `feu` | Feuillage | Filtre | Persistant · Semi-persistant · Caduc |
| `cfeu` | Couleur du feuillage | Fiche | Texte |
| `m1` / `m2` | Floraison début / fin | Filtre par mois | 1 à 12, passage possible par décembre |
| `flo` | Période de floraison | Fiche | Texte |
| `cflo` | Couleur de floraison | Fiche, pastilles | Liste séparée par des virgules |
| `plant` | Période de plantation | Filtre | Automne · Printemps · Automne à printemps · Printemps (à éviter en automne) |
| `popt` | Période optimale | Fiche | Texte |
| `ent` | Niveau d'entretien | Filtre | Faible · Moyen · Soutenu |
| `dens` | Densité | Chiffrage par surface | Sujets au m² |
| `esp` | Distance de plantation | Chiffrage par longueur | Mètres entre deux sujets |
| `style` | Style et usages | Fiche | Texte |
| `asso` | Associations | Fiche | Texte |
| `cons` | Conseils d'entretien | Fiche | Texte |
| `rq` | Risques | Filtre d'exclusion, encart fiche, document | Tableau |
| `rc` | Système racinaire | Coupe, filtres sol et recul | `{t, p, d}` |
| `ph` | Photographies | Numéros des vues disponibles | Tableau |
| `refs` | Références commerciales | Choix du calibre | Tableau |

## Système racinaire

`t` : type d'enracinement — `piv` pivotant, `tra` traçant, `sup` superficiel étalé,
`fas` fasciculé, `dra` drageonnant, `cha` charnu fragile.
`p` : profondeur d'enracinement principal, en mètres.
`d` : distance de sécurité aux canalisations, fosses, murs et dallages, en mètres.
Valeur 0 : aucune précaution particulière.

Les valeurs sont des ordres de grandeur en conditions courantes. Un même sujet pivote
en terrain profond et s'étale sur substrat superficiel.

## Risques

Chaque risque porte une catégorie (`tox` toxique par ingestion, `irr` irritant au
contact, `epi` épineux, `pol` pollen allergisant, `env` envahissante ou réglementée,
`rac` racines envahissantes) et un niveau : 1 pour une vigilance simple, 2 pour une
attention forte. La section « Précautions particulières » du document client
n'apparaît que si la sélection contient au moins une espèce de niveau 2.

## Champs d'une référence commerciale

| Clé | Champ |
|---|---|
| `cv` | Cultivar, vide pour l'espèce type |
| `ct` | Conteneur (P8, C1.3L, C3L…) |
| `tl` | Taille du sujet |
| `px` | Prix HT, premier palier de quantité |

## Règles de filtrage

**Littoral.** Hiérarchique. Une espèce de front de mer convient aussi en second
rideau, l'inverse est faux.

**Floraison.** Le filtre retient les espèces fleuries pendant *tous* les mois cochés,
pas au moins un. Une période à cheval sur l'année (novembre à avril) est traitée
correctement.

**Nature de sol.** Un champ texte contient plusieurs mentions. La correspondance se
fait sur le premier mot de chaque valeur du référentiel.

**Rusticité et hauteur.** Seuils, non égalités : une espèce passe si elle tient au
moins le froid demandé, et si elle ne dépasse pas la hauteur demandée.

## Précaution

Les données horticoles n'ont pas été extraites d'une base certifiée. Elles doivent
être relues avant d'être présentées à un client, en particulier la rusticité, très
variable selon les sources, et la densité, qui détermine directement le montant du
devis.
