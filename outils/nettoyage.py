# -*- coding: utf-8 -*-
import pandas as pd, re, unicodedata
from noms_communs import NOMS_GENRES, NOMS_ESPECES

SRC = "/mnt/user-data/uploads/AD_V_Production_Catalogue_Paysage_Générique_2026_27.xlsx"
df = pd.read_excel(SRC, sheet_name="Catalogue Gal paysage", header=None)

SECTIONS = {
    15: "Plantes couvre-sol et arbustes - Godets",
    127: "Plantes couvre-sol et arbustes - C1,3",
    None: None,
}
# reperage dynamique des sections
bornes = []
for i in range(14, len(df)):
    v = str(df.iloc[i, 0]).strip().upper()
    if v.startswith("PLANTES COUVRE-SOL ET ARBUSTES GODETS"):
        bornes.append((i, "Plantes couvre-sol et arbustes - Godets"))
    elif v.startswith("PLANTES COUVRE-SOL ET ARBUSTES C1,3"):
        bornes.append((i, "Plantes couvre-sol et arbustes - C1,3"))
    elif v == "GRAMINEES":
        bornes.append((i, "Graminées"))
    elif v == "VIVACES":
        bornes.append((i, "Vivaces"))
    elif v.startswith("ARBUSTES FORESTIERS"):
        bornes.append((i, "Arbustes forestiers"))
    elif v.startswith("ARBUSTES ORNEMENTAUX"):
        bornes.append((i, "Arbustes ornementaux"))
bornes = sorted(set(bornes))
print("Sections detectees:", bornes)

def section_de(idx):
    cur = None
    for start, nom in bornes:
        if idx >= start:
            cur = nom
    return cur

BRUIT = {"NAN", "", "SOMMAIRE", "GRAMINEES", "VIVACES", "PLANTES", "ARBUSTES",
         "GRAMINEES ET VIVACES"}

# --- Parsing du format fusionne : "ABELIA Confetti® C 3 L 30/40" ---
RE_FUSION = re.compile(r"^(.*?)\s+C\s*([\d]+(?:[.,]\d+)?)\s*L\s*(.*)$", re.IGNORECASE)

def parse_ligne(idx):
    nom_brut = str(df.iloc[idx, 0]).replace("\n", " ").strip()
    conteneur = str(df.iloc[idx, 1]).strip()
    taille = str(df.iloc[idx, 2]).strip()
    dispo = df.iloc[idx, 3]
    p1, p2, p3 = df.iloc[idx, 4], df.iloc[idx, 5], df.iloc[idx, 6]
    origine = str(df.iloc[idx, 7]).strip()

    if nom_brut.upper() in BRUIT or nom_brut == "nan":
        return None
    if pd.isna(p1):
        return None

    if conteneur in ("nan", ""):
        m = RE_FUSION.match(nom_brut)
        if m:
            nom_brut = m.group(1).strip()
            conteneur = "C" + m.group(2).replace(",", ".") + "L"
            taille = m.group(3).strip()
        else:
            conteneur = ""
    if taille in ("nan",):
        taille = ""
    return dict(nom_brut=nom_brut, conteneur=conteneur, taille=taille,
                dispo=dispo, p1=p1, p2=p2, p3=p3, origine=origine,
                section=section_de(idx))

# --- Normalisation du nom latin ---
MOTS_MARQUE = re.compile(r"[®™©]")

def normaliser(nom):
    n = MOTS_MARQUE.sub("", nom)
    n = n.replace("*", " ")
    n = re.sub(r"\s+", " ", n).strip(" -,")
    return n

# Terminaisons latines typiques d'un epithete specifique
RE_LATIN = re.compile(
    r".*(?:[aiou]ca|ata|ana|ina|osa|ica|ida|ima|ula|ella|era|ora|ura|ia|ea|oa"
    r"|um|us|is|ii|ense|ensis|oides|folia|folium|florus|flora|florum"
    r"|anum|anus|atum|atus|inum|inus|osum|osus|alis|ale|iflora|iflorum)$",
    re.IGNORECASE)

NON_ESPECES = {"hybride", "hybrida", "nain", "nains", "naine", "rouge", "rose",
               "blanc", "blanche", "bleu", "bleue", "jaune", "violette", "panache",
               "panachee", "pleureur", "grimpant", "grimpante", "tige", "buisson",
               "melange", "melanges", "varie", "varies", "mixte"}

def est_espece(mot, source_minuscule):
    m = mot.strip("'\"()").lower()
    if not m or any(c.isdigit() for c in m):
        return False
    if m in NON_ESPECES:
        return False
    if source_minuscule:            # la source distingue deja espece/cultivar
        return True
    if len(m) < 5:                  # "mary", "gold" -> cultivar
        return False
    return bool(RE_LATIN.fullmatch(m))

def decomposer(nom):
    """Retourne (genre, espece, cultivar)."""
    n = normaliser(nom)
    mots = n.split()
    if not mots:
        return "", "", ""
    genre = mots[0].capitalize()
    espece, cultivar = "", ""
    reste = mots[1:]
    if reste:
        cand = reste[0]
        # si la source ecrit deja le 2e mot en minuscules, c'est l'espece
        source_min = cand.islower() and not cand.isupper()
        if est_espece(cand, source_min):
            espece = cand.strip("'\"()").lower()
            cultivar = " ".join(reste[1:])
        else:
            cultivar = " ".join(reste)
    cultivar = re.sub(r"\s+", " ", cultivar).strip()
    if cultivar and cultivar.isupper():
        cultivar = cultivar.title()
    elif cultivar:
        cultivar = cultivar[0].upper() + cultivar[1:]
    return genre, espece, cultivar

def nom_commun(genre, espece):
    cle_esp = f"{genre} {espece}".upper().strip()
    if cle_esp in NOMS_ESPECES:
        return NOMS_ESPECES[cle_esp]
    return NOMS_GENRES.get(genre.upper(), "")

# --- Construction ---
lignes = []
for i in range(14, len(df)):
    r = parse_ligne(i)
    if r is None:
        continue
    genre, espece, cultivar = decomposer(r["nom_brut"])
    if not genre or genre.upper() in BRUIT:
        continue
    nom_latin = " ".join(x for x in [genre, espece] if x)
    nom_complet = " ".join(x for x in [genre, espece, cultivar] if x)
    lignes.append({
        "Section": r["section"],
        "Nom latin": nom_latin,
        "Cultivar": cultivar,
        "Nom complet": nom_complet,
        "Nom commun (FR)": nom_commun(genre, espece),
        "Genre": genre,
        "Conteneur": r["conteneur"],
        "Taille": r["taille"],
        "Dispo": r["dispo"] if pd.notna(r["dispo"]) else "",
        "Prix HT palier 1": round(float(r["p1"]), 2) if pd.notna(r["p1"]) else None,
        "Prix HT palier 2": round(float(r["p2"]), 2) if pd.notna(r["p2"]) else None,
        "Prix HT palier 3": round(float(r["p3"]), 2) if pd.notna(r["p3"]) else None,
        "Origine": r["origine"] if r["origine"] != "nan" else "",
        # colonnes horticoles a remplir
        "Type": "", "Hauteur adulte (m)": "", "Largeur adulte (m)": "",
        "Exposition": "", "Type de sol": "", "Humidité du sol": "",
        "Rusticité (°C)": "", "Feuillage": "", "Période de floraison": "",
        "Couleur floraison": "", "Entretien": "", "Usages paysagers": "",
        "Photo (URL)": "", "Notes perso": "",
    })

cat = pd.DataFrame(lignes)
print("Lignes produit:", len(cat))
print("Especes distinctes (nom complet):", cat["Nom complet"].nunique())
print("Genres:", cat["Genre"].nunique())
manque = cat[cat["Nom commun (FR)"] == ""]["Genre"].value_counts()
print("Genres sans nom commun:", len(manque))
print(manque.head(30))
cat.to_pickle("/home/claude/cat.pkl")
