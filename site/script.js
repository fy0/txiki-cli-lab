const tabs = Array.from(document.querySelectorAll('.command-tab'));
const panels = Array.from(document.querySelectorAll('.command-panel'));
const revealNodes = document.querySelectorAll('.reveal');
const copyButtons = document.querySelectorAll('.copy-button');

function activatePanel(targetId) {
  tabs.forEach(tab => {
    const active = tab.dataset.panel === targetId;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  panels.forEach(panel => {
    const active = panel.id === targetId;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => activatePanel(tab.dataset.panel));
});

copyButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy ?? '';

    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = 'Copied';
      button.classList.add('copied');
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove('copied');
      }, 1200);
    } catch {
      button.textContent = 'Copy manually';
      window.setTimeout(() => {
        button.textContent = 'Copy command';
      }, 1200);
    }
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealNodes.forEach(node => observer.observe(node));
} else {
  revealNodes.forEach(node => node.classList.add('is-visible'));
}
