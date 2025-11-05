/**
 * Mother Color Grouping for Filters
 * Groups color filters by mother color, hides duplicates, shows only mother color in UPPERCASE
 * Secondary colors are hidden and their checkboxes are unchecked to prevent them from being submitted
 */
(function() {
  'use strict';

  const originalCounts = {}; // Store original counts permanently

  function normalizeColorName(colorName) {
    if (!colorName) return colorName;
    let normalized = colorName.trim().replace(/\s*\([^)]+\)\s*$/g, '').replace(/\s*\[[^\]]+\]\s*$/g, '');
    const colorMap = {'bei':'Beige','beig':'Beige','bianco':'Bianco','white':'Bianco','nero':'Nero','black':'Nero','blu':'Blu','blue':'Blu','rosso':'Rosso','red':'Rosso','verde':'Verde','green':'Verde','giallo':'Giallo','yellow':'Giallo','grigio':'Grigio','gray':'Grigio','grey':'Grigio','marrone':'Marrone','brown':'Marrone','rosa':'Rosa','pink':'Rosa','viola':'Viola','purple':'Viola','arancione':'Arancione','orange':'Arancione','azzurro':'Azzurro','army':'Army','camo':'Camouflage','camouflage':'Camouflage','denim':'Denim','bordeaux':'Bordeaux','burgundy':'Bordeaux'};
    const normalizedLower = normalized.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalizedLower === key) return value;
    }
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  }

  function groupMotherColors() {
    groupDesktopColors();
    groupMobileColors();
  }

  function groupDesktopColors() {
    const colorFilters = document.querySelectorAll('.filter-bar .filter-item[data-color-mother], .filter-sidebar .filter-item[data-color-mother]');
    if (colorFilters.length === 0) return;

    const groups = {};
    
    colorFilters.forEach(item => {
      const motherColor = item.dataset.colorMother;
      if (!motherColor) return;

      if (!groups[motherColor]) {
        groups[motherColor] = {
          items: [],
          isChecked: false
        };
      }
      
      groups[motherColor].items.push(item);
      
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        groups[motherColor].isChecked = true;
      }

      const itemId = item.dataset.colorOriginal;
      if (!originalCounts[itemId]) {
        const countEl = item.querySelector('.filter-item__count');
        if (countEl) {
          const match = countEl.textContent.match(/\d+/);
          if (match) {
            originalCounts[itemId] = parseInt(match[0], 10);
          }
        }
      }
    });

    Object.keys(groups).forEach(motherColor => {
      const group = groups[motherColor];
      const items = group.items;
      if (items.length === 0) return;

      let primary = items.find(item => item.querySelector('[data-swatch]'));
      if (!primary) primary = items[0];

      const duplicates = items.filter(item => item !== primary);

      let displayCount = 0;
      const primaryCountEl = primary.querySelector('.filter-item__count');
      if (primaryCountEl) {
        const match = primaryCountEl.textContent.match(/\d+/);
        if (match) {
          displayCount = parseInt(match[0], 10);
        }
      }

      if (!originalCounts[motherColor]) {
        originalCounts[motherColor] = displayCount;
      } else {
        displayCount = originalCounts[motherColor];
      }

      const primaryLabel = primary.querySelector('.filter-item__label');
      if (primaryLabel) {
        primaryLabel.textContent = motherColor.toUpperCase();
      }
      
      const allLabels = primary.querySelectorAll('.filter-item__label');
      allLabels.forEach(label => {
        label.textContent = motherColor.toUpperCase();
      });

      const primaryCount = primary.querySelector('.filter-item__count');
      if (primaryCount) {
        primaryCount.textContent = `(${displayCount})`;
      }

      const primaryCheckbox = primary.querySelector('input[type="checkbox"]');
      if (primaryCheckbox) {
        primaryCheckbox.checked = group.isChecked;
      }

      primary.style.cssText = '';
      primary.removeAttribute('data-hidden');
      primary.setAttribute('data-is-mother-primary', 'true');
      primary.setAttribute('data-mother-color-name', motherColor);

      duplicates.forEach(item => {
        item.style.cssText = 'display: none !important; visibility: hidden !important; position: absolute !important; left: -9999px !important; opacity: 0 !important; pointer-events: none !important; height: 0 !important; width: 0 !important; overflow: hidden !important;';
        item.setAttribute('data-hidden', 'true');
        item.setAttribute('data-color-secondary', 'true');
        const cb = item.querySelector('input[type="checkbox"]');
        if (cb) {
          cb.checked = false; // Ensure secondary checkboxes are unchecked
        }
      });

      if (primaryCheckbox && !primaryCheckbox.dataset._interceptEnabled) {
        primaryCheckbox.dataset._interceptEnabled = 'true';
        
        primaryCheckbox.addEventListener('change', function() {
          const isChecked = this.checked;
          duplicates.forEach(item => {
            const cb = item.querySelector('input[type="checkbox"]');
            if (cb) {
              cb.checked = isChecked;
            }
          });
          setTimeout(groupMotherColors, 600);
        });
      }
    });
  }

  function groupMobileColors() {
    const drawerColorFilters = document.querySelectorAll('[data-filter-drawer-panel] .filter-item[data-color-mother]');
    if (drawerColorFilters.length === 0) return;

    const mobileGroups = {};
    
    drawerColorFilters.forEach(item => {
      const motherColor = item.dataset.colorMother;
      if (!motherColor) return;

      if (!mobileGroups[motherColor]) {
        mobileGroups[motherColor] = {
          items: [],
          isChecked: false
        };
      }
      
      mobileGroups[motherColor].items.push(item);
      
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        mobileGroups[motherColor].isChecked = true;
      }
    });

    Object.keys(mobileGroups).forEach(motherColor => {
      const group = mobileGroups[motherColor];
      const items = group.items;
      if (items.length === 0) return;

      const primary = items[0];
      const duplicates = items.filter(item => item !== primary);

      const primaryLabel = primary.querySelector('.filter-item__label');
      if (primaryLabel) {
        primaryLabel.textContent = motherColor.toUpperCase();
      }

      primary.style.cssText = '';
      primary.removeAttribute('data-hidden');
      primary.setAttribute('data-is-mother-primary', 'true');

      duplicates.forEach(item => {
        item.style.cssText = 'display: none !important; visibility: hidden !important; position: absolute !important; left: -9999px !important; opacity: 0 !important; pointer-events: none !important; height: 0 !important; width: 0 !important; overflow: hidden !important;';
        item.setAttribute('data-hidden', 'true');
        item.setAttribute('data-color-secondary', 'true');
        const cb = item.querySelector('input[type="checkbox"]');
        if (cb) {
          cb.checked = false; // Ensure secondary checkboxes are unchecked
        }
      });

      const primaryCheckbox = primary.querySelector('input[type="checkbox"]');
      if (primaryCheckbox && !primaryCheckbox.dataset._mobileInterceptEnabled) {
        primaryCheckbox.dataset._mobileInterceptEnabled = 'true';
        
        primaryCheckbox.addEventListener('change', function() {
          const isChecked = this.checked;
          duplicates.forEach(item => {
            const cb = item.querySelector('input[type="checkbox"]');
            if (cb) {
              cb.checked = isChecked;
            }
          });
          setTimeout(groupMobileColors, 500);
        });
      }
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', groupMotherColors);
  } else {
    groupMotherColors();
  }

  // Re-run after short delays
  setTimeout(groupMotherColors, 100);
  setTimeout(groupMotherColors, 500);

  // Re-run on AJAX updates (for pagination and filter changes)
  document.addEventListener('theme:collection:updated', () => {
    setTimeout(groupMotherColors, 100);
    setTimeout(groupMotherColors, 500);
  });

  // Watch for mobile drawer opening (ONLY for mobile)
  function observeMobileDrawer() {
    const drawerPanels = document.querySelectorAll('[data-filter-drawer-panel]');
    drawerPanels.forEach(panel => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'aria-hidden') {
            const isOpen = panel.getAttribute('aria-hidden') === 'false';
            if (isOpen) {
              setTimeout(groupMobileColors, 50);
              setTimeout(groupMobileColors, 200);
            }
          }
        });
      });
      
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });
    });
  }

  setTimeout(observeMobileDrawer, 1000);

})();
