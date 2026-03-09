/**
 * Composable to prevent horizontal scroll on mobile
 * Usage: usePreventHorizontalScroll()
 */
export const usePreventHorizontalScroll = () => {
  const fixHorizontalScroll = () => {
    if (!process.client) return;

    // Force overflow hidden on all containers
    const containers = ['html', 'body', '#__nuxt', 'main', 'section', '.container'];
    containers.forEach(selector => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach(el => {
        el.style.setProperty('overflow-x', 'hidden', 'important');
        el.style.setProperty('max-width', '100vw', 'important');
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('box-sizing', 'border-box', 'important');
      });
    });

    // Fix all elements that are wider than viewport
    document.querySelectorAll<HTMLElement>('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > window.innerWidth || el.scrollWidth > window.innerWidth) {
        el.style.setProperty('max-width', '100%', 'important');
        el.style.setProperty('overflow-x', 'hidden', 'important');
        el.style.setProperty('box-sizing', 'border-box', 'important');
      }
    });

    // Fix tables specifically
    document.querySelectorAll<HTMLTableElement>('table').forEach(table => {
      table.style.setProperty('width', '100%', 'important');
      table.style.setProperty('max-width', '100%', 'important');

      const wrapper = table.parentElement;
      if (wrapper) {
        wrapper.style.setProperty('overflow-x', 'auto', 'important');
        wrapper.style.setProperty('max-width', '100%', 'important');
      }
    });

    console.log('✅ Horizontal scroll prevention applied');
  };

  // Apply fix on mount
  onMounted(() => {
    // Initial fix
    setTimeout(fixHorizontalScroll, 100);

    // Reapply on resize
    window.addEventListener('resize', fixHorizontalScroll);

    // Reapply on orientation change (mobile)
    window.addEventListener('orientationchange', () => {
      setTimeout(fixHorizontalScroll, 200);
    });
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', fixHorizontalScroll);
      window.removeEventListener('orientationchange', fixHorizontalScroll);
    }
  });

  return {
    fixHorizontalScroll
  };
};
