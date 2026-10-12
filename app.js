// PilotBridge demo app — vanilla JavaScript, sample data only
// No payments, no external services, no secrets.

let problems = [];
let providers = [];
let selectedProblemId = null;

// Load data when the page is ready
document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const problemsResponse = await fetch('data/problems.json');
    const providersResponse = await fetch('data/providers.json');
    problems = await problemsResponse.json();
    providers = await providersResponse.json();
    renderProblemButtons();
    setupEventListeners();
  } catch (err) {
    console.error('Could not load sample data', err);
    document.getElementById('problem-buttons').textContent =
      'Unable to load demonstration data. Please check that the data files are present.';
  }
}

function renderProblemButtons() {
  const container = document.getElementById('problem-buttons');
  container.innerHTML = ''; // safe clear
  problems.forEach(problem => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'problem-btn';
    btn.textContent = problem.title; // safe
    btn.dataset.id = problem.id;
    btn.addEventListener('click', () => selectProblem(problem.id));
    container.appendChild(btn);
  });
}

function selectProblem(id) {
  selectedProblemId = id;
  // Update button styles
  document.querySelectorAll('.problem-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.id === id);
  });

  // Populate purpose dropdown with the selected problem (and allow others for demo)
  const purposeSelect = document.getElementById('purpose');
  purposeSelect.innerHTML = '';
  problems.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.title;
    if (p.id === id) opt.selected = true;
    purposeSelect.appendChild(opt);
  });

  document.getElementById('questions-section').classList.remove('hidden');
  document.getElementById('results-section').classList.add('hidden');
}

function setupEventListeners() {
  document.getElementById('show-results').addEventListener('click', showResults);
  document.getElementById('reset-form').addEventListener('click', resetForm);
  document.getElementById('feedback-submit').addEventListener('click', demonstrateFeedback);
}

function showResults() {
  if (!selectedProblemId) return;

  const country = document.getElementById('country').value;
  const purpose = document.getElementById('purpose').value;
  const merchantCategory = document.getElementById('merchant-category').value;
  const paymentMethod = document.getElementById('payment-method').value;

  // Show possible explanations for the selected problem
  const problem = problems.find(p => p.id === selectedProblemId);
  const explanationsEl = document.getElementById('explanations');
  explanationsEl.innerHTML = '';
  if (problem && problem.possibleExplanations) {
    problem.possibleExplanations.forEach(text => {
      const div = document.createElement('div');
      div.className = 'explanation';
      div.textContent = text; // safe rendering
      explanationsEl.appendChild(div);
    });
  }

  // Filter sample providers
  const matches = providers.filter(provider => {
    const countryOk = provider.supportedCountries.includes(country);
    const purposeOk = provider.supportedPurposes.includes(purpose);
    const methodOk = provider.fundingMethods.includes(paymentMethod) || paymentMethod === 'other';
    // Merchant category is shown but used only as a soft hint in demo (not a hard filter)
    return countryOk && purposeOk && methodOk;
  });

  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '';

  if (matches.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'no-matches';
    msg.textContent = 'No sample options match these inputs. This is demonstration data only and does not mean no real options exist elsewhere.';
    resultsEl.appendChild(msg);
  } else {
    matches.forEach(provider => {
      const card = document.createElement('article');
      card.className = 'provider-card';

      const badge = document.createElement('div');
      badge.className = 'demo-badge';
      badge.textContent = provider.status; // always “DEMO — NOT A REAL PROVIDER”
      card.appendChild(badge);

      const title = document.createElement('h3');
      title.textContent = provider.displayName;
      card.appendChild(title);

      const limits = document.createElement('p');
      limits.textContent = 'Limitations: ' + provider.limitations;
      card.appendChild(limits);

      const fee = document.createElement('p');
      fee.textContent = 'Fee note: ' + provider.feeNote;
      card.appendChild(fee);

      const checked = document.createElement('p');
      checked.textContent = 'Last checked (demo): ' + provider.lastChecked;
      card.appendChild(checked);

      const note = document.createElement('p');
      note.textContent = 'No external link is provided. This is not a real provider.';
      card.appendChild(note);

      resultsEl.appendChild(card);
    });
  }

  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
  selectedProblemId = null;
  document.querySelectorAll('.problem-btn').forEach(btn => btn.classList.remove('selected'));
  document.getElementById('questions-section').classList.add('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('diagnosis-form').reset();
  document.getElementById('feedback-message').textContent = '';
  document.getElementById('country').value = 'NG';
}

function demonstrateFeedback() {
  const useful = document.getElementById('feedback-useful').value;
  const messageEl = document.getElementById('feedback-message');
  if (!useful) {
    messageEl.textContent = 'Please choose an option above. (Still not saved.)';
    return;
  }
  // Local demonstration only — nothing is sent or stored
  messageEl.textContent = 'Demonstration complete. Your feedback was not transmitted or saved anywhere.';
  document.getElementById('feedback-form').reset();
}