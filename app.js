// Repository data - 20 repos (.NET first, then Python, then Java)
const REPOS = [
  // .NET repositories (14)
  { name: 'contoso/WebPortal', lang: '.NET', size: '1.2 GB', stars: '3.2k', solutions: 6, projects: 18 },
  { name: 'contoso/PaymentService', lang: '.NET', size: '480 MB', stars: '1.8k', solutions: 3, projects: 9 },
  { name: 'contoso/IdentityServer', lang: '.NET', size: '320 MB', stars: '2.1k', solutions: 2, projects: 7 },
  { name: 'contoso/OrderManagement', lang: '.NET', size: '890 MB', stars: '1.4k', solutions: 4, projects: 12 },
  { name: 'contoso/NotificationHub', lang: '.NET', size: '210 MB', stars: '980', solutions: 2, projects: 5 },
  { name: 'contoso/ReportingEngine', lang: '.NET', size: '1.5 GB', stars: '2.4k', solutions: 5, projects: 14 },
  { name: 'contoso/CustomerAPI', lang: '.NET', size: '340 MB', stars: '1.6k', solutions: 2, projects: 6 },
  { name: 'contoso/InventoryTracker', lang: '.NET', size: '560 MB', stars: '1.1k', solutions: 3, projects: 8 },
  { name: 'contoso/DataMigration', lang: '.NET', size: '180 MB', stars: '720', solutions: 1, projects: 4 },
  { name: 'contoso/AuditLogger', lang: '.NET', size: '95 MB', stars: '540', solutions: 1, projects: 3 },
  { name: 'contoso/SearchService', lang: '.NET', size: '410 MB', stars: '1.3k', solutions: 2, projects: 7 },
  { name: 'contoso/ConfigManager', lang: '.NET', size: '120 MB', stars: '890', solutions: 1, projects: 3 },
  { name: 'contoso/FileProcessor', lang: '.NET', size: '270 MB', stars: '1.0k', solutions: 2, projects: 5 },
  { name: 'contoso/SchedulerWorker', lang: '.NET', size: '150 MB', stars: '670', solutions: 1, projects: 4 },
  // Python repositories (3)
  { name: 'contoso/ml-pipeline', lang: 'Python', size: '2.3 GB', stars: '4.1k', solutions: 3, projects: 9 },
  { name: 'contoso/data-analytics', lang: 'Python', size: '780 MB', stars: '2.8k', solutions: 2, projects: 6 },
  { name: 'contoso/automation-scripts', lang: 'Python', size: '45 MB', stars: '1.2k', solutions: 1, projects: 2 },
  // Java repositories (3)
  { name: 'contoso/legacy-gateway', lang: 'Java', size: '1.8 GB', stars: '3.5k', solutions: 4, projects: 11 },
  { name: 'contoso/batch-processor', lang: 'Java', size: '920 MB', stars: '2.2k', solutions: 3, projects: 8 },
  { name: 'contoso/message-broker', lang: 'Java', size: '640 MB', stars: '1.9k', solutions: 2, projects: 6 }
];

let state = {
  phase: 'init',
  checkpoints: {},
  assessments: {},
  transformations: {},
  currentIndex: -1,
  paused: false,
  pausedAt: -1,
  msgCount: 0
};

REPOS.forEach((_, i) => { state.checkpoints[i] = false; });

function init() {
  renderRightPanel();
  startWelcomeFlow();
}

function startWelcomeFlow() {
  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Welcome! I'm the Repository Discovery & Assessment Agent. I can help you with:</p>
<ul>
  <li><strong>Discovering</strong> repositories from GitHub organizations</li>
  <li><strong>Assessing</strong> repository complexity, dependencies, and migration readiness</li>
  <li><strong>Transforming</strong> your code to modern architectures</li>
</ul>
<p>You can also tell me your preferences here in chat. For example:</p>
<ul>
  <li>Type a <strong>GitHub URL</strong> or organization to discover repos</li>
  <li>Or type <strong>"quickstart"</strong> with your preferences to run the full pipeline automatically</li>
</ul>`);

  addActionButtons([
    { label: 'Code Connector', class: 'blue', action: 'connect' },
    { label: 'Git Search', class: 'blue', action: 'search' },
    { label: 'GitHub Link', class: 'blue', action: 'github' },
    { label: 'Direct Upload', class: 'outline', action: 'upload' }
  ]);

  setTimeout(() => simulateUpload(), 1500);
}

function simulateUpload() {
  addUserMsg('Discover repositories from contoso GitHub organization');

  setTimeout(() => {
    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Scanning GitHub for repositories...</p>
<div class="progress-indicator"><span class="spinner"></span> Fetching...</div>`);
    setTimeout(() => completeDiscovery(), 2000);
  }, 800);
}

function completeDiscovery() {
  state.phase = 'discovered';

  document.getElementById('discoverBadge').style.display = 'inline-block';
  document.getElementById('assessBadge').style.display = 'inline-block';

  let tableRows = '';
  REPOS.forEach((repo, i) => {
    tableRows += `
      <tr>
        <td><a class="repo-link" href="#">${repo.name}</a></td>
        <td>${repo.size}</td>
        <td>${repo.lang}</td>
        <td>${repo.solutions}</td>
        <td>${repo.projects}</td>
      </tr>`;
  });

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking">Show thinking &#9662;</span></p>
<p>I found <strong>20 repositories</strong> in your upload:</p>
<table class="discovery-table">
  <thead><tr><th>Project</th><th>Size</th><th>Language</th><th>Solutions</th><th>Projects</th></tr></thead>
  <tbody>${tableRows}</tbody>
</table>`);

  addAgentMsg(`<div class="file-card">
  <div class="file-card-icon">&#128196;</div>
  <div class="file-card-info">
    <div class="file-card-name">discovery_report.json</div>
    <div class="file-card-meta">Generated at ${new Date().toLocaleTimeString()} • 20 repositories</div>
  </div>
  <button class="file-card-action">Download</button>
</div>`);

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Which repositories would you like to assess? You can say:</p>
<ul>
  <li>assess <strong>all</strong> repos</li>
  <li>assess only specific repos by name</li>
  <li>assess first N repos</li>
</ul>
<p>Or <strong>select from the panel on the right</strong>.</p>`);

  addActionButtons([
    { label: 'assess all .NET repos', class: 'blue', action: 'assessAll' }
  ]);

  updateRightPanelDiscovery();
  scrollChat();
}

// ============ ASSESSMENT ============

function assessAll() {
  state.phase = 'assessing';

  addUserMsg('assess all .NET repos');

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; Selected 20 repositories for assessment.</p>
<p>Starting assessment now...</p>`);

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking">Show thinking &#9662;</span></p>
<p>Assessment is underway for all repositories.</p>`);

  updateSidebarAssessing();
  // Hide right panel during assessment (matches video)
  document.getElementById('rightPanel').style.display = 'none';
  scrollChat();

  setTimeout(() => assessNext(0), 800);
}

function assessNext(index) {
  if (index >= REPOS.length) {
    completeAllAssessments();
    return;
  }
  state.currentIndex = index;
  const duration = 300 + Math.random() * 500;
  setTimeout(() => completeAssessment(index), duration);
}

function completeAssessment(index) {
  const complexity = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
  const deps = Math.floor(Math.random() * 150) + 10;
  const issues = Math.floor(Math.random() * 12);
  const readiness = Math.floor(Math.random() * 40) + 60;
  state.assessments[index] = { complexity, deps, issues, readiness };

  const assessed = Object.keys(state.assessments).length;
  if (assessed === 10) {
    addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking">Show thinking &#9662;</span></p>
<p>&#9989; Assessment progress: 50% (${assessed}/${REPOS.length} total). Elapsed: ${Math.floor(assessed * 1.2)}s</p>`);
  }

  scrollChat();
  setTimeout(() => assessNext(index + 1), 150);
}

function completeAllAssessments() {
  state.phase = 'assessed';
  state.currentIndex = -1;

  const assessed = Object.keys(state.assessments).length;
  const high = Object.values(state.assessments).filter(a => a.complexity === 'High').length;
  const med = Object.values(state.assessments).filter(a => a.complexity === 'Medium').length;
  const low = Object.values(state.assessments).filter(a => a.complexity === 'Low').length;

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking">Show thinking &#9662;</span></p>
<p>&#9989; Assessment complete for ${assessed} repositories!</p>`);

  // Summary table in chat (matches video)
  let rows = '';
  REPOS.forEach((repo, i) => {
    const a = state.assessments[i];
    const complexColor = a.complexity === 'High' ? 'color:#f87171' : a.complexity === 'Medium' ? 'color:#fbbf24' : 'color:#34d399';
    rows += `<tr>
      <td>${repo.name.split('/')[1]}</td>
      <td style="${complexColor};font-weight:600">${a.complexity}</td>
      <td>${a.readiness}%</td>
    </tr>`;
  });

  addAgentMsg(`<div class="assessment-card">
  <h4>Assessment Summary</h4>
  <table>
    <thead><tr><th>Repository</th><th>Complexity</th><th>Readiness</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>`);

  addAgentMsg(`<p>&#128200; <strong>Portfolio Overview • Risk Level: LOW-MEDIUM</strong> — No critical or high-risk blockers. Repositories are small, low-complexity projects with limited external dependencies.</p>
<p>&#9888; <strong>Non-upgradeable APIs</strong> (e.g. <code>p/v_build</code>) — 0.1% flagged as not upgradeable in the top-level project (test/UO). This is the largest technical debt item in the portfolio and requires code-level remediation before the solution can be considered fully cloud-ready.</p>
<p>Before starting transformation, you can configure <strong>checkpoints</strong> on individual repos. When a checkpoint is enabled, the agent will pause <em>after</em> transforming that repo so you can review the results before it continues to the next one.</p>
<p>Review and configure checkpoints in the right panel, then start transformation when ready.</p>`);

  addActionButtons([
    { label: 'Review transform checkpoints', class: 'green', action: 'showGlobalPlan' },
    { label: 'Transform all automatically', class: 'blue', action: 'transformAllAuto' },
    { label: 'Re-assess', class: 'outline', action: 'reassess' }
  ]);

  document.getElementById('assessBadge').className = 'step-badge completed';
  document.getElementById('assessBadge').textContent = 'Completed';

  // Show right panel with assessment summary (matches video)
  document.getElementById('rightPanel').style.display = 'flex';
  updateRightPanelAssessmentComplete();
  scrollChat();
}

// ============ GLOBAL PLAN + CHECKPOINTS ============

function showGlobalPlan() {
  addUserMsg('Transform all');

  state.phase = 'planning';

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#9889; Global Plan is ready — <a href="#" onclick="return false">review it in the right panel</a></p>
<p>Key highlights:</p>
<ul>
  <li>&#10003; Complexity: Low-Medium</li>
  <li>&#10003; Estimated total: based on parallel processing</li>
  <li>&#9888; Recommendation: 1 repo(s) have medium/high complexity; for these, consider using <strong>AWS Toolkit for Visual Studio</strong> with the .NET Upgrade Assistant for a more interactive transformation experience with better control over complex migrations.</li>
</ul>
<p>You can:</p>
<ul>
  <li>Edit the plan directly in the panel</li>
  <li>Ask me to adjust — e.g. "skip type 0" or "transform only the .NET ones"</li>
  <li>Start transformation when ready</li>
</ul>`);

  addActionButtons([
    { label: 'Start transformation', class: 'green', action: 'startTransform' }
  ]);

  const prepBadge = document.getElementById('prepareBadge');
  prepBadge.style.display = 'inline-block';
  prepBadge.className = 'step-badge completed';
  prepBadge.textContent = 'Completed';

  // Right panel shows Global Plan with checkpoint toggles
  updateRightPanelGlobalPlan();
  scrollChat();
}

// ============ TRANSFORMATION ============

function transformAllAuto() {
  addUserMsg('Transform all automatically');

  // Clear all checkpoints
  REPOS.forEach((_, i) => { state.checkpoints[i] = false; });

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; Skipping checkpoint configuration. All repositories will be transformed automatically without pausing.</p>`);

  const prepBadge = document.getElementById('prepareBadge');
  prepBadge.style.display = 'inline-block';
  prepBadge.className = 'step-badge completed';
  prepBadge.textContent = 'Completed';

  scrollChat();
  setTimeout(() => startTransformation(), 800);
}

function startTransformation() {
  state.phase = 'transforming';

  addUserMsg('Start transformation');

  const repoList = REPOS.map(r => r.name.split('/')[1]).join(', ');

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Starting .NET transformation — rev8.0 (${REPOS.length} repo(s)):</p>
<ul>
  ${REPOS.slice(0, 5).map(r => `<li>${r.name.split('/')[1]}</li>`).join('')}
  <li>... and ${REPOS.length - 5} more</li>
</ul>
<p>I'll send progress updates as each solution completes.</p>`);

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking">Show thinking &#9662;</span></p>
<p>Transformation is underway for all repositories!</p>`);

  const transformBadge = document.getElementById('transformBadge');
  transformBadge.style.display = 'inline-block';
  transformBadge.className = 'step-badge in-progress';
  transformBadge.textContent = 'In progress';

  updateRightPanelTransforming(0);
  scrollChat();
  setTimeout(() => transformNext(0), 1000);
}

function transformNext(index) {
  if (index >= REPOS.length) {
    completeAllTransformations();
    return;
  }

  state.currentIndex = index;
  updateRightPanelTransforming(index);
  runTransformation(index);
}

function runTransformation(index) {
  const duration = 1200 + Math.random() * 2000;
  setTimeout(() => completeTransformation(index), duration);
}

function completeTransformation(index) {
  const repo = REPOS[index];
  const filesChanged = Math.floor(Math.random() * 80) + 5;
  const testsPass = Math.random() > 0.15;

  state.transformations[index] = { filesChanged, testsPass };

  const transformed = Object.keys(state.transformations).length;

  // If checkpoint is enabled, pause after completion
  if (state.checkpoints[index]) {
    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#9989; <strong>${repo.name.split('/')[1]}</strong> — transformation complete</p>
<ul>
  <li>Files changed: <strong>${filesChanged}</strong></li>
  <li>Tests: ${testsPass ? '<span style="color:#34d399">&#9989; All passing</span>' : '<span style="color:#fbbf24">&#9888; Needs review</span>'}</li>
</ul>
<p>Checkpoint reached. Review the results before continuing.</p>`);

    state.paused = true;
    state.pausedAt = index;

    addActionButtons([
      { label: 'Continue to next repo', class: 'green', action: 'continueAfter' },
      { label: 'View changes', class: 'blue', action: 'viewRepoChanges' }
    ]);

    updateRightPanelTransforming(index);
    scrollChat();
    return;
  }

  // Progress messages
  if (transformed % 5 === 0) {
    addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking">Show thinking &#9662;</span></p>
<p>&#9889; Progress: ${transformed}/${REPOS.length}. Last: <strong>${repo.name.split('/')[1]}</strong> — ${filesChanged} files, tests ${testsPass ? '&#9989;' : '&#9888;'}.</p>`);
  }

  updateRightPanelTransforming(index + 1);
  scrollChat();
  setTimeout(() => transformNext(index + 1), 300);
}

function continueAfterCheckpoint() {
  if (!state.paused) return;
  state.paused = false;
  const idx = state.pausedAt;

  addUserMsg('Continue to next repo');
  addAgentMsg(`<p><strong>AWS Transform</strong></p><p>Continuing transformation pipeline...</p>`);

  updateRightPanelTransforming(idx + 1);
  scrollChat();
  setTimeout(() => transformNext(idx + 1), 600);
}

function completeAllTransformations() {
  state.phase = 'complete';
  state.currentIndex = -1;

  const transformed = Object.keys(state.transformations).length;
  const passing = Object.values(state.transformations).filter(t => t.testsPass).length;
  const totalFiles = Object.values(state.transformations).reduce((s, t) => s + t.filesChanged, 0);

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#9889; Transformation complete!</p>
<ul>
  <li>Repositories transformed: <strong>${transformed}</strong></li>
  <li>Tests passing: <strong style="color:#34d399">${passing}/${transformed}</strong></li>
  <li>Total files modified: <strong>${totalFiles}</strong></li>
</ul>
<p>All transformations have been applied. You can review changes in each repository or download a consolidated report.</p>`);

  const transformBadge = document.getElementById('transformBadge');
  transformBadge.className = 'step-badge completed';
  transformBadge.textContent = 'Completed';

  updateRightPanelTransformComplete();
  scrollChat();
}

// ============ UI Helpers ============

function addAgentMsg(html) {
  state.msgCount++;
  const chatArea = document.getElementById('chatArea');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg';
  msgDiv.innerHTML = `
    <div class="chat-msg-header">
      <div class="chat-msg-avatar agent">&#9670;</div>
      <span class="chat-msg-name">AWS Transform</span>
      <span class="chat-msg-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
    </div>
    <div class="chat-msg-body">${html}</div>`;
  chatArea.appendChild(msgDiv);
  scrollChat();
}

function addUserMsg(text) {
  const chatArea = document.getElementById('chatArea');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg';
  msgDiv.innerHTML = `
    <div class="chat-msg-header">
      <div class="chat-msg-avatar user">&#9679;</div>
      <span class="chat-msg-name">You</span>
      <span class="chat-msg-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
    </div>
    <div class="chat-msg-body"><p>${text}</p></div>`;
  chatArea.appendChild(msgDiv);
  scrollChat();
}

function addActionButtons(buttons) {
  const chatArea = document.getElementById('chatArea');
  const btnDiv = document.createElement('div');
  btnDiv.className = 'chat-msg';
  btnDiv.style.marginLeft = '36px';
  let btnsHtml = '<div class="chat-action-buttons">';
  buttons.forEach(b => {
    btnsHtml += `<button class="chat-action-btn ${b.class}" onclick="handleAction('${b.action}')">${b.label}</button>`;
  });
  btnsHtml += '</div>';
  btnDiv.innerHTML = btnsHtml;
  chatArea.appendChild(btnDiv);
  scrollChat();
}

function handleAction(action) {
  switch(action) {
    case 'assessAll': assessAll(); break;
    case 'showGlobalPlan': showGlobalPlan(); break;
    case 'startTransform': startTransformation(); break;
    case 'transformAllAuto': transformAllAuto(); break;
    case 'continueAfter': continueAfterCheckpoint(); break;
    case 'viewRepoChanges':
      if (state.paused && state.transformations[state.pausedAt]) {
        const repo = REPOS[state.pausedAt];
        const t = state.transformations[state.pausedAt];
        addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Changes for <strong>${repo.name.split('/')[1]}</strong>:</p>
<ul>
  <li>Files modified: ${t.filesChanged}</li>
  <li>Tests: ${t.testsPass ? 'All passing' : 'Some need review'}</li>
  <li>Framework upgraded to latest target</li>
  <li>Deprecated APIs replaced</li>
  <li>Dependency versions updated</li>
</ul>
<p>Click <strong>"Continue to next repo"</strong> when ready.</p>`);
      }
      break;
    default: break;
  }
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  handleChatText(text);
}

function handleChatInput(event) {
  if (event.key === 'Enter') sendChat();
}

function handleChatText(text) {
  addUserMsg(text);
  const lower = text.toLowerCase();

  if (state.paused) {
    if (lower.includes('continue') || lower.includes('next') || lower.includes('yes') || lower.includes('proceed')) {
      continueAfterCheckpoint();
    } else {
      const repo = REPOS[state.pausedAt];
      addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Transformation of <strong>${repo.name.split('/')[1]}</strong> is complete. Type <strong>"continue"</strong> to proceed to the next repo.</p>`);
    }
  } else if (state.phase === 'discovered') {
    if (lower.includes('assess')) {
      assessAll();
    } else {
      addAgentMsg(`<p><strong>AWS Transform</strong></p><p>Would you like to assess all repositories?</p>`);
    }
  } else if (state.phase === 'assessed') {
    if (lower.includes('transform')) {
      showGlobalPlan();
    } else {
      addAgentMsg(`<p><strong>AWS Transform</strong></p><p>Assessment is complete. Say <strong>"transform all"</strong> to proceed.</p>`);
    }
  } else if (state.phase === 'planning') {
    if (lower.includes('start') || lower.includes('go') || lower.includes('begin')) {
      startTransformation();
    } else {
      addAgentMsg(`<p><strong>AWS Transform</strong></p><p>Global plan is ready. Say <strong>"start"</strong> to begin transformation.</p>`);
    }
  } else if (state.phase === 'init') {
    simulateUpload();
  } else {
    addAgentMsg(`<p><strong>AWS Transform</strong></p><p>I'm currently processing. I'll update you when complete or when a checkpoint is reached.</p>`);
  }
  scrollChat();
}

function scrollChat() {
  const chatArea = document.getElementById('chatArea');
  chatArea.scrollTop = chatArea.scrollHeight;
}

// ============ Sidebar ============

function toggleStep(header) {
  const body = header.nextElementSibling;
  if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function updateSidebarAssessing() {
  const substeps = document.getElementById('assessSubsteps');
  substeps.innerHTML = `<div class="substep"><span class="substep-icon active">&#8230;</span><span>General assessment</span></div>`;
}

// ============ Right Panel ============

function renderRightPanel() {
  document.getElementById('rightPanelTitle').textContent = '';
  document.getElementById('rightPanelContent').innerHTML = '';
}

function updateRightPanelDiscovery() {
  document.getElementById('rightPanel').style.display = 'flex';
  document.getElementById('rightPanelTitle').textContent = `Discovered Repositories (${REPOS.length})`;
  const content = document.getElementById('rightPanelContent');

  let rows = REPOS.map((r, i) => `
    <tr>
      <td><input type="checkbox" checked disabled></td>
      <td>${r.name.split('/')[1]}</td>
      <td>${r.lang}</td>
      <td>${r.size}</td>
    </tr>`).join('');

  content.innerHTML = `
    <div class="rp-filters">
      <span class="rp-filter-label">Total Repositories</span>
      <span class="rp-filter-label">Languages</span>
    </div>
    <div class="rp-filter-bar">
      <span class="filter-chip active">.NET (14)</span>
      <span class="filter-chip">Python (3)</span>
      <span class="filter-chip">Java (3)</span>
    </div>
    <table class="rp-table">
      <thead><tr><th>Select</th><th>Repository</th><th>Language</th><th>Size</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <button class="rp-confirm-btn" onclick="handleAction('assessAll')">Confirm selection</button>`;
}

function updateRightPanelAssessmentComplete() {
  document.getElementById('rightPanelTitle').textContent = 'Assessment Summary';
  const content = document.getElementById('rightPanelContent');

  const high = Object.values(state.assessments).filter(a => a.complexity === 'High').length;
  const med = Object.values(state.assessments).filter(a => a.complexity === 'Medium').length;
  const low = Object.values(state.assessments).filter(a => a.complexity === 'Low').length;

  let rows = REPOS.map((r, i) => {
    const a = state.assessments[i];
    const complexColor = a.complexity === 'High' ? 'color:#f87171' : a.complexity === 'Medium' ? 'color:#fbbf24' : 'color:#34d399';
    return `<tr><td>${r.name.split('/')[1]}</td><td style="${complexColor}">${a.complexity}</td><td>${a.readiness}%</td></tr>`;
  }).join('');

  content.innerHTML = `
    <div class="rp-stats-row">
      <div class="rp-stat"><span class="rp-stat-val">${REPOS.length}</span><span class="rp-stat-lbl">Total Repos</span></div>
      <div class="rp-stat"><span class="rp-stat-val green">${low}</span><span class="rp-stat-lbl">Linux Ready</span></div>
      <div class="rp-stat"><span class="rp-stat-val yellow">${med}</span><span class="rp-stat-lbl">Changes Needed</span></div>
      <div class="rp-stat"><span class="rp-stat-val red">${high}</span><span class="rp-stat-lbl">Major Effort</span></div>
    </div>
    <table class="rp-table">
      <thead><tr><th>Repository</th><th>Complexity</th><th>Readiness</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function updateRightPanelGlobalPlan() {
  document.getElementById('rightPanelTitle').textContent = 'Global plan';
  const content = document.getElementById('rightPanelContent');

  let rows = REPOS.map((r, i) => {
    const a = state.assessments[i];
    return `<tr>
      <td>${r.name.split('/')[1]}</td>
      <td>${a.complexity}</td>
      <td>Auto-upgrade</td>
      <td>
        <label class="toggle-switch">
          <input type="checkbox" id="chk-${i}" onchange="toggleCheckpoint(${i})" ${state.checkpoints[i] ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </td>
    </tr>`;
  }).join('');

  content.innerHTML = `
    <p class="rp-desc">Review transformation plan and configure checkpoints before starting.</p>
    <table class="rp-table">
      <thead><tr><th>Repo</th><th>Complexity</th><th>Strategy</th><th>Checkpoint</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="rp-section-block">
      <h4>Transformation Phases</h4>
      <p><strong>Phase 1:</strong> Project File Migration</p>
      <p><strong>Phase 2:</strong> Dependency Updates</p>
      <p><strong>Phase 3:</strong> Code Transformations</p>
      <p><strong>Phase 4:</strong> Validation</p>
    </div>
    <div class="rp-section-block">
      <h4>Estimated Total Time</h4>
      <p>Low complexity repos: ~15 min each</p>
      <p>Medium complexity repos: ~30 min each</p>
      <p>High complexity repos: ~45 min each</p>
      <p><strong>Overall: ~15 min with parallel processing</strong></p>
    </div>
    <div class="rp-bottom-btns">
      <button class="rp-approve-btn" onclick="handleAction('startTransform')">Approve and start</button>
    </div>`;
}

function toggleCheckpoint(index) {
  state.checkpoints[index] = document.getElementById(`chk-${index}`).checked;
}

function updateRightPanelTransforming(currentIdx) {
  const activeRepo = currentIdx < REPOS.length ? REPOS[currentIdx] : null;
  const repoName = activeRepo ? activeRepo.name.split('/')[1] : '';

  document.getElementById('rightPanelTitle').textContent = activeRepo ? `${repoName}` : 'Transformation';
  const content = document.getElementById('rightPanelContent');

  const transformed = Object.keys(state.transformations).length;
  const startTime = '6/10/2026, 1:35 PM';

  // Build phases list with status for each repo
  let phasesHtml = REPOS.map((r, i) => {
    const name = r.name.split('/')[1];
    const hasCheckpoint = state.checkpoints[i];
    let status, dot;
    if (state.transformations[i]) {
      const t = state.transformations[i];
      status = t.testsPass ? 'Complete' : 'Needs review';
      dot = t.testsPass ? 'green' : 'yellow';
    } else if (i === currentIdx) {
      status = 'In progress';
      dot = 'blue';
    } else {
      status = 'Pending';
      dot = 'gray';
    }
    const checkpointIcon = hasCheckpoint ? ' <span class="checkpoint-indicator">&#9632;</span>' : '';
    return `<div class="rp-phase-item"><span class="rp-dot ${dot}"></span><span>${name}${checkpointIcon}</span><span class="rp-phase-status">${status}</span></div>`;
  }).join('');

  content.innerHTML = `
    <div class="rp-detail-section">
      <div class="rp-detail-row"><span class="rp-detail-lbl">Status</span><span class="rp-detail-val">In progress</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Started</span><span class="rp-detail-val">${startTime}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Progress</span><span class="rp-detail-val">${transformed}/${REPOS.length}</span></div>
    </div>
    <div class="rp-section-block">
      <h4>Transformation attempts (1)</h4>
      <table class="rp-table rp-attempts-table">
        <thead><tr><th>Status</th><th>Created</th><th>Duration</th></tr></thead>
        <tbody><tr><td><span class="table-status running">In progress</span></td><td>${startTime}</td><td>0%</td></tr></tbody>
      </table>
    </div>
    <div class="rp-section-block">
      <h4>Phases</h4>
      <div class="rp-phases-list">${phasesHtml}</div>
    </div>
    <div class="rp-section-block">
      <h4>Artifacts (${transformed})</h4>
      <p class="rp-muted">${transformed > 0 ? transformed + ' artifacts produced so far.' : 'No artifacts produced yet.'}</p>
    </div>`;
}

function updateRightPanelTransformComplete() {
  const transformed = Object.keys(state.transformations).length;
  const passing = Object.values(state.transformations).filter(t => t.testsPass).length;

  document.getElementById('rightPanelTitle').textContent = 'Transformation Complete';
  const content = document.getElementById('rightPanelContent');

  let phasesHtml = REPOS.map((r, i) => {
    const name = r.name.split('/')[1];
    const hasCheckpoint = state.checkpoints[i];
    const t = state.transformations[i];
    let dot = 'gray';
    let status = 'Skipped';
    if (t) {
      dot = t.testsPass ? 'green' : 'yellow';
      status = t.testsPass ? 'Complete' : 'Needs review';
    }
    const checkpointIcon = hasCheckpoint ? ' <span class="checkpoint-indicator">&#9632;</span>' : '';
    return `<div class="rp-phase-item"><span class="rp-dot ${dot}"></span><span>${name}${checkpointIcon}</span><span class="rp-phase-status">${status}</span></div>`;
  }).join('');

  content.innerHTML = `
    <div class="rp-detail-section">
      <div class="rp-detail-row"><span class="rp-detail-lbl">Status</span><span class="rp-detail-val" style="color:#34d399">Complete</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Transformed</span><span class="rp-detail-val">${transformed}/${REPOS.length}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Tests passing</span><span class="rp-detail-val">${passing}/${transformed}</span></div>
    </div>
    <div class="rp-section-block">
      <h4>Results</h4>
      <div class="rp-phases-list">${phasesHtml}</div>
    </div>`;
}

init();
