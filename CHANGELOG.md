# Changelog

Tutte le modifiche importanti a questo progetto saranno documentate in questo file.

## [1.0.0] - 2024-11-05

### Funzionalità Implementate

#### Normalizzazione Colori Madre
- Creato `snippets/color-name-normalizer.liquid` per normalizzazione backend
- Creato `assets/mother-color-grouping.js` per grouping filtri desktop e mobile
- Creato `assets/product-color-normalizer.js` per normalizzazione pagina prodotto
- Creato `assets/checkout-color-normalizer.js` per normalizzazione checkout
- Creato `snippets/cart-variant-title-normalizer.liquid` per normalizzazione carrello
- Modificato `snippets/filter-item.liquid` per aggiungere data attributes
- Modificato `sections/quick-cart.liquid` per usare normalizer
- Modificato `sections/main-cart.liquid` per usare normalizer
- Modificato `sections/purchase-confirmation-popup-item.liquid` per usare normalizer
- Modificato `layout/theme.liquid` per CSS aggressivo e script tags

#### Ordinamento Taglie
- Creato `snippets/sort-size-values.liquid` per ordinamento backend
- Creato `assets/auto-select-smallest-size.js` per auto-selezione frontend
- Modificato `snippets/product-block-variant-picker.liquid` per ordinamento pagina prodotto
- Modificato `snippets/product-item-chips.liquid` per ordinamento collezioni

### Bug Risolti

#### Filtri Colori
- **#1** - Filtri non visibili: Corretto `show_filters: false` → `true` in collection.json
- **#2** - Swatch non funzionanti: Corretto `swatch_options: ""` → `"Colore"` in settings_data.json
- **#3** - Dropdown colore non cliccabile: Rimosso logica che forzava apertura, lasciato gestione nativa
- **#4** - Contatori progressivi: Implementato `originalCounts` object per memorizzare conteggi originali
- **#5** - Colori secondari in active chips: Implementato strategia di unchecking checkbox secondari
- **#6** - Mobile filtri non visibili: Separato logica desktop/mobile in `groupDesktopColors()` e `groupMobileColors()`
- **#7** - Filtri rotti dopo push live: Rollback immediato e ricreazione file corretti

#### Pagina Prodotto
- **#8** - Sticky bar mostra colore secondario: Aggiunto target specifico per `.sticky-atc-bar__meta-options`
- **#9** - Pagina bianca dopo modifiche Liquid: Corretto syntax error in `capture` block
- **#10** - Script blocca pagina: Aggiunto error handling e try/catch

#### Carrello
- **#11** - Bottoni non funzionanti: Corretto syntax Liquid `| upcase` applicato dopo render

#### Taglie
- **#12** - Auto-select cerca `data-variant-json` inesistente: Cambiato a cercare `script[id^="ProductJson-"]`
- **#13** - Auto-select trova 0 selects: Rimosso limite al form, cerca in tutta la pagina
- **#14** - Dropdown mostra taglia sbagliata: Aggiunto update di `[data-selected-value-for-option]`
- **#15** - Quick View non ordina taglie: Aggiunto MutationObserver per popup
- **#16** - Quick View non normalizza colori: Rimosso blocco `template-product`, aggiunto observer

### Performance
- Ottimizzato MutationObserver per ridurre overhead
- Implementato caching dei conteggi originali
- Ridotto numero di re-render con debouncing

### Breaking Changes
Nessuno - Tutte le modifiche sono backward compatible con il tema esistente.

### Note di Migrazione
1. Il file `checkout-color-normalizer.js` deve essere aggiunto manualmente in Shopify Admin
2. Non eliminare i gruppi filtri manuali in Search & Discovery (funzionano in parallelo)
3. Testare in modalità incognito dopo ogni deploy per escludere cache

## [0.1.0] - 2024-11-05 (Beta Iniziale)

### Setup Iniziale
- Installato Shopify CLI
- Configurato accesso al tema "BP Factory x IL SUCCESSO! [FUZZY]"
- Identificato problema colori madre e taglie
- Pianificato architettura soluzione (Liquid + JavaScript)

---

**Convenzioni**:
- `Creato`: Nuovo file aggiunto
- `Modificato`: File esistente modificato
- `Rimosso`: File eliminato (nessuno in questo progetto)
- `Corretto`: Bug fix
- `Ottimizzato`: Miglioramento performance

