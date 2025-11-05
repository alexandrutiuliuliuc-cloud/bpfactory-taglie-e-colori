/**
 * Auto-select Smallest Available Size on Product Page AND Quick View Popup
 * FORCES the smallest size to be selected, overriding theme defaults
 * Works on product pages and quick view popups
 */
(function() {
  'use strict';

  // Size order from smallest to largest
  const SIZE_ORDER = [
    'XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'
  ];

  function getSizeOrderIndex(size) {
    const upperSize = size.toUpperCase().trim();
    const index = SIZE_ORDER.indexOf(upperSize);
    return index >= 0 ? index : 999;
  }

  function autoSelectSmallestSize(context = document, isQuickView = false) {
    try {
      const logPrefix = isQuickView ? '[SIZE AUTO-SELECT - QUICK VIEW]' : '[SIZE AUTO-SELECT]';
      
      // Find ProductJson script tag - WAIT for it if in quick view
      let productJsonEl = context.querySelector('script[id^="ProductJson-"]');
      
      if (!productJsonEl && isQuickView) {
        // If in quick view and no JSON yet, search in entire document
        productJsonEl = document.querySelector('.quick-product script[id^="ProductJson-"], [data-is-quick-view="true"] script[id^="ProductJson-"]');
      }
      
      if (!productJsonEl) {
        console.log(logPrefix, 'No ProductJson found yet - will retry');
        return;
      }

      console.log(logPrefix, 'Found ProductJson:', productJsonEl.id);

      let productData;
      try {
        productData = JSON.parse(productJsonEl.textContent);
      } catch (e) {
        console.log(logPrefix, 'Error parsing JSON');
        return;
      }

      if (!productData.variants || productData.variants.length === 0) {
        console.log(logPrefix, 'No variants');
        return;
      }

      console.log(logPrefix, 'Product:', productData.title);

      // Find which option is "Taglia"
      let sizeOptionIndex = -1;

      if (productData.options) {
        productData.options.forEach((option, idx) => {
          const optionLower = option.toLowerCase();
          if (optionLower === 'taglia' || optionLower === 'size') {
            sizeOptionIndex = idx;
            console.log(logPrefix, 'Found Taglia at index:', idx);
          }
        });
      }

      if (sizeOptionIndex === -1) {
        console.log(logPrefix, 'Taglia not found');
        return;
      }

      // Collect available sizes
      const availableSizes = new Map();
      
      productData.variants.forEach(variant => {
        const size = variant.options ? variant.options[sizeOptionIndex] : null;
        if (variant.available && size) {
          if (!availableSizes.has(size)) {
            availableSizes.set(size, variant);
          }
        }
      });

      console.log(logPrefix, 'Available sizes:', Array.from(availableSizes.keys()));

      if (availableSizes.size === 0) return;

      // Sort and get smallest
      const sortedSizes = Array.from(availableSizes.keys()).sort((a, b) => {
        return getSizeOrderIndex(a) - getSizeOrderIndex(b);
      });

      console.log(logPrefix, 'Sorted sizes:', sortedSizes);

      const smallestSize = sortedSizes[0];
      console.log(logPrefix, '✅ SMALLEST SIZE TO SELECT:', smallestSize);

      // Search in the correct context (entire document for quick view)
      const searchContext = isQuickView ? document : context;

      // Find and change ALL selects
      const allSelects = searchContext.querySelectorAll('select[name^="options"]');
      console.log(logPrefix, 'Found selects:', allSelects.length);
      
      allSelects.forEach((select) => {
        const options = Array.from(select.options).map(o => o.value);
        const hasSize = options.includes(smallestSize);
        
        if (hasSize && select.value !== smallestSize) {
          console.log(logPrefix, `🔄 Changing select from ${select.value} to ${smallestSize}`);
          select.value = smallestSize;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
          
          // Update visible label
          const wrapper = select.closest('.select-wrapper, .product__option, [data-product-option]');
          if (wrapper) {
            const displayElements = wrapper.querySelectorAll('span[data-selected-value-for-option], .selected-value');
            displayElements.forEach(elem => {
              if (elem.tagName !== 'SELECT' && elem.tagName !== 'OPTION') {
                elem.textContent = smallestSize;
              }
            });
          }
        }
      });

      // Click buttons
      const allButtons = searchContext.querySelectorAll('button[data-option-value], button[data-label], .product__chip');
      console.log(logPrefix, 'Found buttons:', allButtons.length);
      
      allButtons.forEach((btn) => {
        const btnValue = btn.getAttribute('data-option-value') || btn.getAttribute('data-label') || btn.textContent.trim();
        
        if (btnValue === smallestSize && !btn.classList.contains('selected')) {
          console.log(logPrefix, `🔄 Clicking button for: ${smallestSize}`);
          btn.click();
        }
      });

      console.log(logPrefix, '=== Finished ===');

    } catch (e) {
      console.error('[SIZE AUTO-SELECT] ERROR:', e);
    }
  }

  // Run multiple times for main page
  function runMultipleTimes() {
    autoSelectSmallestSize(document, false);
    setTimeout(() => autoSelectSmallestSize(document, false), 100);
    setTimeout(() => autoSelectSmallestSize(document, false), 300);
    setTimeout(() => autoSelectSmallestSize(document, false), 500);
    setTimeout(() => autoSelectSmallestSize(document, false), 1000);
  }

  // ONLY run on product pages for initial load
  if (document.body.classList.contains('template-product')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runMultipleTimes);
    } else {
      runMultipleTimes();
    }
  }

  // Listen for variant changes
  document.addEventListener('product:variant-change', () => {
    autoSelectSmallestSize(document, false);
  });

  // IMPORTANT: Listen for Quick View popup - wait longer for content to load
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check if this is a quick view popup OR contains one
          const isQuickView = node.classList && (
            node.classList.contains('quick-product') || 
            node.classList.contains('quick-view') ||
            node.querySelector('.quick-product') ||
            node.querySelector('[data-is-quick-view="true"]')
          );
          
          if (isQuickView) {
            console.log('[SIZE AUTO-SELECT] 🎯 Quick view popup detected! Waiting for content...');
            
            // Wait progressively longer for AJAX content to load
            setTimeout(() => autoSelectSmallestSize(node, true), 200);
            setTimeout(() => autoSelectSmallestSize(node, true), 500);
            setTimeout(() => autoSelectSmallestSize(node, true), 800);
            setTimeout(() => autoSelectSmallestSize(node, true), 1200);
            setTimeout(() => autoSelectSmallestSize(node, true), 1600);
            setTimeout(() => autoSelectSmallestSize(node, true), 2000);
            setTimeout(() => autoSelectSmallestSize(node, true), 2500);
            setTimeout(() => autoSelectSmallestSize(node, true), 3000);
          }
        }
      });
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also listen for custom events
  document.addEventListener('theme:quickview:loaded', () => {
    console.log('[SIZE AUTO-SELECT] Quick view loaded event!');
    setTimeout(() => autoSelectSmallestSize(document, true), 100);
    setTimeout(() => autoSelectSmallestSize(document, true), 300);
    setTimeout(() => autoSelectSmallestSize(document, true), 600);
    setTimeout(() => autoSelectSmallestSize(document, true), 1000);
  });

})();
