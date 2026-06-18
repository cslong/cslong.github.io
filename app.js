// Repository data - 20 repos (.NET first, then Python, then Java)
const REPOS = [
  // .NET repositories (14)
  { name: 'contoso/WebPortal', lang: '.NET', stars: '3.2k', solutions: 6, projects: 18 },
  { name: 'contoso/PaymentService', lang: '.NET', stars: '1.8k', solutions: 3, projects: 9 },
  { name: 'contoso/IdentityServer', lang: '.NET', stars: '2.1k', solutions: 2, projects: 7 },
  { name: 'contoso/OrderManagement', lang: '.NET', stars: '1.4k', solutions: 4, projects: 12 },
  { name: 'contoso/NotificationHub', lang: '.NET', stars: '980', solutions: 2, projects: 5 },
  { name: 'contoso/ReportingEngine', lang: '.NET', stars: '2.4k', solutions: 5, projects: 14 },
  { name: 'contoso/CustomerAPI', lang: '.NET', stars: '1.6k', solutions: 2, projects: 6 },
  { name: 'contoso/InventoryTracker', lang: '.NET', stars: '1.1k', solutions: 3, projects: 8 },
  { name: 'contoso/DataMigration', lang: '.NET', stars: '720', solutions: 1, projects: 4 },
  { name: 'contoso/AuditLogger', lang: '.NET', stars: '540', solutions: 1, projects: 3 },
  { name: 'contoso/SearchService', lang: '.NET', stars: '1.3k', solutions: 2, projects: 7 },
  { name: 'contoso/ConfigManager', lang: '.NET', stars: '890', solutions: 1, projects: 3 },
  { name: 'contoso/FileProcessor', lang: '.NET', stars: '1.0k', solutions: 2, projects: 5 },
  { name: 'contoso/SchedulerWorker', lang: '.NET', stars: '670', solutions: 1, projects: 4 },
  // Python repositories (3)
  { name: 'contoso/ml-pipeline', lang: 'Python', stars: '4.1k', solutions: 3, projects: 9 },
  { name: 'contoso/data-analytics', lang: 'Python', stars: '2.8k', solutions: 2, projects: 6 },
  { name: 'contoso/automation-scripts', lang: 'Python', stars: '1.2k', solutions: 1, projects: 2 },
  // Java repositories (3)
  { name: 'contoso/legacy-gateway', lang: 'Java', stars: '3.5k', solutions: 4, projects: 11 },
  { name: 'contoso/batch-processor', lang: 'Java', stars: '2.2k', solutions: 3, projects: 8 },
  { name: 'contoso/message-broker', lang: 'Java', stars: '1.9k', solutions: 2, projects: 6 }
];

let state = {
  phase: 'init',
  mode: 'interactive', // 'auto' or 'interactive'
  checkpoints: {},
  assessments: {},
  transformations: {},
  currentIndex: -1,
  paused: false,
  pausedAt: -1,
  msgCount: 0,
  thinkingVisible: false,
  thinkingActive: false
};

// Interactive mode: all checkpoints enabled by default (per design doc)
REPOS.forEach((_, i) => { state.checkpoints[i] = true; });

function init() {
  renderRightPanel();
  startWelcomeFlow();
  document.getElementById('chatInput').addEventListener('keydown', handleChatInput);
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
        <td>${repo.lang}</td>
        <td>${repo.solutions}</td>
        <td>${repo.projects}</td>
      </tr>`;
  });

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking" onclick="toggleThinkingPanel()">Show thinking &#9662;</span></p>
<p>I found <strong>20 repositories</strong> in your upload:</p>
<div class="table-search-container">
  <input type="text" class="table-search-input" placeholder="Search repositories..." oninput="filterDiscoveryTable(this)">
</div>
<table class="discovery-table" id="discoveryTable">
  <thead><tr><th>Project</th><th>Language</th><th>Solutions</th><th>Projects</th></tr></thead>
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

  // Show mode selection after discovery
  showModeSelection();

  updateRightPanelDiscovery();
  scrollChat();
}

// ============ MODE SELECTION ============

function showModeSelection() {
  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>How would you like to proceed with the assessment and transformation?</p>
<p style="font-size:11px;color:#6b8aaa;margin-bottom:8px">Note: Chat interaction is always available regardless of mode. This only controls checkpoint pausing behavior.</p>
<div class="mode-selection-card">
  <div class="mode-option ${state.mode === 'interactive' ? 'selected' : ''}" onclick="selectMode('interactive')">
    <div class="mode-option-header">
      <span class="mode-radio">${state.mode === 'interactive' ? '&#9679;' : '&#9675;'}</span>
      <strong>Interactive Mode</strong>
      <span class="mode-badge recommended">Default</span>
    </div>
    <p class="mode-desc">System pauses at defined checkpoints for your review before continuing. Transformation stops on error and waits for your decision.</p>
    <ul class="mode-features">
      <li>&#10003; All checkpoints enabled by default</li>
      <li>&#10003; Stops on error — you choose: continue, retry, or stop</li>
      <li>&#10003; Upload steering files at any checkpoint</li>
      <li>&#10003; Switch to autonomous at any checkpoint boundary</li>
    </ul>
  </div>
  <div class="mode-option ${state.mode === 'auto' ? 'selected' : ''}" onclick="selectMode('auto')">
    <div class="mode-option-header">
      <span class="mode-radio">${state.mode === 'auto' ? '&#9679;' : '&#9675;'}</span>
      <strong>Autonomous Mode</strong>
    </div>
    <p class="mode-desc">System runs through all phases end-to-end. Will not stop on error — errors are logged and a HITL task is created per failed repository, but other repos continue.</p>
    <ul class="mode-features">
      <li>&#10003; Auto-assess all .NET repos from discovery</li>
      <li>&#10003; Auto-transform all assessed repos</li>
      <li>&#10003; Errors create HITL tasks but don't block</li>
      <li>&#10003; Fastest overall execution</li>
    </ul>
  </div>
</div>`);

  addActionButtons([
    { label: 'Continue with Interactive Mode', class: 'green', action: 'confirmInteractive' },
    { label: 'Switch to Autonomous Mode', class: 'outline', action: 'confirmAuto' }
  ]);
}

function selectMode(mode) {
  state.mode = mode;
  const options = document.querySelectorAll('.mode-option');
  options.forEach(opt => {
    opt.classList.remove('selected');
    const radio = opt.querySelector('.mode-radio');
    radio.innerHTML = '&#9675;';
  });
  const selected = document.querySelector(`.mode-option:nth-child(${mode === 'interactive' ? 1 : 2})`);
  if (selected) {
    selected.classList.add('selected');
    selected.querySelector('.mode-radio').innerHTML = '&#9679;';
  }
}

function confirmMode(mode) {
  state.mode = mode;
  if (mode === 'auto') {
    // Autonomous: disable all checkpoints
    REPOS.forEach((_, i) => { state.checkpoints[i] = false; });
    addUserMsg('Use autonomous mode');
    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; <strong>Autonomous mode</strong> enabled. I'll run assessment and transformation end-to-end without pausing at checkpoints.</p>
<p>Proceeding to assess all .NET repositories automatically...</p>`);
    scrollChat();
    // Auto mode: automatically start assessment
    setTimeout(() => assessAll(), 1000);
  } else {
    // Interactive: enable all checkpoints
    REPOS.forEach((_, i) => { state.checkpoints[i] = true; });
    addUserMsg('Use interactive mode');
    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; <strong>Interactive mode</strong> enabled. All checkpoints are enabled by default — I'll pause after each repository for your review.</p>
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

    scrollChat();
  }
}

// ============ THINKING PANEL ============

function toggleThinkingPanel() {
  if (state.thinkingVisible) {
    hideThinkingPanel();
  } else {
    reshowThinkingPanel();
  }
}

function showThinkingPanel(message) {
  const panel = document.getElementById('thinkingPanel');
  const collapsed = document.getElementById('thinkingPanelCollapsed');
  const content = document.getElementById('thinkingContent');
  if (panel && content) {
    content.textContent = message;
    panel.style.display = 'block';
    collapsed.style.display = 'none';
    state.thinkingVisible = true;
    state.thinkingActive = true;
    panel.classList.add('active');
  }
}

function hideThinkingPanel() {
  const panel = document.getElementById('thinkingPanel');
  const collapsed = document.getElementById('thinkingPanelCollapsed');
  if (panel) {
    panel.style.display = 'none';
    panel.classList.remove('active');
    state.thinkingVisible = false;
    // Show collapsed bar if agent is still actively thinking
    if (state.thinkingActive && collapsed) {
      collapsed.style.display = 'flex';
    }
  }
}

function reshowThinkingPanel() {
  const panel = document.getElementById('thinkingPanel');
  const collapsed = document.getElementById('thinkingPanelCollapsed');
  if (panel && state.thinkingActive) {
    panel.style.display = 'block';
    panel.classList.add('active');
    state.thinkingVisible = true;
    if (collapsed) collapsed.style.display = 'none';
  }
}

function stopThinking() {
  const panel = document.getElementById('thinkingPanel');
  const collapsed = document.getElementById('thinkingPanelCollapsed');
  if (panel) {
    panel.style.display = 'none';
    panel.classList.remove('active');
  }
  if (collapsed) collapsed.style.display = 'none';
  state.thinkingVisible = false;
  state.thinkingActive = false;
}

// ============ SEARCH / FILTER ============

function filterDiscoveryTable(input) {
  const filter = input.value.toLowerCase();
  const table = input.closest('.chat-msg-body').querySelector('.discovery-table');
  if (!table) return;
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
}

// ============ ASSESSMENT ============

function assessAll() {
  state.phase = 'assessing';

  addUserMsg('assess all .NET repos');

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; Selected 20 repositories for assessment.</p>
<p>Starting assessment now...</p>`);

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking" onclick="toggleThinkingPanel()">Show thinking &#9662;</span></p>
<p>Assessment is underway for all repositories.</p>`);

  showThinkingPanel('Analyzing repository structure and dependencies...');

  updateSidebarAssessing();
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

  // Update thinking panel with current repo
  showThinkingPanel(`Assessing ${REPOS[index].name}... (${index + 1}/${REPOS.length})`);

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
    addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking" onclick="toggleThinkingPanel()">Show thinking &#9662;</span></p>
<p>&#9989; Assessment progress: 50% (${assessed}/${REPOS.length} total). Elapsed: ${Math.floor(assessed * 1.2)}s</p>`);
  }

  scrollChat();
  setTimeout(() => assessNext(index + 1), 150);
}

function completeAllAssessments() {
  state.phase = 'assessed';
  state.currentIndex = -1;
  stopThinking();

  const assessed = Object.keys(state.assessments).length;
  const high = Object.values(state.assessments).filter(a => a.complexity === 'High').length;
  const med = Object.values(state.assessments).filter(a => a.complexity === 'Medium').length;
  const low = Object.values(state.assessments).filter(a => a.complexity === 'Low').length;

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking" onclick="toggleThinkingPanel()">Show thinking &#9662;</span></p>
<p>&#9989; Assessment complete for ${assessed} repositories!</p>`);

  // Summary table in chat
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

  // Assessment reports available for download
  addAgentMsg(`<p><strong>Assessment Reports</strong></p>
<p>The following reports are available for download:</p>
<div class="file-card">
  <div class="file-card-icon">&#128202;</div>
  <div class="file-card-info">
    <div class="file-card-name">assessment_report.xlsx</div>
    <div class="file-card-meta">Full assessment details • ${assessed} repositories • Excel format</div>
  </div>
  <button class="file-card-action">Download</button>
</div>
<div class="file-card">
  <div class="file-card-icon">&#128202;</div>
  <div class="file-card-info">
    <div class="file-card-name">combined_assessment_report.xlsx</div>
    <div class="file-card-meta">Combined cross-repo analysis • Dependencies & risk scores</div>
  </div>
  <button class="file-card-action">Download</button>
</div>
<div class="file-card">
  <div class="file-card-icon">&#128203;</div>
  <div class="file-card-info">
    <div class="file-card-name">global_transformation_plan.json</div>
    <div class="file-card-meta">Uber transformation plan • Phases, strategies & time estimates</div>
  </div>
  <button class="file-card-action">Download</button>
</div>`);

  addAgentMsg(`<p>&#128200; <strong>Portfolio Overview • Risk Level: LOW-MEDIUM</strong> — No critical or high-risk blockers. Repositories are small, low-complexity projects with limited external dependencies.</p>
<p>&#9888; <strong>Non-upgradeable APIs</strong> (e.g. <code>p/v_build</code>) — 0.1% flagged as not upgradeable in the top-level project (test/UO). This is the largest technical debt item in the portfolio and requires code-level remediation before the solution can be considered fully cloud-ready.</p>`);

  // In auto mode, skip checkpoint configuration and go straight to transform
  if (state.mode === 'auto') {
    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#9889; <strong>Autonomous mode</strong> — proceeding directly to transformation. Checkpoints will log status but not pause execution.</p>
<p>You can switch to interactive mode at any time to regain checkpoint control.</p>`);
    addActionButtons([
      { label: 'Pause and switch to interactive', class: 'outline', action: 'switchToInteractive' }
    ]);

    const prepBadge = document.getElementById('prepareBadge');
    prepBadge.style.display = 'inline-block';
    prepBadge.className = 'step-badge completed';
    prepBadge.textContent = 'Completed';

    // Auto mode: automatically start transformation after a brief delay
    setTimeout(() => startTransformation(true), 1500);
  } else {
    addAgentMsg(`<p>Before starting transformation, you can configure <strong>checkpoints</strong> on individual repos. When a checkpoint is enabled, the agent will pause <em>after</em> transforming that repo so you can review the results before it continues to the next one.</p>
<p>Review and configure checkpoints in the right panel, then start transformation when ready.</p>`);
    addActionButtons([
      { label: 'Review transform checkpoints', class: 'green', action: 'showGlobalPlan' },
      { label: 'Transform all automatically', class: 'blue', action: 'transformAllAuto' },
      { label: 'Re-assess', class: 'outline', action: 'reassess' }
    ]);
  }

  document.getElementById('assessBadge').className = 'step-badge completed';
  document.getElementById('assessBadge').textContent = 'Completed';

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

  updateRightPanelGlobalPlan();
  scrollChat();
}

function switchToInteractive() {
  state.mode = 'interactive';
  addUserMsg('Switch to interactive mode');
  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; Switched to <strong>interactive mode</strong>. I'll pause at checkpoints for your review.</p>
<p>Review and configure checkpoints in the right panel, then start transformation when ready.</p>`);
  addActionButtons([
    { label: 'Review transform checkpoints', class: 'green', action: 'showGlobalPlan' },
    { label: 'Transform all automatically', class: 'blue', action: 'transformAllAuto' }
  ]);
  scrollChat();
}

// ============ TRANSFORMATION ============

function transformAllAuto() {
  addUserMsg('Transform all automatically');

  // Disable all checkpoints for auto run
  state.mode = 'auto';
  REPOS.forEach((_, i) => { state.checkpoints[i] = false; });

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; Switching to autonomous execution. All repositories will be transformed without pausing at checkpoints. Errors will be logged but won't block other repos.</p>`);

  const prepBadge = document.getElementById('prepareBadge');
  prepBadge.style.display = 'inline-block';
  prepBadge.className = 'step-badge completed';
  prepBadge.textContent = 'Completed';

  scrollChat();
  setTimeout(() => startTransformation(true), 800);
}

function startTransformation(silent) {
  state.phase = 'transforming';

  if (!silent) addUserMsg('Start transformation');

  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>Starting .NET transformation — rev8.0 (${REPOS.length} repo(s)):</p>
<ul>
  ${REPOS.slice(0, 5).map(r => `<li>${r.name.split('/')[1]}</li>`).join('')}
  <li>... and ${REPOS.length - 5} more</li>
</ul>
<p>I'll send progress updates as each solution completes.</p>`);

  addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking" onclick="toggleThinkingPanel()">Show thinking &#9662;</span></p>
<p>Transformation is underway for all repositories!</p>`);

  showThinkingPanel('Transforming repositories...');

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
  showThinkingPanel(`Transforming ${REPOS[index].name.split('/')[1]}... (${index + 1}/${REPOS.length})`);
  // Show this repo as "in progress" in sidebar
  updateSidebarTransformRepo(index);
  updateRightPanelTransforming(index);
  runTransformation(index);
}

function runTransformation(index) {
  const duration = 1200 + Math.random() * 2000;
  setTimeout(() => completeTransformation(index), duration);
}

function getTransformSummary(index, filesChanged, testsPass) {
  const repoName = REPOS[index].name.split('/')[1];
  const summaries = {
    0: testsPass
      ? `Upgraded ${repoName} from .NET Framework 4.8 to .NET 8.0. Migrated ${filesChanged} files including project files, replaced System.Web dependencies with ASP.NET Core equivalents, updated Entity Framework 6 calls to EF Core, and converted Web.config to appsettings.json. All 47 unit tests pass after migration.`
      : `Attempted upgrade of ${repoName} from .NET Framework 4.8 to .NET 8.0. Migrated ${filesChanged} files but encountered build failures due to incompatible System.Web.Mvc references in 3 controllers and a custom HttpModule that has no direct .NET 8 equivalent. 12 of 47 unit tests are failing.`,
    1: `Upgraded ${repoName} to .NET 8.0. Converted ${filesChanged} files across 3 solutions. Replaced WCF service references with gRPC clients, updated payment gateway SDK to v5.2 (compatible with .NET 8), and migrated configuration from app.config to appsettings.json.`,
    2: `Migrated ${repoName} to .NET 8.0. Updated ${filesChanged} files including OAuth2 middleware, replaced OWIN pipeline with ASP.NET Core middleware, and updated JWT token validation to use Microsoft.Identity.Web. All identity flows validated.`,
    3: `Upgraded ${repoName} to .NET 8.0. Transformed ${filesChanged} files across 4 solutions. Replaced Entity Framework 6 with EF Core, migrated stored procedure calls to use new DbContext patterns, and updated order processing workflows.`,
    4: `Migrated ${repoName} to .NET 8.0. Updated ${filesChanged} files. Replaced SignalR legacy with ASP.NET Core SignalR, updated email service dependencies, and converted background workers to IHostedService.`,
    5: `Upgraded ${repoName} to .NET 8.0. Transformed ${filesChanged} files across 5 solutions. Replaced Crystal Reports references with modern reporting library, migrated SSRS integrations, and updated data access layer.`,
  };

  if (summaries[index]) return summaries[index];

  // Generic summary for other repos
  const actions = [
    'updated project files to SDK-style format',
    'replaced deprecated NuGet packages with .NET 8 compatible versions',
    'migrated configuration to appsettings.json',
    'updated dependency injection to use built-in DI container'
  ];
  return `Upgraded ${repoName} to .NET 8.0. Modified ${filesChanged} files — ${actions.slice(0, 2 + (index % 2)).join(', ')}. ${testsPass ? 'All tests passing.' : 'Some tests require attention.'}`;
}

function completeTransformation(index) {
  const repo = REPOS[index];
  const filesChanged = Math.floor(Math.random() * 80) + 5;
  // WebPortal (index 0) always fails to demonstrate failure case
  const testsPass = index === 0 ? false : Math.random() > 0.15;

  state.transformations[index] = { filesChanged, testsPass };

  // Update sidebar with this repo's result
  updateSidebarTransformRepo(index);

  const transformed = Object.keys(state.transformations).length;

  // If checkpoint is enabled (interactive mode), pause after completion
  if (state.mode === 'interactive' && state.checkpoints[index]) {
    const repoName = repo.name.split('/')[1];
    const statusIcon = testsPass ? '&#9989;' : '&#10060;';
    const statusText = testsPass ? 'transformation complete' : 'transformation failed';
    const summary = getTransformSummary(index, filesChanged, testsPass);

    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>${statusIcon} <strong>${repoName}</strong> — ${statusText}</p>
<p>${summary}</p>
${!testsPass ? `<div class="checkpoint-alert">
  <div class="checkpoint-alert-title">&#10060; Transformation failed</div>
  <div class="checkpoint-alert-body">The build or tests did not pass after transformation. You can retry the transformation or continue to the next repository.</div>
</div>` : ''}`);

    state.paused = true;
    state.pausedAt = index;

    const checkpointButtons = [
      { label: 'Continue', class: 'green', action: 'continueAfter' }
    ];
    if (!testsPass) {
      checkpointButtons.push({ label: 'Retry', class: 'blue', action: 'retryRepo' });
    }
    checkpointButtons.push({ label: 'Switch to autonomous', class: 'outline', action: 'switchToAuto' });
    addActionButtons(checkpointButtons);

    updateRightPanelTransforming(index);
    scrollChat();
    return;
  }

  // Progress messages
  if (transformed % 5 === 0) {
    addAgentMsg(`<p><strong>AWS Transform</strong> <span class="show-thinking" onclick="toggleThinkingPanel()">Show thinking &#9662;</span></p>
<p>&#9889; Progress: ${transformed}/${REPOS.length}. Last: <strong>${repo.name.split('/')[1]}</strong> — ${filesChanged} files, tests ${testsPass ? '&#9989;' : '&#10060;'}.</p>`);
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
  stopThinking();

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
    case 'confirmInteractive': confirmMode('interactive'); break;
    case 'confirmAuto': confirmMode('auto'); break;
    case 'switchToInteractive': switchToInteractive(); break;
    case 'retryRepo':
      if (state.paused) {
        const repo = REPOS[state.pausedAt];
        const repoName = repo.name.split('/')[1];
        addUserMsg(`Retry ${repoName}`);
        addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#128260; Retrying transformation for <strong>${repoName}</strong>...</p>`);
        showThinkingPanel(`Retrying ${repoName}...`);
        setTimeout(() => {
          const filesChanged = Math.floor(Math.random() * 80) + 5;
          state.transformations[state.pausedAt] = { filesChanged, testsPass: true };
          updateSidebarTransformRepo(state.pausedAt);
          const summary = getTransformSummary(state.pausedAt, filesChanged, true);
          addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#9989; <strong>${repoName}</strong> — retry successful</p>
<p>${summary}</p>`);
          addActionButtons([
            { label: 'Continue', class: 'green', action: 'continueAfter' }
          ]);
          stopThinking();
          scrollChat();
        }, 1500);
      }
      break;
    case 'switchToAuto':
      if (state.paused) {
        state.mode = 'auto';
        REPOS.forEach((_, i) => { state.checkpoints[i] = false; });
        addUserMsg('Switch to autonomous mode');
        addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#10003; Switched to <strong>autonomous mode</strong>. Remaining repos will be transformed without pausing at checkpoints.</p>`);
        continueAfterCheckpoint();
      }
      break;
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
<p>Choose an action: Continue, Retry, or Switch to autonomous.</p>`);
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
    } else if (lower.includes('auto')) {
      confirmMode('auto');
    } else if (lower.includes('interactive')) {
      confirmMode('interactive');
    } else {
      addAgentMsg(`<p><strong>AWS Transform</strong></p><p>Would you like to assess all repositories? Choose a mode first or say <strong>"assess all"</strong>.</p>`);
    }
  } else if (state.phase === 'assessed') {
    if (lower.includes('transform')) {
      showGlobalPlan();
    } else if (lower.includes('interactive')) {
      switchToInteractive();
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

function handleStepClick(stepId) {
  document.getElementById('rightPanel').style.display = 'flex';
  switch(stepId) {
    case 'stepDiscover':
      if (state.phase === 'init') return;
      updateRightPanelDiscovery();
      break;
    case 'stepAssess':
      if (Object.keys(state.assessments).length > 0) {
        updateRightPanelAssessmentComplete();
      } else {
        updateRightPanelAssessing();
      }
      break;
    case 'stepPrepare':
      if (state.phase === 'planning' || state.phase === 'transforming' || state.phase === 'complete') {
        updateRightPanelGlobalPlan();
      }
      break;
    case 'stepTransform':
      if (state.phase === 'complete') {
        updateRightPanelTransformComplete();
      } else if (state.phase === 'transforming') {
        updateRightPanelTransforming(state.currentIndex >= 0 ? state.currentIndex : 0);
      }
      break;
    default:
      break;
  }
}

function handleRepoStepClick(index) {
  document.getElementById('rightPanel').style.display = 'flex';
  updateRightPanelRepoDetail(index);
}

function updateRightPanelRepoDetail(index) {
  const repo = REPOS[index];
  const repoName = repo.name.split('/')[1];
  document.getElementById('rightPanelTitle').textContent = repoName;
  const content = document.getElementById('rightPanelContent');

  const t = state.transformations[index];
  const a = state.assessments[index];

  let html = '';

  if (a) {
    html += `
    <div class="rp-section-block">
      <h4>Assessment</h4>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Complexity</span><span class="rp-detail-val">${a.complexity}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Dependencies</span><span class="rp-detail-val">${a.deps}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Readiness</span><span class="rp-detail-val">${a.readiness}%</span></div>
    </div>`;
  }

  if (t) {
    html += `
    <div class="rp-section-block">
      <h4>Transformation</h4>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Status</span><span class="rp-detail-val" style="color:${t.testsPass ? '#34d399' : '#fbbf24'}">${t.testsPass ? 'Complete' : 'Needs review'}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Files changed</span><span class="rp-detail-val">${t.filesChanged}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Tests</span><span class="rp-detail-val">${t.testsPass ? 'All passing' : 'Some failing'}</span></div>
    </div>
    <div class="rp-section-block">
      <h4>Changes</h4>
      <p>Framework upgraded to .NET 8.0</p>
      <p>Deprecated APIs replaced</p>
      <p>NuGet packages updated</p>
      <p>Configuration migrated</p>
    </div>`;
  } else if (state.phase === 'transforming' && state.currentIndex === index) {
    html += `
    <div class="rp-section-block">
      <h4>Transformation</h4>
      <div class="progress-indicator"><span class="spinner"></span> In progress...</div>
    </div>`;
  } else {
    html += `
    <div class="rp-section-block">
      <h4>Transformation</h4>
      <p class="rp-muted">Pending</p>
    </div>`;
  }

  content.innerHTML = html;
}

function updateRightPanelAssessing() {
  document.getElementById('rightPanelTitle').textContent = 'Assessment In Progress';
  const content = document.getElementById('rightPanelContent');
  const assessed = Object.keys(state.assessments).length;
  content.innerHTML = `
    <div class="rp-detail-section">
      <div class="rp-detail-row"><span class="rp-detail-lbl">Status</span><span class="rp-detail-val">In progress</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Progress</span><span class="rp-detail-val">${assessed}/${REPOS.length}</span></div>
    </div>
    <div class="progress-indicator"><span class="spinner"></span> Assessing repositories...</div>`;
}

function updateSidebarAssessing() {
  const substeps = document.getElementById('assessSubsteps');
  substeps.innerHTML = `<div class="substep"><span class="substep-icon active">&#8230;</span><span>General assessment</span></div>`;
}

function updateSidebarTransformRepo(index) {
  const substeps = document.getElementById('transformSubsteps');
  if (!substeps) return;
  const repo = REPOS[index];
  const repoName = repo.name.split('/')[1];
  const t = state.transformations[index];
  const iconClass = t ? (t.testsPass ? 'done' : 'paused') : 'active';
  const icon = t ? (t.testsPass ? '&#10003;' : '&#9888;') : '&#8230;';

  // Check if this repo already has a substep
  const existing = substeps.querySelector(`[data-repo-index="${index}"]`);
  if (existing) {
    existing.innerHTML = `<span class="substep-icon ${iconClass}">${icon}</span><span>${repoName}</span>`;
  } else {
    const div = document.createElement('div');
    div.className = 'substep substep-clickable';
    div.setAttribute('data-repo-index', index);
    div.innerHTML = `<span class="substep-icon ${iconClass}">${icon}</span><span>${repoName}</span>`;
    div.onclick = () => handleRepoStepClick(index);
    substeps.appendChild(div);
  }
}

// ============ Right Panel ============

function renderRightPanel() {
  document.getElementById('rightPanelTitle').textContent = '';
  document.getElementById('rightPanelContent').innerHTML = '';
}

function updateRightPanelDiscovery() {
  document.getElementById('rightPanel').style.display = 'flex';
  const selectedCount = state.selectedRepos ? state.selectedRepos.filter(Boolean).length : REPOS.length;
  document.getElementById('rightPanelTitle').textContent = `Discovered Repositories (${selectedCount} selected)`;
  const content = document.getElementById('rightPanelContent');

  // Initialize selectedRepos if not set
  if (!state.selectedRepos) {
    state.selectedRepos = REPOS.map(() => true);
  }

  let rows = REPOS.map((r, i) => `
    <tr>
      <td><input type="checkbox" id="repo-chk-${i}" ${state.selectedRepos[i] ? 'checked' : ''} onchange="toggleRepoSelection(${i})"></td>
      <td>${r.name.split('/')[1]}</td>
      <td>${r.lang}</td>
    </tr>`).join('');

  content.innerHTML = `
    <div class="rp-filters">
      <span class="rp-filter-label">Total: ${REPOS.length}</span>
      <span class="rp-filter-label">Selected: <strong id="selectedRepoCount">${selectedCount}</strong></span>
    </div>
    <div class="rp-filter-bar">
      <span class="filter-chip active" onclick="selectReposByLang('.NET')">.NET (14)</span>
      <span class="filter-chip" onclick="selectReposByLang('Python')">Python (3)</span>
      <span class="filter-chip" onclick="selectReposByLang('Java')">Java (3)</span>
      <span class="filter-chip" onclick="selectAllRepos()">All</span>
      <span class="filter-chip" onclick="deselectAllRepos()">None</span>
    </div>
    <table class="rp-table">
      <thead><tr><th>Select</th><th>Repository</th><th>Language</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <button class="rp-confirm-btn" onclick="confirmRepoSelection()">Confirm selection (${selectedCount})</button>`;
}

function toggleRepoSelection(index) {
  if (!state.selectedRepos) state.selectedRepos = REPOS.map(() => true);
  state.selectedRepos[index] = document.getElementById(`repo-chk-${index}`).checked;
  const count = state.selectedRepos.filter(Boolean).length;
  document.getElementById('rightPanelTitle').textContent = `Discovered Repositories (${count} selected)`;
  const countEl = document.getElementById('selectedRepoCount');
  if (countEl) countEl.textContent = count;
  const btn = document.querySelector('.rp-confirm-btn');
  if (btn) btn.textContent = `Confirm selection (${count})`;
}

function selectReposByLang(lang) {
  if (!state.selectedRepos) state.selectedRepos = REPOS.map(() => true);
  REPOS.forEach((r, i) => {
    state.selectedRepos[i] = r.lang === lang;
    const chk = document.getElementById(`repo-chk-${i}`);
    if (chk) chk.checked = state.selectedRepos[i];
  });
  const count = state.selectedRepos.filter(Boolean).length;
  document.getElementById('rightPanelTitle').textContent = `Discovered Repositories (${count} selected)`;
  const countEl = document.getElementById('selectedRepoCount');
  if (countEl) countEl.textContent = count;
  const btn = document.querySelector('.rp-confirm-btn');
  if (btn) btn.textContent = `Confirm selection (${count})`;
}

function selectAllRepos() {
  if (!state.selectedRepos) state.selectedRepos = REPOS.map(() => true);
  REPOS.forEach((_, i) => {
    state.selectedRepos[i] = true;
    const chk = document.getElementById(`repo-chk-${i}`);
    if (chk) chk.checked = true;
  });
  const count = REPOS.length;
  document.getElementById('rightPanelTitle').textContent = `Discovered Repositories (${count} selected)`;
  const countEl = document.getElementById('selectedRepoCount');
  if (countEl) countEl.textContent = count;
  const btn = document.querySelector('.rp-confirm-btn');
  if (btn) btn.textContent = `Confirm selection (${count})`;
}

function deselectAllRepos() {
  if (!state.selectedRepos) state.selectedRepos = REPOS.map(() => true);
  REPOS.forEach((_, i) => {
    state.selectedRepos[i] = false;
    const chk = document.getElementById(`repo-chk-${i}`);
    if (chk) chk.checked = false;
  });
  document.getElementById('rightPanelTitle').textContent = `Discovered Repositories (0 selected)`;
  const countEl = document.getElementById('selectedRepoCount');
  if (countEl) countEl.textContent = '0';
  const btn = document.querySelector('.rp-confirm-btn');
  if (btn) btn.textContent = `Confirm selection (0)`;
}

function confirmRepoSelection() {
  const count = state.selectedRepos ? state.selectedRepos.filter(Boolean).length : REPOS.length;
  if (count === 0) {
    addAgentMsg(`<p><strong>AWS Transform</strong></p><p>Please select at least one repository to assess.</p>`);
    return;
  }
  addUserMsg(`Confirm ${count} repositories for assessment`);
  addAgentMsg(`<p><strong>AWS Transform</strong></p><p>&#10003; ${count} repositories confirmed for assessment.</p>`);
  assessAll();
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

  let failedRepos = [];
  let phasesHtml = REPOS.map((r, i) => {
    const name = r.name.split('/')[1];
    const hasCheckpoint = state.checkpoints[i];
    let status, dot;
    if (state.transformations[i]) {
      const t = state.transformations[i];
      if (t.testsPass) {
        status = 'Complete';
        dot = 'green';
      } else {
        status = 'Failed';
        dot = 'red';
        failedRepos.push(i);
      }
    } else if (i === currentIdx) {
      status = 'In progress';
      dot = 'blue';
    } else {
      status = 'Pending';
      dot = 'gray';
    }
    const checkpointIcon = hasCheckpoint ? ' <span class="checkpoint-indicator">&#9632;</span>' : '';
    return `<div class="rp-phase-item" onclick="handleRepoStepClick(${i})" style="cursor:pointer"><span class="rp-dot ${dot}"></span><span>${name}${checkpointIcon}</span><span class="rp-phase-status">${status}</span></div>`;
  }).join('');

  let failedSection = '';
  if (failedRepos.length > 0 && state.mode === 'auto') {
    const failedItems = failedRepos.map(i => {
      const name = REPOS[i].name.split('/')[1];
      return `<div class="rp-failed-item">
        <span class="rp-dot red"></span>
        <span>${name}</span>
        <button class="rp-retry-btn" onclick="retryFromPanel(${i})">Retry</button>
      </div>`;
    }).join('');
    failedSection = `
    <div class="rp-section-block">
      <h4>&#10060; Failed (${failedRepos.length})</h4>
      <div class="rp-failed-list">${failedItems}</div>
    </div>`;
  }

  content.innerHTML = `
    <div class="rp-detail-section">
      <div class="rp-detail-row"><span class="rp-detail-lbl">Status</span><span class="rp-detail-val">In progress</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Started</span><span class="rp-detail-val">${startTime}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Progress</span><span class="rp-detail-val">${transformed}/${REPOS.length}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Mode</span><span class="rp-detail-val">${state.mode === 'auto' ? 'Autonomous' : 'Interactive'}</span></div>
    </div>
    ${failedSection}
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
  const failed = transformed - passing;

  document.getElementById('rightPanelTitle').textContent = 'Transformation Complete';
  const content = document.getElementById('rightPanelContent');

  let failedRepos = [];
  let phasesHtml = REPOS.map((r, i) => {
    const name = r.name.split('/')[1];
    const hasCheckpoint = state.checkpoints[i];
    const t = state.transformations[i];
    let dot = 'gray';
    let status = 'Skipped';
    if (t) {
      if (t.testsPass) {
        dot = 'green';
        status = 'Complete';
      } else {
        dot = 'red';
        status = 'Failed';
        failedRepos.push(i);
      }
    }
    const checkpointIcon = hasCheckpoint ? ' <span class="checkpoint-indicator">&#9632;</span>' : '';
    return `<div class="rp-phase-item" onclick="handleRepoStepClick(${i})" style="cursor:pointer"><span class="rp-dot ${dot}"></span><span>${name}${checkpointIcon}</span><span class="rp-phase-status">${status}</span></div>`;
  }).join('');

  let failedSection = '';
  if (failedRepos.length > 0) {
    const failedItems = failedRepos.map(i => {
      const name = REPOS[i].name.split('/')[1];
      return `<div class="rp-failed-item">
        <span class="rp-dot red"></span>
        <span>${name}</span>
        <button class="rp-retry-btn" onclick="retryFromPanel(${i})">Retry</button>
      </div>`;
    }).join('');
    failedSection = `
    <div class="rp-section-block">
      <h4>&#10060; Failed (${failedRepos.length})</h4>
      <div class="rp-failed-list">${failedItems}</div>
    </div>`;
  }

  content.innerHTML = `
    <div class="rp-detail-section">
      <div class="rp-detail-row"><span class="rp-detail-lbl">Status</span><span class="rp-detail-val" style="color:${failed > 0 ? '#fbbf24' : '#34d399'}">${failed > 0 ? 'Complete with errors' : 'Complete'}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Transformed</span><span class="rp-detail-val">${transformed}/${REPOS.length}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Passing</span><span class="rp-detail-val" style="color:#34d399">${passing}</span></div>
      <div class="rp-detail-row"><span class="rp-detail-lbl">Failed</span><span class="rp-detail-val" style="color:${failed > 0 ? '#f87171' : '#34d399'}">${failed}</span></div>
    </div>
    ${failedSection}
    <div class="rp-section-block">
      <h4>Results</h4>
      <div class="rp-phases-list">${phasesHtml}</div>
    </div>`;
}

function retryFromPanel(index) {
  const repo = REPOS[index];
  const repoName = repo.name.split('/')[1];
  addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#128260; Retrying transformation for <strong>${repoName}</strong>...</p>`);
  showThinkingPanel(`Retrying ${repoName}...`);
  setTimeout(() => {
    const filesChanged = Math.floor(Math.random() * 80) + 5;
    state.transformations[index] = { filesChanged, testsPass: true };
    updateSidebarTransformRepo(index);
    const summary = getTransformSummary(index, filesChanged, true);
    addAgentMsg(`<p><strong>AWS Transform</strong></p>
<p>&#9989; <strong>${repoName}</strong> — retry successful</p>
<p>${summary}</p>`);
    stopThinking();
    // Refresh right panel to remove this repo from failed list
    if (state.phase === 'complete') {
      updateRightPanelTransformComplete();
    } else {
      updateRightPanelTransforming(state.currentIndex >= 0 ? state.currentIndex : 0);
    }
    scrollChat();
  }, 1500);
}

// ============ Right Panel Resize ============

(function initResize() {
  const handle = document.getElementById('rightPanelResizeHandle');
  const panel = document.getElementById('rightPanel');
  let startX, startWidth;

  handle.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startWidth = panel.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMouseMove(e) {
      const diff = startX - e.clientX;
      const newWidth = Math.min(700, Math.max(240, startWidth + diff));
      panel.style.width = newWidth + 'px';
    }

    function onMouseUp() {
      handle.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();

init();
