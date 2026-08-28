# -*- coding: utf-8 -*-
"""Regenere data/plantes.js a partir du catalogue fournisseur et des fiches.

Usage :  python3 outils/construire_donnees.py
"""
import json, os, sys, subprocess

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RACINE, "outils"))

import pandas as pd
from fiches import FICHES
from complements import COMPLEMENTS

CAT = os.path.join(RACINE, "outils", "cat.pkl")
if not os.path.exists(CAT):
    print("cat.pkl absent : lancez d'abord  python3 outils/nettoyage.py")
    sys.exit(1)

cat = pd.read_pickle(CAT)
lats = {f["lat"] for f in FICHES}
sub = cat[cat["Nom latin"].isin(lats)]

sortie = []
for f in FICHES:
    refs, vus = [], set()
    for _, x in sub[sub["Nom latin"] == f["lat"]].iterrows():
        k = (x["Cultivar"], x["Conteneur"], x["Taille"])
        if k in vus:
            continue
        vus.add(k)
        refs.append({"cv": x["Cultivar"], "ct": x["Conteneur"],
                     "tl": x["Taille"], "px": x["Prix HT palier 1"]})
    d = dict(f)
    d["refs"] = sorted(refs, key=lambda z: z["px"] or 0)
    bdm, dens, esp = COMPLEMENTS[f["lat"]]
    d["bdm"], d["dens"], d["esp"] = bdm, dens, esp
    sortie.append(d)

dest = os.path.join(RACINE, "data", "plantes.js")
with open(dest, "w", encoding="utf-8") as fh:
    fh.write("// Base vegetale - catalogue AD.V Production 2026/27.\n")
    fh.write("// Fichier genere par outils/construire_donnees.py. Ne pas editer a la main.\n")
    fh.write("const DATA = ")
    json.dump(sortie, fh, ensure_ascii=False, indent=1)
    fh.write(";\n")

print(len(sortie), "especes ecrites dans data/plantes.js")
