# -*- coding: utf-8 -*-
"""Rapprochement des fiches horticoles avec les photothèques Jardisoft.

Deux bibliothèques sources :
  - Bible 1 : C:\\jardisoft\\04-Bibles\\Photos\\lepage\\   noms codés (abutme1.jpg)
  - Bible 2 : C:\\jardisoft\\04-Bibles\\Photos\\           noms latins (Abelia grandiflora.jpg)

Produit :
  - photos/copier_photos.bat   script de copie et de renommage pour Windows
  - photos/correspondance.csv  tableau de contrôle
"""
import os, re, sys, csv, unicodedata
from collections import defaultdict

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RACINE, "outils"))

from fiches import FICHES
from fiches2 import FICHES2
from fiches3 import FICHES3
from fiches4 import FICHES4
from fiches5 import FICHES5
from fiches6 import FICHES6

FICHES_TOUTES = [f for L in (FICHES, FICHES2, FICHES3, FICHES4, FICHES5, FICHES6) for f in L]

MAX_PHOTOS = 4          # nombre maximum de vues conservées par espèce

# Orthographes divergentes entre le catalogue AD.V et les photothèques
ORTHOGRAPHE = {
    "Buddleia davidii":       "Buddleja davidii",
    "Weigelia":               "Weigela",
    "Vaccinum corymbosum":    "Vaccinium corymbosum",
    "Calistemon laevis":      "Callistemon",
    "Griselina litoralis":    "Griselinia littoralis",
    "Clerodendron bungei":    "Clerodendrum",
    "Albizzia julibrissin":   "Albizia julibrissin",
    "Lippia citriodora":      "Aloysia triphylla",
    "Passiflore":             "Passiflora",
    "Acer sac":               "Acer saccharinum",
    "Juniperus chin":         "Juniperus chinensis",
    "Catalpa bignoides":      "Catalpa bignonioides",
    "Malus coccinela":        "Malus",
    "Levistichum officinalis":"Levisticum officinale",
    "Hyacynthoides non-scripta": "Hyacinthoides non-scripta",
    "Cydonia oblanga":        "Cydonia oblonga",
    "Thuya plicata":          "Thuja plicata",
    "Magnolia soulangiana":   "Magnolia soulangeana",
    "Stipa tenuifolia":       "Stipa tenuissima",
    "Rosa":                   "Rosa",
    "Stachys byzanthina":     "Stachys byzantina",
    "Rhaphiolepis umbellata": "Rhaphiolepis",
    "Genista porlock":        "Genista",
    "Salvia microphylla":     "Salvia microphylla",
    "Acer campestris":        "Acer campestre",
    "Euonymus":               "Euonymus fortunei",
    "Cotoneaster":            "Cotoneaster",
    "Mahonia":                "Mahonia",
    "Escallonia":             "Escallonia",
    "Loropetalum":            "Loropetalum chinense",
    "Diospyros":              "Diospyros kaki",
    "Campsis":                "Campsis radicans",
    "Paulownia":              "Paulownia tomentosa",
    "Leptospermum":           "Leptospermum scoparium",
    "Ulmus campestris":       "Ulmus",
}


def sansacc(t):
    t = unicodedata.normalize("NFD", t)
    return "".join(c for c in t if unicodedata.category(c) != "Mn").lower()


def mots(nom):
    """Découpe un nom de fichier en mots latins exploitables."""
    b = sansacc(nom.rsplit(".", 1)[0])
    b = re.sub(r"\(\s*\d+\s*\)", " ", b)          # les (1), (2) de doublons
    b = b.replace("`", " ").replace("'", " ").replace("’", " ")
    b = re.sub(r"[^a-z0-9\s-]", " ", b)
    return [w for w in re.split(r"[\s_-]+", b) if w]


def charger_bible2(chemin):
    """Photothèque à noms latins. Renvoie deux index : (genre, espèce) et genre."""
    par_esp, par_gen = defaultdict(list), defaultdict(list)
    for ligne in open(chemin, encoding="utf-8", errors="replace"):
        ligne = ligne.strip().strip('"')
        if not ligne or ligne.lower().endswith(".txt"):
            continue
        fichier = ligne.split("\\")[-1]
        m = mots(fichier)
        if not m:
            continue
        par_gen[m[0]].append(fichier)
        if len(m) > 1:
            par_esp[(m[0], m[1])].append(fichier)
    return par_esp, par_gen


def charger_bible1(chemin):
    """Photothèque à codes. Index par code de 6 lettres (genre 4 + espèce 2)."""
    par_code = defaultdict(list)
    for ligne in open(chemin, encoding="utf-8", errors="replace"):
        ligne = ligne.strip().strip('"')
        if not ligne:
            continue
        fichier = ligne.split("\\")[-1]
        code = re.sub(r"\d+$", "", fichier.lower().rsplit(".", 1)[0])
        par_code[code].append(fichier)
    return par_code


def code_jardicontact(nom_latin):
    m = sansacc(nom_latin).replace("-", " ").split()
    return m[0][:4] + (m[1][:2] if len(m) > 1 else "")


def cle_fichier(nom_latin):
    """Nom de fichier normalisé : abelia-grandiflora"""
    return re.sub(r"[^a-z0-9]+", "-", sansacc(nom_latin)).strip("-")


def apparier(fiche, b2_esp, b2_gen, b1_code):
    """Renvoie (liste de fichiers, source, précision)."""
    latin = ORTHOGRAPHE.get(fiche["lat"], fiche["lat"])
    m = sansacc(latin).replace("-", " ").split()
    genre = m[0]
    espece = m[1] if len(m) > 1 else ""

    if espece and (genre, espece) in b2_esp:
        return b2_esp[(genre, espece)], "bible2", "espèce"

    code = code_jardicontact(latin)
    if code in b1_code:
        return b1_code[code], "bible1", "espèce"

    # cultivars : le code de la fiche est un préfixe de celui de la photo
    cult = [f for k, v in b1_code.items() if k.startswith(code) for f in v]
    if cult:
        return cult, "bible1", "cultivar"

    if genre in b2_gen:
        return b2_gen[genre], "bible2", "genre"

    gen1 = [f for k, v in b1_code.items() if k.startswith(genre[:4]) for f in v]
    if gen1:
        return gen1, "bible1", "genre"

    return [], "", "aucune"


def trier(fichiers):
    """Les vues nommées le plus simplement d'abord, puis les cultivars."""
    return sorted(fichiers, key=lambda f: (len(f), f.lower()))


def main(liste_b1, liste_b2, sortie):
    b2_esp, b2_gen = charger_bible2(liste_b2)
    b1_code = charger_bible1(liste_b1)

    os.makedirs(sortie, exist_ok=True)
    lignes_csv, copies = [], []
    stats = defaultdict(int)

    for f in sorted(FICHES_TOUTES, key=lambda x: x["lat"]):
        fichiers, source, precision = apparier(f, b2_esp, b2_gen, b1_code)
        retenus = trier(fichiers)[:MAX_PHOTOS]
        stats[precision] += 1
        cle = cle_fichier(f["lat"])
        noms_finaux = []
        for i, src in enumerate(retenus, start=1):
            ext = src.rsplit(".", 1)[-1].lower()
            dest = f"{cle}-{i}.{ext}"
            noms_finaux.append(dest)
            dossier = "lepage\\" if source == "bible1" else ""
            copies.append((dossier + src, dest))
        lignes_csv.append([f["lat"], f["fr"], f["type"], precision, source,
                           len(retenus), " | ".join(noms_finaux)])

    with open(os.path.join(sortie, "correspondance.csv"), "w", newline="",
              encoding="utf-8-sig") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["Nom latin", "Nom commun", "Type", "Précision",
                    "Source", "Nb photos", "Fichiers générés"])
        w.writerows(lignes_csv)

    bat = os.path.join(sortie, "copier_photos.bat")
    with open(bat, "w", encoding="cp1252", errors="replace") as fh:
        fh.write("@echo off\r\n")
        fh.write("REM Extraction des photos utiles depuis la photothèque Jardisoft.\r\n")
        fh.write("REM Placez ce fichier dans C:\\jardisoft\\04-Bibles\\Photos\\ et double-cliquez.\r\n\r\n")
        fh.write('set "SRC=%~dp0"\r\n')
        fh.write('set "DST=%~dp0_export_selection"\r\n')
        fh.write('if not exist "%DST%" mkdir "%DST%"\r\n\r\n')
        for src, dest in copies:
            fh.write(f'copy /Y "%SRC%{src}" "%DST%\\{dest}" >nul 2>&1\r\n')
        fh.write('\r\necho.\r\n')
        fh.write(f'echo Termine. {len(copies)} photos copiees dans _export_selection\r\n')
        fh.write('pause\r\n')

    print("fiches traitées :", len(FICHES_TOUTES))
    for k in ("espèce", "cultivar", "genre", "aucune"):
        print(f"  {k:10} {stats[k]}")
    print("photos à extraire :", len(copies))
    print("script :", bat)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3
         else os.path.join(RACINE, "photos"))
