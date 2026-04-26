/**
 * Find Your Build — 3-step configurator (live update)
 * Reads: vehicle type → concern → budget → live recommendation
 */

const RESULTS = {
  protection: {
    budget: {
      title: 'Deep Exterior Detailing',
      desc: 'Hand wash, clay bar, machine polish & spray sealant. The essential reset for any car.'
    },
    mid: {
      title: 'Ceramic Sealant Package',
      desc: 'Paint decontamination + 3M Midnight Ceramic sealant. Hydrophobic gloss that lasts 12 months.'
    },
    premium: {
      title: 'Full Ceramic Coating',
      desc: 'Gyeon Quartz C.ONE coating — 5H hardness, 2-year manufacturer warranty. Deep gloss, zero maintenance.'
    },
    ultra: {
      title: 'XPEL PPF + Ceramic Pro 9H',
      desc: 'Full body XPEL Ultimate Plus PPF with Ceramic Pro 9H on top. The gold standard in paint protection.'
    }
  },
  appearance: {
    budget: {
      title: 'Interior + Exterior Detailing',
      desc: 'Full in-out detail — steam cleaning, odour treatment, machine polish & finishing wax.'
    },
    mid: {
      title: 'Paint Correction + Sealant',
      desc: 'Two-stage machine correction to remove swirls, scratches & oxidation. Finished with ceramic sealant.'
    },
    premium: {
      title: 'Paint Correction + Ceramic Coating',
      desc: 'Three-stage correction to unlock true depth. Topped with Gyeon Quartz for 3 years of showroom finish.'
    },
    ultra: {
      title: 'Signature Detailing Package',
      desc: 'Complete paint restoration, full ceramic coating, leather conditioning, and glass treatment.'
    }
  },
  customization: {
    budget: {
      title: 'Accent Wrap & Trim Work',
      desc: 'Roof, spoiler, or mirror cap in any colour. Chrome delete option available.'
    },
    mid: {
      title: 'Partial Colour Wrap',
      desc: 'Hood, roof, or bumper wrap in any 3M/Avery colour. Fully reversible.'
    },
    premium: {
      title: 'Full Colour Wrap',
      desc: 'Complete vehicle wrap in Matte, Satin, Gloss, or specialty finishes. 5-year durability.'
    },
    ultra: {
      title: 'Custom Build Package',
      desc: 'Full wrap + chrome delete + accent stripes + custom interior touches. Your car, completely reimagined.'
    }
  },
  performance: {
    budget: {
      title: 'Engine Bay Detail + Filter Clean',
      desc: 'Engine bay degreasing, air filter cleaning, and performance check.'
    },
    mid: {
      title: 'ECU Remap — Stage 1',
      desc: 'Software tune for optimised power and torque. Up to 20% more performance on most cars.'
    },
    premium: {
      title: 'Stage 2 Performance Package',
      desc: 'ECU remap + intake upgrade + exhaust tune. Engineered for your specific model.'
    },
    ultra: {
      title: 'Full Performance Build',
      desc: 'Stage 3 remap, forced induction upgrades, suspension setup, and track-ready alignment.'
    }
  }
};

function initConfigurator() {
  const root = document.getElementById('configurator');
  if (!root) return;

  const state = { 1: null, 2: null, 3: null };

  root.addEventListener('click', (e) => {
    // Reset button
    if (e.target.closest('#configReset')) {
      reset();
      return;
    }

    const btn = e.target.closest('.config-option');
    if (!btn) return;

    const step = parseInt(btn.dataset.step, 10);
    const value = btn.dataset.value;
    const label = btn.dataset.label || value;

    state[step] = value;

    // Mark selected within this step
    const stepEl = btn.closest('.config-step');
    stepEl.querySelectorAll('.config-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    stepEl.classList.add('answered');

    // Update step header value label
    const valEl = document.getElementById(`stepVal${step}`);
    if (valEl) valEl.textContent = label;

    // Live update result on every change
    updateResult();
  });

  function updateResult() {
    const concern = state[2];
    const budget = state[3];
    const resultEl = document.getElementById('configResult');
    if (!resultEl) return;

    if (!concern || !budget) {
      resultEl.classList.remove('has-result');
      return;
    }

    const result = RESULTS[concern]?.[budget];
    if (!result) return;

    document.getElementById('configResultTitle').textContent = result.title;
    document.getElementById('configResultDesc').textContent = result.desc;
    resultEl.classList.add('has-result');
  }

  function reset() {
    state[1] = null;
    state[2] = null;
    state[3] = null;

    root.querySelectorAll('.config-option').forEach(b => b.classList.remove('selected'));
    root.querySelectorAll('.config-step').forEach(s => s.classList.remove('answered'));

    ['stepVal1', 'stepVal2', 'stepVal3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });

    const resultEl = document.getElementById('configResult');
    if (resultEl) resultEl.classList.remove('has-result');
  }
}

document.addEventListener('DOMContentLoaded', initConfigurator);

