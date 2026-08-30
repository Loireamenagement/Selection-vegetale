# -*- coding: utf-8 -*-
"""Signalement des risques par espece.

Chaque entree : liste de risques, chacun decrit par
    c : categorie   tox irr epi pol env rac
    n : niveau      1 = vigilance, 2 = attention forte
    t : texte affiche sur la fiche et dans le document client

Categories :
    tox  toxique par ingestion
    irr  irritant au contact
    epi  epineux ou piquant
    pol  pollen allergisant
    env  envahissante ou reglementee
    rac  racines envahissantes
"""

CATEGORIES = {
    "tox": "Toxique par ingestion",
    "irr": "Irritant au contact",
    "epi": "Épineux",
    "pol": "Pollen allergisant",
    "env": "Envahissante ou réglementée",
    "rac": "Racines envahissantes",
}

def _(c, n, t):
    return {"c": c, "n": n, "t": t}

RISQUES = {

# ---------------------------------------------------------------- toxiques
"Taxus baccata": [_("tox", 2,
  "Toutes les parties sont très toxiques sauf la pulpe rouge du fruit, la graine "
  "qu'elle contient étant elle-même mortelle. Dangereux aussi pour les chevaux et "
  "les bovins. À écarter des jardins d'enfants et des pâtures.")],

"Laburnum anagyroides": [_("tox", 2,
  "Toute la plante est très toxique, en particulier les graines contenues dans les "
  "gousses, qui ressemblent à des petits pois et attirent les enfants. À déconseiller "
  "dans un jardin fréquenté par de jeunes enfants ou des animaux.")],

"Azalea japonica": [_("tox", 2,
  "Feuilles et fleurs contiennent des grayanotoxines, toxiques pour l'homme comme pour "
  "les animaux domestiques. Le miel produit à partir de ses fleurs est lui-même toxique.")],

"Helleborus niger": [_("tox", 2,
  "Toute la plante est toxique, avec un effet sur le rythme cardiaque. La sève est "
  "également irritante pour la peau : porter des gants à la taille.")],

"Symphoricarpos doorenbosii": [_("tox", 2,
  "Les grosses baies blanches sont toxiques et particulièrement attirantes pour les "
  "enfants, qui les confondent avec des bonbons. À écarter des aires de jeu.")],

"Ilex aquifolium": [_("tox", 2,
  "Les baies rouges sont toxiques et très attirantes pour les enfants. Une vingtaine "
  "de baies peut provoquer des troubles sérieux chez un jeune enfant."),
  _("epi", 1, "Feuillage à pointes acérées : à écarter des passages étroits.")],

"Prunus laurocerasus": [_("tox", 2,
  "Feuilles et noyaux libèrent de l'acide cyanhydrique. Les déchets de taille sont "
  "dangereux pour le bétail et ne doivent pas être laissés accessibles."),
  _("env", 2,
  "Considéré comme envahissant dans plusieurs régions : il se ressème par les oiseaux "
  "et colonise les sous-bois. À intégrer de préférence dans une haie mixte.")],

"Prunus lusitanica": [_("tox", 1,
  "Feuilles et noyaux cyanogènes, comme chez le laurier-cerise. Ne pas laisser les "
  "déchets de taille à portée du bétail.")],

"Euonymus europaeus": [_("tox", 2,
  "Les fruits roses s'ouvrant sur des graines orange vif sont très attirants et "
  "toxiques. À écarter des aires de jeu des enfants.")],

"Euonymus": [_("tox", 1, "Fruits toxiques par ingestion, en faible quantité.")],
"Euonymus japonicus": [_("tox", 1, "Fruits toxiques par ingestion.")],
"Euonymus alatus": [_("tox", 1, "Fruits toxiques par ingestion.")],

"Ligustrum vulgare": [_("tox", 1,
  "Baies noires toxiques par ingestion."),
  _("pol", 1, "Floraison au parfum entêtant, mal supportée par certaines personnes.")],
"Ligustrum japonicum": [_("tox", 1, "Baies toxiques par ingestion."),
  _("pol", 1, "Floraison au parfum entêtant.")],
"Ligustrum ovalifolium": [_("tox", 1, "Baies toxiques par ingestion."),
  _("pol", 1, "Floraison au parfum entêtant.")],

"Rhamnus frangula": [_("tox", 1,
  "Baies fortement purgatives, toxiques en quantité. L'écorce fraîche l'est également.")],

"Nandina domestica": [_("tox", 1,
  "Les baies rouges contiennent des composés cyanogènes. Toxiques en quantité, "
  "notamment pour les chats et les oiseaux domestiques.")],

"Hedera": [_("tox", 1, "Baies noires toxiques par ingestion."),
  _("irr", 1, "La sève peut provoquer une dermatite de contact : gants à la taille.")],

"Sambucus nigra": [_("tox", 1,
  "Les baies crues et les parties vertes sont toxiques. Les baies deviennent "
  "comestibles après cuisson, les fleurs le sont crues.")],

"Viburnum opulus": [_("tox", 1, "Baies rouges toxiques crues.")],
"Viburnum lantana": [_("tox", 1, "Baies toxiques par ingestion.")],
"Viburnum tinus": [_("tox", 1, "Baies bleu-noir toxiques par ingestion.")],
"Viburnum davidii": [_("tox", 1, "Baies toxiques par ingestion.")],
"Viburnum bodnantense": [_("tox", 1, "Fruits toxiques par ingestion.")],
"Viburnum carlcephalum": [_("tox", 1, "Fruits toxiques par ingestion.")],
"Viburnum plicatum": [_("tox", 1, "Fruits toxiques par ingestion.")],

"Lonicera nitida": [_("tox", 1, "Baies violacées toxiques par ingestion.")],
"Lonicera pileata": [_("tox", 1, "Baies toxiques par ingestion.")],
"Lonicera japonica": [_("tox", 1, "Baies toxiques par ingestion."),
  _("env", 2,
  "Classée envahissante dans plusieurs régions : très vigoureuse, elle étouffe la "
  "végétation voisine. Taille annuelle sévère indispensable.")],

"Cotoneaster": [_("tox", 1, "Baies faiblement toxiques par ingestion."),
  _("env", 1, "Sensible au feu bactérien : éviter la taille par temps humide.")],
"Cotoneaster dammeri": [_("tox", 1, "Baies faiblement toxiques."),
  _("env", 1, "Sensible au feu bactérien.")],
"Cotoneaster horizontalis": [_("tox", 1, "Baies faiblement toxiques."),
  _("env", 1, "Sensible au feu bactérien.")],

"Pyracantha": [_("epi", 2,
  "Épines très acérées et solides. Excellent en haie défensive, mais à proscrire le "
  "long d'un passage, d'une allée ou d'une aire de jeu."),
  _("tox", 1, "Baies faiblement toxiques par ingestion."),
  _("env", 1, "Sensible au feu bactérien : tailler par temps sec.")],

"Aquilegia vulgaris": [_("tox", 1, "Graines et racines toxiques par ingestion.")],
"Hyacynthoides non-scripta": [_("tox", 1, "Bulbe toxique par ingestion.")],
"Muscari armeniacum": [_("tox", 1, "Bulbe toxique par ingestion.")],
"Iris germanica": [_("tox", 1, "Rhizome toxique par ingestion, irritant au contact.")],
"Iris pseudacorus": [_("tox", 1, "Rhizome toxique par ingestion, irritant au contact.")],
"Iris sibirica": [_("tox", 1, "Rhizome toxique par ingestion.")],
"Iris foetidissima": [_("tox", 1, "Baies orange et rhizome toxiques par ingestion.")],

"Robinia pseudoacacia": [_("tox", 1,
  "Écorce, feuilles et graines sont toxiques, en particulier pour les chevaux."),
  _("epi", 1, "Épines sur les jeunes rameaux ; les cultivars horticoles en sont dépourvus."),
  _("env", 2,
  "Classé envahissant dans plusieurs régions : il drageonne fortement et colonise les "
  "milieux ouverts. À éviter en lisière de terrain naturel."),
  _("rac", 1, "Drageonne à distance du pied : éloigner des zones cultivées.")],

"Ricinus": [],

# ------------------------------------------------------------- irritants
"Euphorbia characias": [_("irr", 2,
  "Le latex blanc est fortement irritant pour la peau et dangereux pour les yeux. "
  "Gants et lunettes obligatoires à la taille. À signaler s'il y a de jeunes enfants.")],
"Euphorbia amygdaloides": [_("irr", 2,
  "Latex irritant pour la peau et les yeux. Port de gants obligatoire à la taille.")],
"Euphorbia myrsinites": [_("irr", 2,
  "Latex irritant pour la peau et les yeux. Port de gants obligatoire à la taille.")],

"Ruta graveolens": [_("irr", 2,
  "La sève provoque de graves brûlures cutanées en présence de soleil, parfois "
  "plusieurs jours après le contact. Manipulation avec gants et manches longues. "
  "À proscrire dans un jardin fréquenté par des enfants.")],

"Ficus carica": [_("irr", 2,
  "Le latex des feuilles et des rameaux est phototoxique : il provoque des brûlures "
  "cutanées en présence de soleil. Taille avec gants et manches longues."),
  _("rac", 2,
  "Racines puissantes et traçantes : prévoir au moins 5 m de recul des canalisations, "
  "murs et dallages.")],

"Angelica archangelica": [_("irr", 2,
  "Contient des furocoumarines : le contact avec la sève suivi d'une exposition au "
  "soleil provoque des brûlures. Manipuler avec des gants.")],

"Foeniculum vulgare": [_("irr", 1,
  "Sève légèrement phototoxique : éviter le contact prolongé par temps ensoleillé.")],
"Levistichum officinalis": [_("irr", 1,
  "Sève légèrement phototoxique : porter des gants pour une récolte importante.")],

"Anemone hupehensis": [_("irr", 1,
  "La sève peut provoquer une irritation cutanée légère : gants conseillés à la taille.")],

"Alstroemeria": [_("irr", 1,
  "Contact répété avec la sève pouvant provoquer une dermatite, surtout à la coupe.")],

"Acanthus mollis": [_("epi", 1,
  "Bractées florales à pointes piquantes : gants conseillés pour la taille.")],

# --------------------------------------------------------------- épineux
"Crataegus monogyna": [_("epi", 1,
  "Épines acérées. Excellent en haie défensive, à écarter des passages."),
  _("env", 2,
  "Plantation restreinte ou interdite dans certaines zones au titre de la lutte contre "
  "le feu bactérien. Vérifier auprès de la mairie ou de la DRAAF avant tout chantier.")],

"Prunus spinosa": [_("epi", 2,
  "Épines très acérées et longues, susceptibles de provoquer des blessures profondes. "
  "À réserver aux haies champêtres éloignées des passages.")],

"Berberis thunbergii": [_("epi", 2,
  "Épines fines et très acérées sur toute la longueur des rameaux. À proscrire le long "
  "d'un passage ou d'une aire de jeu."),
  _("env", 1, "Classé envahissant dans certaines régions : se ressème par les oiseaux.")],

"Yucca filamentosa": [_("epi", 2,
  "Feuilles terminées par une pointe rigide et acérée, à hauteur d'yeux pour un enfant. "
  "À écarter des passages et des aires de jeu.")],
"Yucca rostrata": [_("epi", 2,
  "Feuilles à pointe très acérée. À écarter des passages et des aires de jeu.")],

"Rosa": [_("epi", 1, "Aiguillons sur les rameaux : prévoir un recul des passages.")],
"Rosa rugosa": [_("epi", 2,
  "Rameaux extrêmement épineux sur toute leur longueur. Excellent en haie défensive."),
  _("env", 2,
  "Classé envahissant sur le littoral atlantique, où il colonise les dunes. À éviter "
  "en bordure d'espace naturel.")],

"Rubus idaeus": [_("epi", 1, "Rameaux épineux, sauf variétés sélectionnées sans épines.")],
"Rubus fructicosus": [_("epi", 1,
  "Rameaux épineux, sauf variétés sans épines qu'il est préférable de choisir.")],
"Ribes uva-crispa": [_("epi", 1, "Rameaux épineux gênant la récolte.")],

"Juniperus communis": [_("epi", 1, "Feuillage piquant : à écarter des passages.")],
"Juniperus chin": [_("epi", 1, "Feuillage piquant chez certains cultivars.")],
"Grevillea juniperina": [_("epi", 1, "Feuillage fin et piquant : à écarter des passages.")],
"Chaenomeles superba": [_("epi", 1, "Rameaux épineux : à écarter des passages.")],
"Echinops ritro": [_("epi", 1, "Feuillage épineux : gants conseillés à la taille.")],
"Eryngium planum": [_("epi", 1, "Bractées piquantes : gants conseillés à la taille.")],
"Elaeagnus ebbingei": [_("epi", 1, "Rameaux parfois épineux chez certains sujets.")],
"Ilex crenata": [_("tox", 1, "Baies noires toxiques par ingestion.")],

# --------------------------------------------------------- pollens
"Betula verrucosa": [_("pol", 2,
  "Pollen parmi les plus allergisants de la flore française, avec un pic en mars et "
  "avril. À déconseiller si un membre du foyer est allergique, et à éloigner des "
  "fenêtres et terrasses."),
  _("rac", 1, "Racines superficielles et traçantes : éloigner des dallages et réseaux.")],

"Corylus avellana": [_("pol", 2,
  "Pollen très allergisant, libéré très tôt, dès janvier. À déconseiller aux foyers "
  "sensibles.")],

"Alnus glutinosa": [_("pol", 2,
  "Pollen très allergisant émis dès février. À éloigner des zones de séjour.")],

"Platanus acerifolia": [_("pol", 2,
  "Pollen fortement allergisant au printemps. Les poils des fruits sont par ailleurs "
  "irritants pour les voies respiratoires en fin d'hiver."),
  _("rac", 2,
  "Racines très puissantes soulevant dallages et trottoirs : prévoir un large recul "
  "des constructions et des réseaux.")],

"Cupressus sempervirens": [_("pol", 2,
  "Pollen fortement allergisant de janvier à mars, responsable de la « rhinite des "
  "cyprès ». À déconseiller en haie près d'une habitation si le foyer est sensible.")],

"Cupressocyparis leylandii": [_("pol", 2,
  "Pollen allergisant en fin d'hiver. Une haie de plusieurs dizaines de mètres émet "
  "des quantités importantes à proximité immédiate de l'habitation.")],

"Carpinus betulus": [_("pol", 1, "Pollen modérément allergisant au printemps.")],
"Fagus sylvatica": [_("pol", 1, "Pollen modérément allergisant au printemps.")],
"Thuya plicata": [_("pol", 1, "Pollen allergisant en fin d'hiver.")],
"Chamaecyparis obtusa": [_("pol", 1, "Pollen allergisant en fin d'hiver.")],
"Cryptomeria japonica": [_("pol", 1, "Pollen allergisant en fin d'hiver.")],
"Artemisia absinthium": [_("pol", 1,
  "Pollen d'armoise allergisant en fin d'été, et feuillage pouvant irriter au contact.")],
"Phragmites australis": [_("pol", 1, "Pollen de graminée allergisant en été."),
  _("env", 2,
  "Extrêmement traçante, pratiquement impossible à éradiquer une fois installée. "
  "À réserver aux bassins de lagunage et aux berges où l'expansion est voulue.")],

# ------------------------------------------------- envahissantes
"Buddleia davidii": [_("env", 2,
  "Classé envahissant dans plusieurs régions : un pied produit des millions de graines "
  "qui colonisent friches et berges. Privilégier les cultivars stériles et supprimer "
  "les fleurs fanées.")],

"Acer negundo": [_("env", 2,
  "Classé envahissant, notamment en bord de cours d'eau où il se ressème massivement. "
  "Préférer les cultivars horticoles panachés, moins prolifiques.")],

"Solidago canadensis": [_("env", 2,
  "L'espèce type est classée envahissante et colonise rapidement par rhizomes et par "
  "semis. Choisir impérativement un cultivar horticole compact et stérile.")],

"Houttuynia cordata": [_("env", 2,
  "Extrêmement traçante en sol humide et pratiquement impossible à éradiquer : le "
  "moindre fragment de rhizome repart. À planter uniquement en bac ou en panier.")],

"Equisetum hyemale": [_("env", 2,
  "Traçante et pratiquement impossible à éradiquer en pleine terre. À planter "
  "systématiquement en bac ou en panier de bassin.")],

"Polygonum aubertii": [_("env", 2,
  "Croissance de plusieurs mètres par an, incontrôlable sans taille sévère annuelle. "
  "Elle étouffe toute végétation qu'elle atteint. À réserver aux supports isolés.")],

"Mentha spicata": [_("env", 1,
  "Traçante par rhizomes : en pleine terre elle envahit le massif en deux saisons. "
  "À planter en pot enterré ou en bac.")],

"Clerodendron bungei": [_("env", 1,
  "Drageonne fortement et peut coloniser un massif entier. À isoler ou à contenir.")],

"Muehlenbeckia complexa": [_("env", 1,
  "Vigoureuse et enchevêtrée : taille régulière nécessaire pour la contenir.")],

"Ulmus campestris": [_("env", 1,
  "Décimé par la graphiose : les sujets meurent généralement avant vingt ans. "
  "N'utiliser que des variétés résistantes sélectionnées, ou une conduite en haie basse.")],

# ------------------------------------------------ racines
"Salix babylonica": [_("rac", 2,
  "Racines très traçantes et avides d'eau, qui s'infiltrent dans les canalisations et "
  "fissurent les dallages. Prévoir au minimum 15 m de recul des réseaux et fosses.")],

"Populus tremula": [_("rac", 2,
  "Drageonne fortement et colonise la parcelle. Racines à éloigner des réseaux et des "
  "zones cultivées."),
  _("pol", 1, "Pollen modérément allergisant en fin d'hiver.")],

"Salix purpurea": [_("rac", 1, "Racines avides d'eau : éloigner des canalisations.")],
"Salix caprea": [_("rac", 1, "Racines avides d'eau : éloigner des canalisations.")],
"Acer sac": [_("rac", 1,
  "Racines puissantes et bois cassant : éloigner des constructions et des passages.")],
"Acer platanoides": [_("rac", 1,
  "Racines superficielles compliquant les plantations au pied et soulevant les dallages.")],
"Prunus avium": [_("rac", 1,
  "Système racinaire traçant : prévoir un recul des constructions et des réseaux.")],
"Paulownia": [_("rac", 1,
  "Croissance très rapide et bois cassant : éloigner des constructions.")],
"Catalpa bignoides": [_("rac", 1, "Bois cassant sous le vent : éloigner des passages.")],
"Albizzia julibrissin": [_("rac", 1, "Bois cassant sous le vent fort.")],
"Liriodendron tulipifera": [_("rac", 1, "Grand développement : prévoir un large recul.")],
"Tilia platyphyllos": [_("rac", 1,
  "Le miellat des pucerons poisse durablement les véhicules stationnés dessous.")],
"Tilia cordata": [_("rac", 1,
  "Le miellat des pucerons peut poisser les véhicules stationnés dessous.")],
"Ginkgo biloba": [_("tox", 1,
  "Les fruits des sujets femelles dégagent une odeur nauséabonde en se décomposant. "
  "Exiger un sujet mâle à la commande.")],
"Castanea sativa": [_("epi", 1, "Bogues très piquantes au sol à l'automne.")],
"Cydonia oblanga": [_("tox", 1, "Fruits immangeables crus, comestibles cuits.")],
"Malus coccinela": [],
"Cardamine pratensis": [],
}

# On retire les entrees vides
RISQUES = {k: v for k, v in RISQUES.items() if v}
