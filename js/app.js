/* ============================================================
   IDENTITÉ — le seul bloc à modifier pour personnaliser
   ============================================================ */
const MARQUE = {
  nom:      'Loire Aménagement',
  baseline: 'Vivez vos extérieurs !',
  gerant:   'Benoît Courtemanche',
  fonction: 'Gérant',
  coord: [
    'Ancenis, Loire-Atlantique',
    '06 99 86 18 56 · 02 40 96 16 13',
    'contact@loire-amenagement.com',
    'www.loire-amenagement.com'
  ],
  // Logo affiché sur les documents. Laisser null pour un rendu typographique.
  logo: 'assets/logo.png',
  logoHauteur: 62,
  // Couleurs relevées dans le logo
  couleur: '#0C5AA2',       // bleu Loire — titres, filets, en-têtes
  accent:  '#7BBB43',       // vert prairie — mises en valeur
  accent2: '#3BACD4',       // bleu clair — baseline
  // Mentions légales du pied de page. Laisser vide pour masquer.
  legal: 'Loire Aménagement · SIRET 819 008 608 00013'
};
const CLIENT = { nom: '', adresse: '', ville: '', projet: '' };

const RISQ = {
  tox:{lib:'Toxique par ingestion',    ic:'☠'},
  irr:{lib:'Irritant au contact',      ic:'✋'},
  epi:{lib:'Épineux',                  ic:'✷'},
  pol:{lib:'Pollen allergisant',       ic:'❋'},
  env:{lib:'Envahissante ou réglementée', ic:'⇗'},
  rac:{lib:'Racines envahissantes',    ic:'⌇'}
};
const forte = p => p.rq.some(r=>r.n===2);

const MOIS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const MOIS_LONG = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

const COULEURS = {
  'Blanc':'#ffffff','Crème':'#F2E9CE','Blanc rosé':'#F7E4E4','Blanc crème':'#F4EDD8',
  'Rose':'#E48AAE','Rose vif':'#DD5C8E','Rouge':'#C0392B','Corail':'#E1725C',
  'Orange':'#E08B2C','Jaune':'#E8C14A','Mauve':'#A98BC4','Violet':'#7B5EA7',
  'Bleu':'#5C7FC0','Bleu lavande':'#8095CE','Bleu violacé':'#6E74BC','Bleu pâle':'#9DB4D8',
  'Vert':'#7FA05A','Vert chartreuse':'#B5C24E','Beige':'#D9CBA8','Beige doré':'#D8BE7C',
  'Beige argenté':'#DCD6C4','Beige rosé':'#DEC5BE','Bicolore':'linear-gradient(90deg,#E48AAE 50%,#fff 50%)'
};
function pastilleCouleur(t){
  const c = COULEURS[t.trim()];
  if(!c) return '#C9C4B4';
  return c;
}

/* ---------- favoris ---------- */
let COLLECTIONS = [
  {id:1, nom:'Haie persistante', items:['Prunus laurocerasus','Viburnum tinus','Pyracantha']},
  {id:2, nom:'Massif sec plein soleil', items:['Lavandula angustifolia','Perovskia atriplicifolia','Gaura lindheimeri','Salvia nemorosa','Euphorbia characias']},
  {id:3, nom:'Couvre-sol ombre', items:['Vinca','Hedera','Ajuga reptans','Carex morrowii']},
  {id:4, nom:'Bord de mer', items:['Hydrangea macrophylla','Rosmarinus officinalis','Cotoneaster','Achillea millefolium']}
];
let idColl = 5;
const estFavori = lat => COLLECTIONS.some(c=>c.items.includes(lat));
const nbFavoris = () => new Set(COLLECTIONS.flatMap(c=>c.items)).size;
function majCompteurFav(){
  document.getElementById('cptf').textContent = nbFavoris();
  document.querySelectorAll('.star').forEach(b=>
    b.classList.toggle('on', estFavori(b.dataset.lat)));
}

/* ---------- filtres ---------- */
const F = {
  q:'', type:new Set(), expo:new Set(), sol:new Set(), hum:new Set(),
  feu:new Set(), ent:new Set(), plant:new Set(), mois:new Set(), bdm:new Set(),
  sansRq:new Set(),
  rust:0, hmax:20
};

const OPTIONS = {
  type:['Arbre','Arbuste','Conifère','Couvre-sol','Vivace','Graminée','Grimpante','Fruitier','Aromatique'],
  expo:['Plein soleil','Mi-ombre','Ombre'],
  sol:['Drainé','Frais','Sec','Calcaire toléré','Acide','Argileux toléré','Pauvre toléré','Humifère','Profond'],
  hum:['Sec','Frais','Humide'],
  feu:['Persistant','Semi-persistant','Caduc'],
  ent:['Faible','Moyen','Soutenu'],
  plant:['Automne','Printemps'],
  bdm:['Front de mer','Second rideau']
};

function bâtirFiltres(){
  const el = document.getElementById('filtres');
  const g = (label, cle, opts, cls='') => `
    <div class="fgroup">
      <span class="flabel">${label}</span>
      <div class="chips" data-cle="${cle}">
        ${opts.map(o=>`<button class="chip ${cls}" data-v="${o}">${o}</button>`).join('')}
      </div>
    </div>`;
  el.innerHTML = `
    <div class="fgroup">
      <input type="search" id="q" placeholder="Nom latin ou français…" autocomplete="off">
    </div>
    ${g('Type de végétal','type',OPTIONS.type)}
    ${g('Exposition','expo',OPTIONS.expo)}
    ${g('Nature de sol','sol',OPTIONS.sol)}
    ${g('Humidité du sol','hum',OPTIONS.hum)}
    <div class="fgroup">
      <span class="flabel">Rusticité minimale</span>
      <input type="range" id="rust" min="-30" max="-8" step="1" value="0">
      <div class="rangeval"><span>Doit tenir jusqu'à</span><b id="rustv">indifférent</b></div>
    </div>
    <div class="fgroup">
      <span class="flabel">Hauteur adulte maximale</span>
      <input type="range" id="hmax" min="0.2" max="20" step="0.1" value="20">
      <div class="rangeval"><span>Pas plus de</span><b id="hmaxv">indifférent</b></div>
    </div>
    ${g('Exposition au littoral','bdm',OPTIONS.bdm)}
    ${g('Feuillage','feu',OPTIONS.feu)}
    <div class="fgroup">
      <span class="flabel">En fleurs en…</span>
      <div class="chips" data-cle="mois">
        ${MOIS.map((m,i)=>`<button class="chip mois" data-v="${i+1}">${m}</button>`).join('')}
      </div>
    </div>
    ${g('Se plante en','plant',OPTIONS.plant)}
    ${g("Niveau d'entretien",'ent',OPTIONS.ent)}
    <div class="fgroup">
      <span class="flabel">Écarter les espèces…</span>
      <div class="chips" data-cle="sansRq">
        ${['tox','epi','irr','pol','env','rac'].map(k=>
          `<button class="chip rq" data-v="${k}">${RISQ[k].ic} ${RISQ[k].lib.split(' ')[0].toLowerCase()}</button>`).join('')}
      </div>
    </div>
    <button id="reset">Effacer les filtres</button>`;

  el.addEventListener('click', e=>{
    const b = e.target.closest('.chip'); if(!b) return;
    const cle = b.parentElement.dataset.cle;
    const v = cle==='mois' ? +b.dataset.v : b.dataset.v;
    F[cle].has(v) ? F[cle].delete(v) : F[cle].add(v);
    b.classList.toggle('on');
    rendre();
  });
  document.getElementById('q').addEventListener('input', e=>{F.q=e.target.value.toLowerCase();rendre();});
  const rust = document.getElementById('rust');
  rust.value = -8; rust.addEventListener('input', e=>{
    F.rust = +e.target.value;
    document.getElementById('rustv').textContent = F.rust<=-8 && F.rust>-9 ? 'indifférent' : F.rust+' °C';
    if(F.rust===-8){F.rust=0;document.getElementById('rustv').textContent='indifférent';}
    rendre();
  });
  const hm = document.getElementById('hmax');
  hm.addEventListener('input', e=>{
    F.hmax = +e.target.value;
    document.getElementById('hmaxv').textContent = F.hmax>=20 ? 'indifférent' : F.hmax.toFixed(1).replace('.',',')+' m';
    rendre();
  });
  document.getElementById('reset').addEventListener('click', ()=>{
    F.q=''; ['type','expo','sol','hum','feu','ent','plant','mois','bdm','sansRq'].forEach(k=>F[k].clear());
    F.rust=0; F.hmax=20;
    el.querySelectorAll('.chip.on').forEach(c=>c.classList.remove('on'));
    document.getElementById('q').value='';
    rust.value=-8; hm.value=20;
    document.getElementById('rustv').textContent='indifférent';
    document.getElementById('hmaxv').textContent='indifférent';
    rendre();
  });
}

/* ---------- logique de floraison ---------- */
function moisFloraison(p){
  if(!p.m1 || !p.m2) return [];
  const out=[]; let m=p.m1;
  for(let i=0;i<13;i++){ out.push(m); if(m===p.m2) break; m = m===12 ? 1 : m+1; }
  return out;
}

/* ---------- filtrage ---------- */
function correspond(p){
  if(F.q){
    const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(!norm(p.lat+' '+p.fr).includes(norm(F.q))) return false;
  }
  const sansAcc = t => t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(F.type.size && ![...F.type].some(v=>sansAcc(p.type).includes(sansAcc(v)))) return false;
  if(F.expo.size && ![...F.expo].some(v=>sansAcc(p.expo).includes(sansAcc(v)))) return false;
  if(F.sol.size && ![...F.sol].some(v=>sansAcc(p.sol).includes(sansAcc(v.split(' ')[0])))) return false;
  if(F.hum.size && ![...F.hum].some(v=>sansAcc(p.hum).includes(sansAcc(v)))) return false;
  if(F.bdm.size){
    const rang = {'Front de mer':2,'Second rideau':1,'Déconseillé en bord de mer':0};
    const exige = Math.max(...[...F.bdm].map(v=>rang[v]));
    if(rang[p.bdm] < exige) return false;
  }
  if(F.feu.size && !F.feu.has(p.feu)) return false;
  if(F.ent.size && !F.ent.has(p.ent)) return false;
  if(F.plant.size && ![...F.plant].some(v=>p.plant.includes(v))) return false;
  if(F.mois.size){
    const mf = moisFloraison(p);
    if(![...F.mois].every(m=>mf.includes(m))) return false;
  }
  if(F.sansRq.size && p.rq.some(r=>F.sansRq.has(r.c))) return false;
  if(F.rust && p.rust > F.rust) return false;
  if(F.hmax<20 && p.h > F.hmax) return false;
  return true;
}

/* ---------- rendu liste ---------- */
function frise(p, cls=''){
  const mf = moisFloraison(p);
  if(!mf.length) return '';
  return `<div class="frise ${cls}">${MOIS.map((_,i)=>`<i class="${mf.includes(i+1)?'on':''}"></i>`).join('')}</div>`;
}

function rendre(){
  const res = DATA.filter(correspond);
  document.getElementById('nb').textContent = res.length;
  document.getElementById('nbt').textContent =
    res.length>1 ? 'espèces correspondent' : (res.length===1?'espèce correspond':'');
  const g = document.getElementById('grille');
  if(!res.length){
    g.innerHTML = `<div class="vide"><b>Aucune espèce ne coche toutes ces cases.</b>
      Retirez un critère pour élargir la recherche — la rusticité et l'humidité du sol
      sont souvent les plus restrictives.</div>`;
    return;
  }
  g.innerHTML = res.map(p=>`
    <div class="cwrap">
    <button class="carte" data-lat="${p.lat}">
      ${p.ph.length
        ? `<img class="vign" src="${urlPhoto(p)}" alt="" loading="lazy"
             onerror="this.remove()">`
        : `<div class="vign vide3">Pas de photo</div>`}
      <div>
        <div class="nom">${p.fr}</div>
        <div class="lat">${p.lat}</div>
      </div>
      <div class="meta">
        <span>${p.type}</span><span>${fmt(p.h)} × ${fmt(p.l)} m</span>
        <span>${p.rust} °C</span><span>${p.feu}</span>
        ${p.bdm==='Front de mer'?'<span style="color:var(--mousse);font-weight:600">Front de mer</span>':''}
      </div>
      ${p.rq.length ? `<div class="rqline ${forte(p)?'f':''}">
        ${[...new Set(p.rq.map(r=>r.c))].map(c=>
          `<span title="${RISQ[c].lib}">${RISQ[c].ic}</span>`).join('')}
        <b>${forte(p) ? 'Attention' : 'Vigilance'}</b>
      </div>` : ''}
      ${frise(p)}
      <div class="prix">${prixMin(p)} <span>HT · ${p.refs.length} calibre${p.refs.length>1?'s':''}</span></div>
    </button>
    <button class="star ${estFavori(p.lat)?'on':''}" data-lat="${p.lat}" aria-label="Ajouter aux favoris">${estFavori(p.lat)?'★':'☆'}</button>
    </div>`).join('');
}
const fmt = n => String(n).replace('.',',');
const clePhoto = lat => lat.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const urlPhoto = (p, i=1) => `assets/photos/${clePhoto(p.lat)}-${i}.jpg`;
const dens = d => d>=1 ? fmt(d)+' sujets/m²' : fmt(Math.round(10/d)/10)+' m² par sujet';
const eur = n => n.toFixed(2).replace('.',',')+' €';
const prixMin = p => eur(Math.min(...p.refs.map(r=>r.px)));

document.getElementById('grille').addEventListener('click', e=>{
  const st = e.target.closest('.star');
  if(st){ ouvrirPop(st, st.dataset.lat); return; }
  const c = e.target.closest('.carte'); if(!c) return;
  ouvrirFiche(DATA.find(p=>p.lat===c.dataset.lat));
});

/* ---------- popover de classement ---------- */
function ouvrirPop(anchor, lat){
  const pop = document.getElementById('pop');
  pop.innerHTML = `<div class="ptit">Classer dans…</div>` +
    COLLECTIONS.map(c=>`<button data-c="${c.id}">
      <span class="tick">${c.items.includes(lat)?'✓':''}</span>${c.nom}</button>`).join('') +
    `<button class="neuf" data-c="new">+ Nouvelle collection</button>`;
  const r = anchor.getBoundingClientRect();
  pop.style.visibility='hidden'; pop.classList.add('on');
  const h = pop.offsetHeight, w = pop.offsetWidth;
  pop.style.top  = Math.min(r.bottom+6, innerHeight-h-10)+'px';
  pop.style.left = Math.max(10, Math.min(r.right-w, innerWidth-w-10))+'px';
  pop.style.visibility='visible';
  pop.onclick = e=>{
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.c==='new'){
      const nom = prompt('Nom de la collection', 'Nouvelle collection');
      if(nom && nom.trim()){
        COLLECTIONS.push({id:idColl++, nom:nom.trim(), items:[lat]});
      }
    } else {
      const c = COLLECTIONS.find(x=>x.id === +b.dataset.c);
      const i = c.items.indexOf(lat);
      i>=0 ? c.items.splice(i,1) : c.items.push(lat);
    }
    fermerPop(); majCompteurFav(); rendre();
    if(document.getElementById('favoris').classList.contains('on')) ouvrirFavoris();
  };
}
function fermerPop(){ document.getElementById('pop').classList.remove('on'); }
document.addEventListener('click', e=>{
  if(!e.target.closest('#pop') && !e.target.closest('.star')) fermerPop();
}, true);

/* ---------- panneau favoris ---------- */
function ouvrirFavoris(){
  const el = document.getElementById('favoris');
  const corps = COLLECTIONS.length ? COLLECTIONS.map(c=>`
    <div class="coll" data-c="${c.id}">
      <div class="chead">
        <h4>${c.nom}</h4>
        <span class="n">${c.items.length}</span>
        ${c.items.length?`<button class="all" data-a="all">Tout ajouter</button>`:''}
      </div>
      ${c.items.length ? c.items.map(lat=>{
        const p = DATA.find(x=>x.lat===lat); if(!p) return '';
        return `<div class="fitem" data-lat="${lat}">
          <div class="txt2">
            <div class="n1">${p.fr}</div>
            <div class="n2"><span class="lat">${p.lat}</span> · ${p.type} · ${prixMin(p)} HT</div>
          </div>
          <button class="mini" data-a="add">Ajouter</button>
          <button class="x" data-a="del" aria-label="Retirer">✕</button>
        </div>`;
      }).join('') : `<p class="txt gris" style="font-size:13px;margin:0">
        Collection vide. Touchez l'étoile d'une plante pour l'y classer.</p>`}
    </div>`).join('') : '';

  el.innerHTML = `
    <div class="phead">
      <h2>Mes favoris</h2>
      <span class="spacer"></span>
      <button class="fclose" style="position:static" aria-label="Fermer">✕</button>
    </div>
    <div class="plist">
      ${corps}
      <button class="newcoll">+ Créer une collection</button>
    </div>`;

  el.querySelector('.fclose').onclick = fermerFavoris;
  el.querySelector('.newcoll').onclick = ()=>{
    const nom = prompt('Nom de la collection', '');
    if(nom && nom.trim()){ COLLECTIONS.push({id:idColl++, nom:nom.trim(), items:[]}); ouvrirFavoris(); }
  };
  el.querySelector('.plist').addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b || !b.dataset.a) return;
    const coll = COLLECTIONS.find(x=>x.id === +b.closest('.coll').dataset.c);
    if(b.dataset.a==='all'){
      coll.items.forEach(lat=>{
        const p = DATA.find(x=>x.lat===lat);
        if(p) ajouter(p, p.refs[0], 1);
      });
      b.textContent = 'Ajouté'; setTimeout(()=>{b.textContent='Tout ajouter';},1100);
      return;
    }
    const lat = b.closest('.fitem').dataset.lat;
    const p = DATA.find(x=>x.lat===lat);
    if(b.dataset.a==='add'){
      ajouter(p, p.refs[0], 1);
      b.textContent='Ajouté'; b.style.background='var(--mousse)'; b.style.color='#12200A';
      setTimeout(()=>{b.textContent='Ajouter';b.style.background='';b.style.color='';},1100);
    } else {
      coll.items = coll.items.filter(x=>x!==lat);
      majCompteurFav(); rendre(); ouvrirFavoris();
    }
  });

  el.classList.add('on'); el.setAttribute('aria-hidden','false');
  document.getElementById('voile').classList.add('on');
}
function fermerFavoris(){
  document.getElementById('favoris').classList.remove('on');
  document.getElementById('voile').classList.remove('on');
}
document.getElementById('btn-favoris').onclick = ouvrirFavoris;

/* ---------- fiche ---------- */
function ouvrirFiche(p){
  const f = document.getElementById('fiche');
  const mf = moisFloraison(p);
  const couleurs = p.cflo==='—' ? [] : p.cflo.split(',').map(s=>s.trim());
  f.innerHTML = `
    ${p.ph.length ? `<div class="galerie">
      <img id="g-grande" src="${urlPhoto(p, p.ph[0])}" alt="${p.fr}">
      ${p.ph.length > 1 ? `<div class="g-mini">
        ${p.ph.map((n,i)=>`<img class="${i?'':'on'}" data-n="${n}"
            src="${urlPhoto(p,n)}" alt="">`).join('')}
      </div>` : ''}
    </div>` : ''}
    <div class="fhead">
      <div class="fr">${p.fr}</div>
      <div class="lat">${p.lat}</div>
      <button class="fclose" aria-label="Fermer">✕</button>
      <button class="star" data-lat="${p.lat}" style="position:absolute;top:16px;right:58px"
        aria-label="Ajouter aux favoris">${estFavori(p.lat)?'★':'☆'}</button>
    </div>
    <div class="fbody">
      <div class="fsec">
        <h3>Conditions de culture</h3>
        <dl class="paires">
          <div class="paire"><dt>Type</dt><dd>${p.type}</dd></div>
          <div class="paire"><dt>Taille adulte</dt><dd>${fmt(p.h)} × ${fmt(p.l)} m</dd></div>
          <div class="paire"><dt>Exposition</dt><dd>${p.expo}</dd></div>
          <div class="paire"><dt>Rusticité</dt><dd>${p.rust} °C</dd></div>
          <div class="paire"><dt>Nature de sol</dt><dd>${p.sol}</dd></div>
          <div class="paire"><dt>Humidité</dt><dd>${p.hum}</dd></div>
          <div class="paire"><dt>Feuillage</dt><dd>${p.feu}</dd></div>
          <div class="paire"><dt>Couleur du feuillage</dt><dd>${p.cfeu}</dd></div>
          <div class="paire"><dt>Bord de mer</dt><dd>${p.bdm}</dd></div>
          <div class="paire"><dt>Densité</dt><dd>${dens(p.dens)} · ${fmt(p.esp)} m entre sujets</dd></div>
        </dl>
      </div>

      ${mf.length ? `<div class="fsec">
        <h3>Floraison — ${p.flo.toLowerCase()}</h3>
        ${frise(p)}
        <div class="frise-lab">${MOIS.map(m=>`<span>${m}</span>`).join('')}</div>
        <div class="pastilles" style="margin-top:11px">
          ${couleurs.map(c=>`<span class="past"><i style="background:${pastilleCouleur(c)}"></i>${c}</span>`).join('')}
        </div>
      </div>` : ''}

      <div class="fsec">
        <h3>Plantation</h3>
        <dl class="paires">
          <div class="paire"><dt>Période possible</dt><dd>${p.plant}</dd></div>
          <div class="paire"><dt>Période optimale</dt><dd>${p.popt}</dd></div>
        </dl>
      </div>

      <div class="fsec">
        <h3>Style et associations</h3>
        <p class="txt" style="margin:0 0 8px">${p.style}.</p>
        <p class="txt gris" style="margin:0">S'associe avec ${p.asso.toLowerCase()}.</p>
      </div>

      ${p.rq.length ? `<div class="fsec">
        <h3>Précautions</h3>
        ${p.rq.map(r=>`<div class="rqbloc n${r.n}">
          <div class="rqt"><span class="ic">${RISQ[r.c].ic}</span>${RISQ[r.c].lib}
            <em>${r.n===2?'attention forte':'vigilance'}</em></div>
          <p>${r.t}</p>
        </div>`).join('')}
      </div>` : ''}

      <div class="fsec">
        <h3>Entretien — niveau ${p.ent.toLowerCase()}</h3>
        <div class="alerte">${p.cons}</div>
      </div>

      <div class="fsec">
        <h3>Calibres disponibles chez AD.V</h3>
        <div class="calc">
          <div class="calc-row">
            <label>Surface à planter<input type="number" id="surf" min="0" step="0.5" placeholder="m²"></label>
            <span class="ou">ou</span>
            <label>Longueur de haie<input type="number" id="long" min="0" step="0.5" placeholder="m"></label>
          </div>
          <div class="calc-out" id="calcout">Quantité par défaut : 1 sujet.</div>
        </div>
        <table class="cal">
          <thead><tr><th>Variété</th><th>Conteneur</th><th>Taille</th><th>Prix HT</th><th></th></tr></thead>
          <tbody>
            ${p.refs.map((r,i)=>`<tr>
              <td>${r.cv || '<span style="color:var(--encre-2)">type</span>'}</td>
              <td>${r.ct}</td><td>${r.tl||'—'}</td>
              <td class="px">${eur(r.px)}</td>
              <td style="text-align:right"><button class="add" data-i="${i}">Ajouter</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
        <p class="txt gris" style="font-size:12.5px;margin:10px 0 0">
          Prix du premier palier de quantité. Des tarifs dégressifs s'appliquent à partir de 100 puis 500 sujets.
        </p>
      </div>
    </div>`;

  let QTE = 1;
  const surf = f.querySelector('#surf'), lng = f.querySelector('#long'), out = f.querySelector('#calcout');
  function recalc(src){
    if(src==='s') lng.value=''; else if(src==='l') surf.value='';
    const s = parseFloat(surf.value), l = parseFloat(lng.value);
    if(s>0){
      QTE = Math.max(1, Math.ceil(s * p.dens));
      out.innerHTML = `<b>${QTE} sujet${QTE>1?'s':''}</b> pour ${fmt(s)} m², à ${dens(p.dens)}.`;
    } else if(l>0){
      QTE = Math.max(1, Math.round(l / p.esp) + 1);
      out.innerHTML = `<b>${QTE} sujet${QTE>1?'s':''}</b> pour ${fmt(l)} m linéaires, espacés de ${fmt(p.esp)} m.`;
    } else {
      QTE = 1; out.textContent = 'Quantité par défaut : 1 sujet.';
    }
  }
  surf.addEventListener('input',()=>recalc('s'));
  lng.addEventListener('input',()=>recalc('l'));

  const mini = f.querySelector('.g-mini');
  if(mini) mini.onclick = e=>{
    const im = e.target.closest('img'); if(!im) return;
    f.querySelector('#g-grande').src = urlPhoto(p, +im.dataset.n);
    mini.querySelectorAll('img').forEach(x=>x.classList.toggle('on', x===im));
  };

  f.querySelector('.fclose').onclick = fermerFiche;
  const st = f.querySelector('.star');
  st.classList.toggle('on', estFavori(p.lat));
  st.onclick = ()=> ouvrirPop(st, p.lat);
  f.querySelectorAll('.add').forEach(b=>{
    b.onclick = ()=>{
      ajouter(p, p.refs[+b.dataset.i], QTE);
      b.textContent = QTE>1 ? `${QTE} ajoutés` : 'Ajouté'; b.classList.add('ok');
      setTimeout(()=>{b.textContent='Ajouter';b.classList.remove('ok');},1100);
    };
  });
  f.classList.add('on'); f.setAttribute('aria-hidden','false');
  document.getElementById('voile').classList.add('on');
  f.scrollTop = 0;
}
function fermerFiche(){
  document.getElementById('fiche').classList.remove('on');
  document.getElementById('voile').classList.remove('on');
}

/* ---------- panier ---------- */
let PANIER = [];
function cle(p,r){return p.lat+'|'+r.cv+'|'+r.ct+'|'+r.tl}
function ajouter(p,r,q=1){
  const k = cle(p,r);
  const ex = PANIER.find(x=>x.k===k);
  if(ex) ex.q += q;
  else PANIER.push({k, lat:p.lat, fr:p.fr, m1:p.m1, m2:p.m2, cv:r.cv, ct:r.ct,
                    tl:r.tl, px:r.px, q, dens:p.dens});
  majCompteur();
}
function majCompteur(){
  const n = PANIER.reduce((s,x)=>s+x.q,0);
  document.getElementById('cpt').textContent = n;
}
function totalHT(){return PANIER.reduce((s,x)=>s+x.px*x.q,0)}

function ouvrirPanier(){
  const el = document.getElementById('panier');
  const items = PANIER.length ? PANIER.map(x=>`
    <div class="pitem" data-k="${x.k}">
      ${(DATA.find(d=>d.lat===x.lat)||{ph:[]}).ph.length
        ? `<img class="pvign" src="assets/photos/${clePhoto(x.lat)}-1.jpg" alt="" loading="lazy" onerror="this.remove()">`
        : ''}
      <div class="info">
        <div class="nom">${x.fr}</div>
        <div class="det"><span class="lat">${x.lat}</span>${x.cv?' '+x.cv:''} · ${x.ct}${x.tl?' · '+x.tl:''}</div>
        <div class="qty">
          <button data-a="-">−</button>
          <input type="number" min="1" value="${x.q}" data-a="set">
          <button data-a="+">+</button>
        </div>
        <div class="det" style="margin-top:5px">≈ ${fmt(Math.round(x.q/x.dens*10)/10)} m² couverts</div>
        <div class="sup" data-a="sup">Retirer</div>
      </div>
      <div class="tot">${eur(x.px*x.q)}<br><span style="font-weight:400;font-size:11.5px;color:var(--encre-2)">${eur(x.px)} l'unité</span></div>
    </div>`).join('') : `<div class="vide"><b>La sélection est vide.</b>
      Ouvrez une fiche et ajoutez un calibre pour composer la proposition du client.</div>`;

  /* calendrier agrege */
  const counts = new Array(12).fill(0);
  PANIER.forEach(x=>{
    if(!x.m1||!x.m2) return;
    let m=x.m1;
    for(let i=0;i<13;i++){counts[m-1]++; if(m===x.m2)break; m = m===12?1:m+1;}
  });
  const max = Math.max(1,...counts);
  const trous = counts.map((c,i)=>c===0?MOIS_LONG[i]:null).filter(Boolean);

  el.innerHTML = `
    <div class="phead">
      <h2>Sélection pour le client</h2>
      <span class="spacer"></span>
      <button class="fclose" style="position:static" aria-label="Fermer">✕</button>
    </div>
    <div class="plist">${items}</div>
    <div class="pfoot">
      ${PANIER.length?`
      <div class="calmassif">
        <span class="flabel">Échelonnement des floraisons</span>
        <div class="calbar">
          ${counts.map(c=>`<i ${c?`data-n="${c}"`:''} style="height:${c?4+(c/max)*18:4}px" title="${c} espèce(s)"></i>`).join('')}
        </div>
        <div class="frise-lab">${MOIS.map(m=>`<span>${m}</span>`).join('')}</div>
        ${trous.length && trous.length<12 ? `<p class="trou">Aucune floraison prévue en ${trous.join(', ')}. Un arbuste à floraison hivernale ou une graminée à épis persistants comblerait ce creux.</p>`:''}
      </div>`:''}
      <div class="ligne-tot"><span>${PANIER.reduce((s,x)=>s+x.q,0)} sujets · ${PANIER.length} référence${PANIER.length>1?'s':''}</span><span>≈ ${fmt(Math.round(PANIER.reduce((s,x)=>s+x.q/x.dens,0)))} m² plantés</span></div>
      <div class="ligne-tot grand"><span>Total HT</span><span>${eur(totalHT())}</span></div>
      <button class="envoyer">Générer la proposition</button>
    </div>`;

  el.querySelector('.fclose').onclick = fermerPanier;
  el.querySelector('.envoyer').onclick = ()=>{
    if(!PANIER.length){ alert("Ajoutez au moins une plante avant de générer la proposition."); return; }
    fermerPanier(); ouvrirDocument();
  };
  el.querySelector('.plist').addEventListener('click', e=>{
    const it = e.target.closest('.pitem'); if(!it) return;
    const a = e.target.dataset.a; if(!a) return;
    const x = PANIER.find(z=>z.k===it.dataset.k);
    if(a==='+') x.q++;
    else if(a==='-') x.q = Math.max(1,x.q-1);
    else if(a==='sup') PANIER = PANIER.filter(z=>z.k!==x.k);
    majCompteur(); ouvrirPanier();
  });
  el.querySelector('.plist').addEventListener('change', e=>{
    if(e.target.dataset.a!=='set') return;
    const it = e.target.closest('.pitem');
    const x = PANIER.find(z=>z.k===it.dataset.k);
    x.q = Math.max(1, parseInt(e.target.value)||1);
    majCompteur(); ouvrirPanier();
  });

  el.classList.add('on'); el.setAttribute('aria-hidden','false');
  document.getElementById('voile').classList.add('on');
}
function fermerPanier(){
  document.getElementById('panier').classList.remove('on');
  document.getElementById('voile').classList.remove('on');
}
document.getElementById('btn-panier').onclick = ouvrirPanier;
document.getElementById('voile').onclick = ()=>{fermerFiche();fermerPanier();fermerFavoris();};
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    if(document.getElementById('doc').classList.contains('on')){fermerDocument();return;}
    fermerPop();fermerFiche();fermerPanier();fermerFavoris();
  }
});

function appliquerMarque(){
  const r = document.documentElement.style;
  r.setProperty('--vert', MARQUE.couleur);
  r.setProperty('--mousse', MARQUE.accent);
  const t = document.querySelector('header h1');
  if(t) t.textContent = MARQUE.nom;
  const s = document.querySelector('header .sub');
  if(s) s.textContent = 'Sélection végétale';
}

appliquerMarque();
bâtirFiltres();
rendre();
majCompteurFav();


/* ============ Document de proposition ============ */
const CFG = { coef: 2.2, mode: 'client' };


function dateFr(){
  return new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
}
function refDevis(){
  const d = new Date();
  return 'PV-' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') +
         '-' + String(Math.floor(Math.random()*900)+100);
}
const REF = refDevis();

function ouvrirDocument(){
  const doc = document.getElementById('doc');
  const client = CFG.mode === 'client';
  const pv = x => x.px * CFG.coef;
  const totalAchat = PANIER.reduce((s,x)=>s + x.px*x.q, 0);
  const totalVente = PANIER.reduce((s,x)=>s + pv(x)*x.q, 0);
  const nbSujets = PANIER.reduce((s,x)=>s+x.q,0);
  const surface = PANIER.reduce((s,x)=>s + x.q/x.dens, 0);

  const especes = [];
  PANIER.forEach(x=>{ if(!especes.some(e=>e.lat===x.lat)){
    const p = DATA.find(d=>d.lat===x.lat); if(p) especes.push(p);
  }});

  const counts = new Array(12).fill(0);
  PANIER.forEach(x=>{
    if(!x.m1||!x.m2) return;
    let m=x.m1;
    for(let i=0;i<13;i++){counts[m-1]++; if(m===x.m2)break; m = m===12?1:m+1;}
  });
  const trous = counts.map((c,i)=>c===0?MOIS_LONG[i]:null).filter(Boolean);

  /* ---- tableau des vegetaux ---- */
  const enteteClient = `<tr>
      <th>Espèce</th><th>Conditionnement</th>
      <th class="r">Qté</th><th class="r">Surface</th>
    </tr>`;
  const enteteInterne = `<tr>
      <th>Espèce</th><th>Conditionnement</th><th class="r">Qté</th>
      <th class="r">Achat HT</th><th class="r">Total achat</th><th class="r">Vente HT</th>
    </tr>`;

  const lignes = PANIER.map(x=>{
    const nom = `<td>
        <div class="n1">${x.fr}</div>
        <div class="n2"><span class="lat">${x.lat}</span>${x.cv?' — '+x.cv:''}</div>
      </td>
      <td>${x.ct}${x.tl?'<br><span class="n2">'+x.tl+'</span>':''}</td>
      <td class="r">${x.q}</td>`;
    return client
      ? `<tr>${nom}<td class="r">${fmt(Math.round(x.q/x.dens*10)/10)} m²</td></tr>`
      : `<tr>${nom}
          <td class="r">${eur(x.px)}</td>
          <td class="r">${eur(x.px*x.q)}</td>
          <td class="r"><b>${eur(pv(x)*x.q)}</b></td>
        </tr>`;
  }).join('');

  /* ---- fiches techniques ---- */
  const fiches = especes.map(p=>`
    <div class="fichetec">
      ${p.ph.length ? `<img class="ftphoto" src="${urlPhoto(p, p.ph[0])}" alt="">` : ''}
      <h4>${p.fr}</h4>
      <div class="sl"><span class="lat">${p.lat}</span> · ${p.type}</div>
      <dl class="gr">
        <div><dt>Taille adulte</dt><dd>${fmt(p.h)} × ${fmt(p.l)} m</dd></div>
        <div><dt>Exposition</dt><dd>${p.expo}</dd></div>
        <div><dt>Sol</dt><dd>${p.sol}</dd></div>
        <div><dt>Rusticité</dt><dd>${p.rust} °C</dd></div>
        <div><dt>Feuillage</dt><dd>${p.feu}</dd></div>
        <div><dt>Floraison</dt><dd>${p.flo}</dd></div>
        <div><dt>Couleur</dt><dd>${p.cflo}</dd></div>
        <div><dt>Plantation</dt><dd>${p.popt}</dd></div>
      </dl>
      <p><b>Situation :</b> ${p.style}.</p>
      <p><b>Associations :</b> ${p.asso}.</p>
      <p class="ent"><b>Entretien (${p.ent.toLowerCase()}) :</b> ${p.cons}</p>
      ${p.rq.length ? `<p class="rqdoc"><b>Précautions :</b> ${
        p.rq.map(r=>`${RISQ[r.c].lib.toLowerCase()} — ${r.t}`).join(' ')}</p>` : ''}
    </div>`).join('');

  /* ---- totaux, uniquement en interne ---- */
  const totaux = client ? '' : `
      <div class="totaux">
        <div><span>Coût d'achat des végétaux HT</span><span>${eur(totalAchat)}</span></div>
        <div><span>Valeur de vente (coef. ${fmt(CFG.coef)})</span><span>${eur(totalVente)}</span></div>
        <div><span>Marge brute</span><span>${eur(totalVente - totalAchat)}</span></div>
        <div class="gd"><span>À reporter au devis, poste végétaux HT</span><span>${eur(totalVente)}</span></div>
      </div>`;

  /* ---- reglages, uniquement en interne ---- */
  const saisie = `
    <div style="padding:16px 18px 0">
      <div class="reglages">
        <label style="flex:1.4;min-width:180px">Nom du client
          <input type="text" id="c-nom" value="${CLIENT.nom}" placeholder="M. et Mme Dupont">
        </label>
        <label style="flex:1.6;min-width:200px">Adresse du chantier
          <input type="text" id="c-adr" value="${CLIENT.adresse}" placeholder="12 rue des Jardins">
        </label>
        <label style="flex:1.2;min-width:150px">Code postal et ville
          <input type="text" id="c-vil" value="${CLIENT.ville}" placeholder="44150 Ancenis">
        </label>
        <label style="flex:1.4;min-width:170px">Projet
          <input type="text" id="c-prj" value="${CLIENT.projet}" placeholder="Massif d'entrée">
        </label>
      </div>
    </div>`;

  const reglages = client ? '' : `
    <div style="padding:10px 18px 0">
      <div class="reglages">
        <label>Coefficient de vente
          <input type="number" id="r-coef" min="1" max="6" step="0.05" value="${CFG.coef}">
        </label>
        <div class="info">Les prix du catalogue sont vos prix d'achat. Le coefficient donne
          le montant à reporter au poste végétaux de votre devis global.
          Ce récapitulatif est un document de travail : il ne doit pas être transmis au client.</div>
      </div>
    </div>`;

  const bandeau = client ? '' : `
      <div class="interne">Document interne — ne pas transmettre au client</div>`;

  doc.innerHTML = `
    <div class="docbar">
      <span class="t">${client ? 'Proposition client' : 'Récapitulatif chantier'} · ${REF}</span>
      <div class="modes">
        <button class="${client?'act':''}" data-mode="client">Client</button>
        <button class="${client?'':'act'}" data-mode="interne">Interne</button>
      </div>
      <span class="spacer"></span>
      <button id="d-fermer">Fermer</button>
      ${client?'<button id="d-mail">Préparer l\'email</button>':''}
      <button class="pri" id="d-pdf">Imprimer / Enregistrer en PDF</button>
    </div>

    ${saisie}
    ${reglages}

    <div class="page" style="--m:${MARQUE.couleur};--a:${MARQUE.accent};--a2:${MARQUE.accent2}">
      ${bandeau}
      <div class="dh">
        <div class="ident">
          ${MARQUE.logo
            ? `<img class="logo" src="${MARQUE.logo}" alt="${MARQUE.nom}"
                 style="height:${MARQUE.logoHauteur}px"
                 onerror="this.outerHTML='<div class=\'ent\'>${MARQUE.nom}</div>'">`
            : `<div class="ent">${MARQUE.nom}</div>`}
          <div class="bl">${MARQUE.baseline}</div>
          <div class="coord" contenteditable="true">
            ${MARQUE.gerant}${MARQUE.fonction?', '+MARQUE.fonction.toLowerCase():''}<br>
            ${MARQUE.coord.join('<br>')}
          </div>
        </div>
        <div class="droite">
          <b>${CLIENT.nom || '<span class="vide2">Nom du client</span>'}</b>
          ${CLIENT.adresse ? CLIENT.adresse+'<br>' : ''}${CLIENT.ville || ''}
          <div class="meta2">${dateFr()}<br>Réf. ${REF}</div>
        </div>
      </div>

      <h1 class="dtitre">${client ? 'Palette végétale proposée' : 'Récapitulatif des végétaux'}</h1>
      ${CLIENT.projet ? `<p class="projet">${CLIENT.projet}</p>` : ''}
      <p class="dsstitre">${nbSujets} sujets · ${especes.length} espèces · environ ${fmt(Math.round(surface))} m² plantés</p>

      ${client ? `<p class="intro">Cette palette a été composée pour les conditions de votre terrain :
        exposition, nature du sol et entretien souhaité. Chaque espèce est présentée en détail
        dans les fiches qui suivent. Le chiffrage de ces plantations figure au devis d'aménagement.</p>` : ''}

      <div class="dsec">${client ? 'Composition de la palette' : 'Détail par référence'}</div>
      <table class="dev">
        <thead>${client ? enteteClient : enteteInterne}</thead>
        <tbody>${lignes}</tbody>
      </table>
      ${totaux}

      <div class="dsec">Échelonnement des floraisons sur l'année</div>
      <div class="dcal">
        ${counts.map(c=>`<i class="${c?'on':''}" style="height:${c?5+(c/Math.max(1,...counts))*20:5}px"></i>`).join('')}
      </div>
      <div class="dcal-lab">${MOIS_LONG.map(m=>`<span>${m.slice(0,1).toUpperCase()}</span>`).join('')}</div>
      <p style="font-size:11.5px;color:var(--encre-2);margin-top:8px;line-height:1.5">
        ${trous.length && trous.length<12
          ? `Cette palette ne présente pas de floraison en ${trous.join(', ')}. Un arbuste à floraison hivernale ou une graminée à épis persistants comblerait ce creux.`
          : `Cette palette assure une présence florale sur l'ensemble de l'année.`}
      </p>

      ${(() => {
        const g = especes.filter(forte);
        if(!g.length) return '';
        return `<div class="dsec">Précautions particulières</div>
        <p class="txt" style="font-size:12.5px;margin:0 0 10px;line-height:1.55">
          Les espèces suivantes demandent une attention particulière selon l'usage du jardin
          et la présence éventuelle de jeunes enfants ou d'animaux. Les autres végétaux de
          cette palette ne présentent pas de risque notable.</p>
        <div class="alertes">${g.map(p=>`
          <div class="al">
            <div class="alt">${p.fr} <span class="lat">${p.lat}</span></div>
            ${p.rq.filter(r=>r.n===2).map(r=>
              `<p><b>${RISQ[r.c].lib} :</b> ${r.t}</p>`).join('')}
          </div>`).join('')}</div>`;
      })()}

      <div class="dsec">Fiches techniques des espèces retenues</div>
      ${fiches}

      <div class="mentions" contenteditable="true">
        ${client
          ? `Les végétaux sont fournis dans les conditionnements indiqués ; les tailles peuvent
             varier légèrement selon les disponibilités de la pépinière au moment de la commande.
             La reprise suppose une préparation du sol adaptée, un arrosage suivi la première année
             et le respect des périodes de plantation mentionnées sur les fiches. Les surfaces
             indiquées correspondent aux densités de plantation habituelles et peuvent être ajustées
             selon l'effet recherché. Palette susceptible d'évoluer selon les disponibilités
             en pépinière au moment de la commande.`
          : `Prix d'achat HT du premier palier de quantité, catalogue AD.V Production 2026/2027.
             Des tarifs dégressifs s'appliquent aux quantités supérieures : vérifier les seuils
             avant commande. Disponibilités à confirmer auprès du fournisseur.`}
      </div>
      ${MARQUE.legal ? `<div class="legal">${MARQUE.legal}</div>` : ''}
    </div>`;

  [['c-nom','nom'],['c-adr','adresse'],['c-vil','ville'],['c-prj','projet']].forEach(([id,cle])=>{
    const ch = document.getElementById(id);
    ch.addEventListener('input', e=>{ CLIENT[cle] = e.target.value; });
    ch.addEventListener('change', ()=>ouvrirDocument());
  });

  doc.querySelector('.modes').onclick = e=>{
    const b = e.target.closest('button'); if(!b) return;
    CFG.mode = b.dataset.mode; ouvrirDocument();
  };
  if(!client){
    document.getElementById('r-coef').addEventListener('change', e=>{
      CFG.coef = Math.max(1, parseFloat(e.target.value)||1);
      ouvrirDocument();
    });
  }
  document.getElementById('d-fermer').onclick = fermerDocument;
  document.getElementById('d-pdf').onclick = ()=>window.print();
  const mail = document.getElementById('d-mail');
  if(mail) mail.onclick = ()=>{
    const corps =
`Bonjour${CLIENT.nom ? ' '+CLIENT.nom : ''},

Vous trouverez ci-joint la palette végétale proposée pour votre projet.

Elle comprend ${nbSujets} sujets répartis sur ${especes.length} espèces, pour environ ${fmt(Math.round(surface))} m² plantés.

Chaque espèce est accompagnée de sa fiche technique : conditions de culture, période de plantation et conseils d'entretien. Le chiffrage de ces plantations figure au devis d'aménagement.

Je reste à votre disposition pour en discuter.

Cordialement,

${MARQUE.gerant}
${MARQUE.nom} — ${MARQUE.baseline}
${MARQUE.coord.join(' · ')}`;
    location.href = 'mailto:?subject=' + encodeURIComponent('Palette végétale' + (CLIENT.projet ? ' — '+CLIENT.projet : '') + ' — ' + REF) +
                    '&body=' + encodeURIComponent(corps);
  };

  doc.classList.add('on');
  doc.scrollTop = 0;
}

function fermerDocument(){ document.getElementById('doc').classList.remove('on'); }
