# -*- coding: utf-8 -*-
"""Regenere data/plantes.js a partir du catalogue fournisseur et des fiches.

Usage :  python3 outils/construire_donnees.py
"""
import json, os, sys, subprocess

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RACINE, "outils"))

import pandas as pd
from fiches import FICHES
from fiches2 import FICHES2, ALIAS as ALIAS2
from fiches3 import FICHES3, ALIAS3
from fiches4 import FICHES4, ALIAS4

ALIAS = {**ALIAS2, **ALIAS3, **ALIAS4}
from complements import COMPLEMENTS

def toutes_les_fiches():
    """Lot 1 (complements separes) + lot 2 (complements integres)."""
    out = []
    for f in FICHES:
        d = dict(f)
        bdm, dens, esp = COMPLEMENTS[f["lat"]]
        d["bdm"], d["dens"], d["esp"] = bdm, dens, esp
        out.append(d)
    out.extend(dict(f) for f in FICHES2)
    out.extend(dict(f) for f in FICHES3)
    out.extend(dict(f) for f in FICHES4)
    return out

CAT = os.path.join(RACINE, "outils", "cat.pkl")
if not os.path.exists(CAT):
    print("cat.pkl absent : lancez d'abord  python3 outils/nettoyage.py")
    sys.exit(1)

cat = pd.read_pickle(CAT)
FICHES_TOUTES = toutes_les_fiches()

# une fiche peut recevoir les references de plusieurs ecritures du catalogue
noms = {}
for f in FICHES_TOUTES:
    noms.setdefault(f["lat"], set()).add(f["lat"])
for variante, cible in ALIAS.items():
    if cible in noms:
        noms[cible].add(variante)

sortie = []
for f in FICHES_TOUTES:
    refs, vus = [], set()
    sub = cat[cat["Nom latin"].isin(noms[f["lat"]])]
    for _, x in sub.iterrows():
        k = (x["Cultivar"], x["Conteneur"], x["Taille"])
        if k in vus:
            continue
        vus.add(k)
        refs.append({"cv": x["Cultivar"], "ct": x["Conteneur"],
                     "tl": x["Taille"], "px": x["Prix HT palier 1"]})
    d = dict(f)
    d["refs"] = sorted(refs, key=lambda z: z["px"] or 0)
    sortie.append(d)
sortie.sort(key=lambda d: d["lat"])

dest = os.path.join(RACINE, "data", "plantes.js")
with open(dest, "w", encoding="utf-8") as fh:
    fh.write("// Base vegetale - catalogue AD.V Production 2026/27.\n")
    fh.write("// Fichier genere par outils/construire_donnees.py. Ne pas editer a la main.\n")
    fh.write("const DATA = ")
    json.dump(sortie, fh, ensure_ascii=False, indent=1)
    fh.write(";\n")

print(len(sortie), "especes ecrites dans data/plantes.js")
