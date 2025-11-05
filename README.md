# BP Factory - Normalizzazione Colori Madre e Ordinamento Taglie

Questo repository contiene tutte le modifiche apportate al tema Shopify "BP Factory x IL SUCCESSO! [FUZZY]" per implementare:

1. **Normalizzazione Colori Madre**: Unificazione di tutte le varianti colore sotto un unico nome "madre" (es. "BIANCO (001)", "BIANCO (ABC)" → "BIANCO")
2. **Ordinamento Taglie**: Ordinamento intelligente delle taglie da più piccola a più grande (XS, S, M, L, XL, XXL, ecc.)
3. **Auto-selezione Taglia**: Selezione automatica della taglia più piccola disponibile

---

## 📋 Indice

- [Funzionalità Implementate](#funzionalità-implementate)
- [File Modificati](#file-modificati)
- [Logica di Funzionamento](#logica-di-funzionamento)
- [Installazione](#installazione)
- [Struttura del Progetto](#struttura-del-progetto)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Funzionalità Implementate

### 1. Normalizzazione Colori Madre

**Problema risolto:**
- I prodotti avevano varianti colore con codici diversi: "BIANCO (001)", "BIANCO (ABC123)", "Bianco [XYZ]"
- Nei filtri collezione apparivano decine di colori duplicati
- Impossibile raggruppare manualmente tutti i colori in Search & Discovery

**Soluzione:**
- ✅ Tutti i colori con lo stesso "colore madre" vengono unificati sotto un unico nome in UPPERCASE
- ✅ I filtri mostrano solo 1 voce per colore madre (es. "BIANCO")
- ✅ Il contatore prodotti è corretto e costante
- ✅ I colori secondari sono completamente nascosti e non selezionabili
- ✅ Funziona su: Filtri Desktop, Filtri Mobile, Pagina Prodotto, Carrello, Quick View Popup

**Mapping colori abbreviati:**
- `bei`, `beig` → `Beige`
- `bianco`, `white` → `Bianco`
- `nero`, `black` → `Nero`
- `blu`, `blue` → `Blu`
- `rosso`, `red` → `Rosso`
- `verde`, `green` → `Verde`
- `grigio`, `gray`, `grey` → `Grigio`
- `marrone`, `brown` → `Marrone`
- E molti altri...

### 2. Ordinamento Taglie

**Problema risolto:**
- Le taglie apparivano in ordine casuale: XL, M, S, XXL, L
- Difficoltà per l'utente a trovare la propria taglia

**Soluzione:**
- ✅ Ordinamento intelligente: XXXS, XXS, XS, S, M, L, XL, XXL, XXXL, XXXXL
- ✅ Supporto taglie numeriche: 0, 1, 2, 3, 4, 5... 50
- ✅ Funziona su: Pagina Prodotto (dropdown/chips), Collezioni (chips sotto prodotto), Quick View Popup

### 3. Auto-selezione Taglia Più Piccola

**Problema risolto:**
- Di default veniva selezionata una taglia casuale o l'ultima disponibile

**Soluzione:**
- ✅ Quando si apre una pagina prodotto, la taglia più piccola disponibile viene selezionata automaticamente
- ✅ Se la più piccola è esaurita, seleziona la successiva disponibile
- ✅ Funziona su: Pagina Prodotto

---

## 📁 File Modificati

### **File Nuovi Creati**

1. **`snippets/color-name-normalizer.liquid`**
   - Snippet Liquid che normalizza i nomi colore
   - Rimuove codici tra parentesi/brackets
   - Mappa abbreviazioni a nomi standard
   - Output: nome colore madre in formato standardizzato

2. **`snippets/sort-size-values.liquid`**
   - Snippet Liquid che ordina le taglie
   - Ordine predefinito: XXXS → XXXXL, poi 0 → 50
   - Output: string di taglie ordinate separate da `||`

3. **`snippets/cart-variant-title-normalizer.liquid`**
   - Normalizza i titoli varianti nel carrello
   - Converte "BIANCO (001) / M" → "BIANCO / M"
   - Output: titolo normalizzato

4. **`assets/mother-color-grouping.js`**
   - JavaScript per raggruppamento colori nei filtri
   - Nasconde duplicati, mostra solo madre color
   - Gestisce desktop e mobile separatamente
   - Sincronizza checkbox tra colori duplicati

5. **`assets/product-color-normalizer.js`**
   - JavaScript per normalizzazione colori in pagina prodotto
   - Aggiorna `[data-selected-value-for-option]`
   - Gestisce sticky add-to-cart bar
   - Funziona anche in Quick View popup

6. **`assets/checkout-color-normalizer.js`**
   - JavaScript per normalizzazione colori al checkout
   - Da aggiungere manualmente in Shopify Admin → Settings → Checkout → Additional Scripts

7. **`assets/auto-select-smallest-size.js`**
   - JavaScript per auto-selezione taglia più piccola
   - Monitora popup Quick View con MutationObserver
   - Tentativi multipli per caricamento AJAX

### **File Modificati**

1. **`snippets/filter-item.liquid`**
   - Aggiunto: `data-color-original="{{ filter_value.label }}"`
   - Aggiunto: `data-color-mother="{{ mother_color }}"`
   - Utilizza `color-name-normalizer` per generare madre color

2. **`snippets/product-block-variant-picker.liquid`**
   - Aggiunto: ordinamento taglie per opzione "Taglia"
   - Utilizza `sort-size-values` snippet
   - Applicato a: select dropdown e chips

3. **`snippets/product-item-chips.liquid`**
   - Aggiunto: ordinamento taglie per collezioni
   - Chips sotto prodotto ora ordinate correttamente

4. **`sections/quick-cart.liquid`**
   - Modificato: usa `cart-variant-title-normalizer` per `item.variant.title`

5. **`sections/main-cart.liquid`**
   - Modificato: usa `cart-variant-title-normalizer` per `item.variant.title`

6. **`sections/purchase-confirmation-popup-item.liquid`**
   - Modificato: usa `cart-variant-title-normalizer` per `item.variant.title`

7. **`layout/theme.liquid`**
   - Aggiunto: CSS per nascondere colori secondari
   - Aggiunto: CSS per forzare visibilità colori madre
   - Aggiunto: `<script>` tag per tutti i JavaScript creati

### **File di Configurazione**

- **`config/settings_data.json`**: `swatch_options: "Colore"` (verificato corretto)
- **`templates/collection.json`**: `show_filters: true` (verificato corretto)

---

## 🔧 Logica di Funzionamento

### Normalizzazione Colori - Flusso Completo

```
1. Liquid (Backend)
   ├─ snippets/color-name-normalizer.liquid
   │  └─ Input: "BIANCO (001)"
   │  └─ Output: "Bianco"
   │
   ├─ snippets/filter-item.liquid
   │  └─ Aggiunge data-color-mother="Bianco" a ogni filter item
   │
   └─ snippets/cart-variant-title-normalizer.liquid
      └─ Normalizza titoli nel carrello

2. JavaScript (Frontend)
   ├─ assets/mother-color-grouping.js
   │  ├─ Raggruppa filtri per data-color-mother
   │  ├─ Nasconde duplicati (display: none !important)
   │  ├─ Mostra solo 1 elemento per madre color
   │  ├─ Forza UPPERCASE per etichette
   │  ├─ Gestisce checkbox sync
   │  └─ Funziona su desktop E mobile
   │
   ├─ assets/product-color-normalizer.js
   │  ├─ Normalizza [data-selected-value-for-option]
   │  ├─ Aggiorna sticky-atc-bar__meta-options
   │  └─ Monitora Quick View popup
   │
   └─ assets/checkout-color-normalizer.js
      └─ Normalizza testo al checkout (p._1tx8jg70)

3. CSS (theme.liquid)
   └─ Nasconde aggressivamente elementi con:
      ├─ [data-hidden="true"]
      ├─ [data-color-secondary="true"]
      └─ Forza visibilità [data-is-mother-primary="true"]
```

### Ordinamento Taglie - Flusso Completo

```
1. Liquid (Backend)
   ├─ snippets/sort-size-values.liquid
   │  └─ Ordina array taglie secondo SIZE_ORDER
   │
   ├─ snippets/product-block-variant-picker.liquid
   │  └─ Applica ordinamento se option_name == 'taglia'
   │
   └─ snippets/product-item-chips.liquid
      └─ Applica ordinamento per collezioni

2. JavaScript (Frontend)
   └─ assets/auto-select-smallest-size.js
      ├─ Legge ProductJson script tag
      ├─ Trova indice opzione "Taglia"
      ├─ Ordina taglie disponibili
      ├─ Seleziona la più piccola
      ├─ Monitora Quick View popup
      └─ Tentativi multipli (200ms, 500ms, 1000ms, etc.)
```

---

## 📦 Installazione

### Prerequisiti

- Shopify CLI installato
- Accesso al tema "BP Factory x IL SUCCESSO! [FUZZY]" (ID: 188517744988)
- Store: bp-factory-s-r-l.myshopify.com

### Step 1: Setup Shopify CLI

```bash
# Autenticazione
shopify auth login --store bp-factory-s-r-l.myshopify.com

# Verifica tema
shopify theme list
```

### Step 2: Upload Files

**Opzione A: Upload Completo**

```bash
cd "/Users/alex/Documents/SVILUPPO/BP FACTORY"

# Upload tutti i file
shopify theme push --theme 188517744988 --store bp-factory-s-r-l.myshopify.com
```

**Opzione B: Upload Selettivo (Raccomandato)**

```bash
# Solo nuovi snippet
shopify theme push --theme 188517744988 \
  --only snippets/color-name-normalizer.liquid \
  --only snippets/sort-size-values.liquid \
  --only snippets/cart-variant-title-normalizer.liquid

# Solo JavaScript
shopify theme push --theme 188517744988 \
  --only assets/mother-color-grouping.js \
  --only assets/product-color-normalizer.js \
  --only assets/auto-select-smallest-size.js \
  --only assets/checkout-color-normalizer.js

# File modificati
shopify theme push --theme 188517744988 \
  --only snippets/filter-item.liquid \
  --only snippets/product-block-variant-picker.liquid \
  --only snippets/product-item-chips.liquid \
  --only layout/theme.liquid \
  --only sections/quick-cart.liquid \
  --only sections/main-cart.liquid \
  --only sections/purchase-confirmation-popup-item.liquid
```

### Step 3: Configurazione Checkout

**IMPORTANTE**: Il normalizzatore checkout richiede configurazione manuale.

1. Vai su: Shopify Admin → Settings → Checkout
2. Scroll fino a "Additional scripts"
3. Copia il contenuto di `assets/checkout-color-normalizer.js`
4. Incollalo nel campo "Additional scripts"
5. Salva

### Step 4: Verifica Configurazioni

```bash
# Pull configurazioni attuali
shopify theme pull --theme 188517744988 \
  --only config/settings_data.json \
  --only templates/collection.json
```

Verifica che:
- `config/settings_data.json` → `"swatch_options": "Colore"`
- `templates/collection.json` → `"show_filters": true`

---

## 🏗️ Struttura del Progetto

```
BP FACTORY/
│
├── assets/
│   ├── mother-color-grouping.js          # ⭐ NUOVO - Grouping filtri
│   ├── product-color-normalizer.js       # ⭐ NUOVO - Normalizzazione prodotto
│   ├── checkout-color-normalizer.js      # ⭐ NUOVO - Normalizzazione checkout
│   └── auto-select-smallest-size.js      # ⭐ NUOVO - Auto-select taglia
│
├── snippets/
│   ├── color-name-normalizer.liquid      # ⭐ NUOVO - Normalizzazione Liquid
│   ├── sort-size-values.liquid           # ⭐ NUOVO - Ordinamento taglie
│   ├── cart-variant-title-normalizer.liquid  # ⭐ NUOVO - Normalizzazione carrello
│   ├── filter-item.liquid                # ✏️ MODIFICATO - Data attributes
│   ├── product-block-variant-picker.liquid   # ✏️ MODIFICATO - Ordinamento
│   └── product-item-chips.liquid         # ✏️ MODIFICATO - Ordinamento collezioni
│
├── sections/
│   ├── quick-cart.liquid                 # ✏️ MODIFICATO - Usa normalizer
│   ├── main-cart.liquid                  # ✏️ MODIFICATO - Usa normalizer
│   └── purchase-confirmation-popup-item.liquid  # ✏️ MODIFICATO - Usa normalizer
│
├── layout/
│   └── theme.liquid                      # ✏️ MODIFICATO - CSS + Scripts
│
└── config/
    ├── settings_data.json                # ✅ VERIFICATO - swatch_options
    └── templates/collection.json         # ✅ VERIFICATO - show_filters
```

---

## 🐛 Troubleshooting

### Filtri non si vedono

**Problema**: I filtri colore non appaiono nella collezione.

**Soluzione**:
1. Verifica `templates/collection.json` → `"show_filters": true`
2. Verifica `config/settings_data.json` → `"swatch_options": "Colore"`
3. Verifica che `mother-color-grouping.js` sia caricato in `theme.liquid`

### Colori secondari ancora visibili

**Problema**: Nei filtri si vedono ancora "BIANCO (001)", "BIANCO (002)", ecc.

**Soluzione**:
1. Apri Console browser (F12)
2. Cerca errori JavaScript
3. Verifica che `filter-item.liquid` abbia gli attributi `data-color-mother`
4. Forza reload: CTRL+F5 (Windows) o CMD+SHIFT+R (Mac)

### Taglie non ordinate

**Problema**: Le taglie appaiono in ordine casuale.

**Soluzione**:
1. Verifica che `sort-size-values.liquid` esista
2. Verifica che `product-block-variant-picker.liquid` usi il sort
3. Controlla che il nome opzione sia esattamente "Taglia" (case-insensitive)

### Auto-select non funziona

**Problema**: La taglia più piccola non viene selezionata automaticamente.

**Soluzione**:
1. Apri Console (F12) e cerca log `[SIZE AUTO-SELECT]`
2. Verifica che ci sia `ProductJson script found`
3. Aumenta i delay in `auto-select-smallest-size.js` se il contenuto è lento

### Quick View popup non normalizza

**Problema**: Nel popup "Scegliere opzioni" si vedono ancora codici colore.

**Soluzione**:
1. Verifica che `MutationObserver` sia attivo (log in console)
2. Aumenta i timeout nel popup observer (es. 3000ms, 4000ms)
3. Verifica che `product-color-normalizer.js` non sia bloccato dal `template-product` check

---

## 📊 Metriche e Performance

### Impatto Prestazioni

- ✅ **Nessun impatto SEO**: I colori madre sono gestiti solo frontend
- ✅ **Nessun impatto caricamento iniziale**: Script async
- ✅ **Caching browser**: File JS/CSS cached
- ⚠️ **MutationObserver**: Monitoraggio DOM minimo e performante

### Browser Supportati

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔄 Changelog

### Versione 1.0 (Novembre 2024)

**Colori Madre:**
- ✅ Implementato normalizzazione Liquid
- ✅ Implementato grouping JavaScript desktop
- ✅ Implementato grouping JavaScript mobile
- ✅ Risolto problema contatori progressivi
- ✅ Risolto problema colori secondari in active chips
- ✅ Implementato normalizzazione pagina prodotto
- ✅ Implementato normalizzazione carrello (drawer + page + popup)
- ✅ Implementato normalizzazione checkout
- ✅ Implementato normalizzazione Quick View popup

**Taglie:**
- ✅ Implementato ordinamento Liquid
- ✅ Implementato ordinamento pagina prodotto
- ✅ Implementato ordinamento collezioni
- ✅ Implementato ordinamento Quick View popup
- ✅ Implementato auto-selezione taglia più piccola
- ⚠️ Auto-select in Quick View: parzialmente funzionante (timing AJAX)

---

## 👥 Crediti

**Sviluppatore**: Alexandru Tiuliuliuc  
**Store**: BP Factory (bp-factory-s-r-l.myshopify.com)  
**Tema**: BP Factory x IL SUCCESSO! [FUZZY]  
**Data**: Novembre 2024

---

## 📄 Licenza

Questo codice è proprietario di BP Factory S.r.l. e non può essere redistribuito senza permesso esplicito.

---

## 📞 Supporto

Per assistenza o domande:
- Consulta questo README
- Verifica console browser per errori JavaScript
- Controlla che tutti i file siano stati caricati correttamente
- Testa in modalità incognito per escludere problemi di cache

---

**Last Updated**: Novembre 2024  
**Repository**: https://github.com/alexandrutiuliuliuc-cloud/bpfactory-taglie-e-colori

