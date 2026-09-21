// «Свет за курсором»: у элементов с [data-light] тени падают в сторону от указателя.
// Только для устройств с точным указателем и без просьбы уменьшить движение.

const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (finePointer.matches && !reducedMotion.matches) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-light]')) {
    let frame = 0;

    el.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        // Вектор от указателя (источника света) к центру элемента, −1…1
        const dx = (rect.left + rect.width / 2 - event.clientX) / (rect.width / 2);
        const dy = (rect.top + rect.height / 2 - event.clientY) / (rect.height / 2);
        const length = Math.hypot(dx, dy) || 1;
        // Длина тени растёт от центра к краю; на диагонали совпадает с исходной (1, 1)
        const scale = (Math.SQRT2 * Math.min(1, length)) / length;
        el.style.setProperty('--lx', (dx * scale).toFixed(3));
        el.style.setProperty('--ly', (dy * scale).toFixed(3));
      });
    });

    el.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      el.style.removeProperty('--lx');
      el.style.removeProperty('--ly');
    });
  }
}

export {};
