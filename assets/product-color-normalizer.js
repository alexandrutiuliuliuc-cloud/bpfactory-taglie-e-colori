/**
 * Product Color Normalizer
 * Normalizes color variant names on product pages AND quick view popups to show mother color names in UPPERCASE
 * ONLY runs on product pages - does NOT touch filters
 */
(function() {
  'use strict';

  // Run on product pages OR when quick view popups are present
  const isProductPage = document.body.classList.contains('template-product');
  const hasQuickView = !!document.querySelector('.quick-product, [data-is-quick-view="true"]');
  
  if (!isProductPage && !hasQuickView) {
    // Will still initialize to listen for quick view popups being added later
  }

  // This matches the logic in color-name-normalizer.liquid
  function normalizeColorName(colorName) {
    if (!colorName || typeof colorName !== 'string') return colorName;
    
    try {
      let normalized = colorName.trim();
      
      // Remove parenthetical codes: (010), (WML), etc.
      normalized = normalized.replace(/\s*\([^)]+\)\s*$/g, '');
      normalized = normalized.replace(/\s*\[[^\]]+\]\s*$/g, '');
      
      // Common abbreviations and variations (case insensitive)
      const colorMap = {
        'bei': 'Beige',
        'beig': 'Beige',
        'bianco': 'Bianco',
        'white': 'Bianco',
        'nero': 'Nero',
        'black': 'Nero',
        'blu': 'Blu',
        'blue': 'Blu',
        'rosso': 'Rosso',
        'red': 'Rosso',
        'verde': 'Verde',
        'green': 'Verde',
        'giallo': 'Giallo',
        'yellow': 'Giallo',
        'grigio': 'Grigio',
        'gray': 'Grigio',
        'grey': 'Grigio',
        'marrone': 'Marrone',
        'brown': 'Marrone',
        'rosa': 'Rosa',
        'pink': 'Rosa',
        'viola': 'Viola',
        'purple': 'Viola',
        'arancione': 'Arancione',
        'orange': 'Arancione',
        'azzurro': 'Azzurro',
        'army': 'Army',
        'camo': 'Camouflage',
        'camouflage': 'Camouflage',
        'denim': 'Denim',
        'bordeaux': 'Bordeaux',
        'burgundy': 'Bordeaux'
      };
      
      const normalizedLower = normalized.toLowerCase();
      
      for (const [key, value] of Object.entries(colorMap)) {
        if (normalizedLower === key) {
          return value;
        }
      }
      
      // Capitalize first letter
      return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    } catch (e) {
      console.error('Error normalizing color name:', e);
      return colorName;
    }
  }

  // Normalize the displayed selected value text (e.g., "Colore: BIANCO (011)" -> "Colore: BIANCO")
  function normalizeDisplayedValue() {
    try {
      // 1. Main product form selected values
      const selectedValueSpans = document.querySelectorAll('[data-selected-value-for-option]');
      
      selectedValueSpans.forEach(function(span) {
        try {
          const originalText = span.textContent.trim();
          if (originalText) {
            const motherColor = normalizeColorName(originalText);
            // Force UPPERCASE for display
            span.textContent = motherColor.toUpperCase();
          }
        } catch (e) {
          console.error('Error normalizing span:', e);
        }
      });

      // 2. Sticky add to cart bar (e.g., "BIANCO (001), S")
      const stickyMetaOptions = document.querySelectorAll('.sticky-atc-bar__meta-options');
      
      stickyMetaOptions.forEach(function(element) {
        try {
          const originalText = element.textContent.trim();
          if (originalText && originalText.length > 0) {
            // Split by comma to handle "COLOR, SIZE"
            const parts = originalText.split(',');
            
            if (parts.length > 0) {
              const colorPart = parts[0].trim();
              // Normalize the color part
              const motherColor = normalizeColorName(colorPart);
              parts[0] = motherColor.toUpperCase();
              
              // Rebuild the text
              element.textContent = parts.join(', ');
            }
          }
        } catch (e) {
          console.error('Error normalizing sticky bar:', e);
        }
      });
    } catch (e) {
      console.error('Error in normalizeDisplayedValue:', e);
    }
  }

  // Run normalization on page load
  function init() {
    try {
      normalizeDisplayedValue();
      
      // Listen for variant changes and re-normalize multiple times
      document.addEventListener('product:variant-change', function() {
        setTimeout(normalizeDisplayedValue, 50);
        setTimeout(normalizeDisplayedValue, 200);
        setTimeout(normalizeDisplayedValue, 500);
      });

      // Listen for ANY click on variant buttons (size, color, etc.)
      document.addEventListener('click', function(e) {
        // Check if clicked element is a variant button
        if (e.target.closest('[data-button]') || 
            e.target.closest('.dynamic-variant-button') ||
            e.target.closest('.product__chip')) {
          // Re-normalize after variant change
          setTimeout(normalizeDisplayedValue, 50);
          setTimeout(normalizeDisplayedValue, 200);
          setTimeout(normalizeDisplayedValue, 500);
        }
      });

      // Listen for select dropdown changes (if using dropdown for variants)
      document.addEventListener('change', function(e) {
        if (e.target.matches('select[name^="options"]')) {
          setTimeout(normalizeDisplayedValue, 50);
          setTimeout(normalizeDisplayedValue, 200);
          setTimeout(normalizeDisplayedValue, 500);
        }
      });
    } catch (e) {
      console.error('Error initializing product color normalizer:', e);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run after delays to catch dynamic content and sticky bar updates (ONLY on product pages)
  if (isProductPage) {
    setTimeout(normalizeDisplayedValue, 200);
    setTimeout(normalizeDisplayedValue, 500);
    setTimeout(normalizeDisplayedValue, 1000);
    setTimeout(normalizeDisplayedValue, 2000);
  }

  // Listen for Quick View popup opening
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check if this is a quick view popup
          if (node.classList && (node.classList.contains('quick-product') || 
              node.classList.contains('quick-view') ||
              node.querySelector('.quick-product') ||
              node.querySelector('[data-is-quick-view="true"]'))) {
            
            console.log('[COLOR NORMALIZER] Quick view detected, normalizing colors...');
            
            // Run normalization multiple times for popup
            setTimeout(normalizeDisplayedValue, 300);
            setTimeout(normalizeDisplayedValue, 600);
            setTimeout(normalizeDisplayedValue, 1000);
            setTimeout(normalizeDisplayedValue, 1500);
            setTimeout(normalizeDisplayedValue, 2000);
            setTimeout(normalizeDisplayedValue, 2500);
          }
        }
      });
    });
  });

  // Start observing for popups
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
