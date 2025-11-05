/**
 * Checkout Color Normalizer
 * Normalizes color variant names in checkout pages to show mother color names in UPPERCASE
 * Only runs on checkout pages
 */
(function() {
  'use strict';

  // Only run on checkout pages
  if (!window.Shopify || !window.Shopify.Checkout) {
    return;
  }

  // This matches the logic in color-name-normalizer.liquid
  function normalizeColorName(colorName) {
    if (!colorName || typeof colorName !== 'string') return colorName;
    
    try {
      let normalized = colorName.trim();
      
      // Remove parenthetical codes: (010), (WML), etc.
      normalized = normalized.replace(/\s*\([^)]+\)\s*$/g, '');
      normalized = normalized.replace(/\s*\[[^\]]+\]\s*$/g, '');
      
      // Common abbreviations and variations
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
      return colorName;
    }
  }

  // Normalize variant names in checkout
  function normalizeCheckoutVariants() {
    try {
      // Find all variant/option text elements in checkout
      // These are typically in elements with classes like:
      // - .product__description__variant
      // - .product-thumbnail__variant
      // - or similar variant description elements
      
      // Based on checkout HTML structure: <p class="_1tx8jg70 ...">ROSSO (FZF1) / M</p>
      const variantElements = document.querySelectorAll('p._1tx8jg70');
      
      variantElements.forEach(function(element) {
        try {
          const originalText = element.textContent.trim();
          
          // Check if this looks like a variant string (contains " / " or parentheses)
          if (originalText && (originalText.includes('/') || originalText.includes('(') || originalText.includes('['))) {
            
            // Split by " / " to handle "COLOR / SIZE"
            const parts = originalText.split('/').map(function(p) { return p.trim(); });
            
            if (parts.length > 0) {
              const firstPart = parts[0];
              
              // Check if first part looks like a color (has parentheses/brackets)
              if (firstPart.includes('(') || firstPart.includes('[')) {
                const motherColor = normalizeColorName(firstPart);
                parts[0] = motherColor.toUpperCase();
                element.textContent = parts.join(' / ');
              }
            }
          }
        } catch (e) {
          // Skip this element
        }
      });
    } catch (e) {
      console.error('Error normalizing checkout variants:', e);
    }
  }

  // Run normalization when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeCheckoutVariants);
  } else {
    normalizeCheckoutVariants();
  }

  // Re-run after delays to catch dynamic content
  setTimeout(normalizeCheckoutVariants, 500);
  setTimeout(normalizeCheckoutVariants, 1000);
  setTimeout(normalizeCheckoutVariants, 2000);

})();

