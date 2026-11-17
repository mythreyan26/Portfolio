/**
 * Mythreyan S — Portfolio Interactive Engine
 * Apple-Inspired Dynamic Storytelling, Theme Engine, and AI Workflow Visualizers
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 01 PRELOADER SEQUENCE
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderStatus = document.getElementById('preloader-status');

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if (progress > 100) progress = 100;

    if (preloaderBar) preloaderBar.style.width = `${progress}%`;

    if (progress >= 30 && progress < 70 && preloaderStatus) {
      preloaderStatus.textContent = 'MOUNTING ARCHITECTURES...';
    } else if (progress >= 70 && progress < 100 && preloaderStatus) {
      preloaderStatus.textContent = 'CALIBRATING WORKFLOWS...';
    } else if (progress === 100) {
      clearInterval(progressInterval);
      if (preloaderStatus) preloaderStatus.textContent = 'SYSTEM READY';
      setTimeout(() => {
        document.body.classList.remove('loading');
      }, 350);
    }
  }, 60);

  // Safety fallback: guaranteed preloader dismissal within 1200ms
  setTimeout(() => {
    clearInterval(progressInterval);
    if (preloaderBar) preloaderBar.style.width = '100%';
    document.body.classList.remove('loading');
  }, 1200);

  // --------------------------------------------------------------------------
  // 02 THEME SYSTEM (DARK DEFAULT / LIGHT MODE PERSISTENCE)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const metaThemeColor = document.getElementById('meta-theme-color');
  const storedTheme = localStorage.getItem('mythreyan_theme') || 'dark';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mythreyan_theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#070709' : '#fbfbfd');
    }
  };

  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 03 STICKY NAVBAR & DETERMINISTIC ACTIVE SECTION TRACKER
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const trackedNavIds = ['hero', 'about', 'capabilities', 'projects', 'experience', 'education', 'contact'];
  let currentActiveId = 'hero';

  const updateNavbarState = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  const updateActiveSection = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    let activeId = 'hero';

    // 1. Guaranteed bottom-of-page check: strictly activates Contact section
    if (windowHeight + scrollY >= docHeight - 90) {
      activeId = 'contact';
    } else if (scrollY < 120) {
      // 2. Guaranteed top-of-page check: strictly activates Hero section
      activeId = 'hero';
    } else {
      // 3. Scan sections in reverse order with custom threshold offset
      const codebasesEl = document.getElementById('codebases');
      for (let i = trackedNavIds.length - 1; i >= 0; i--) {
        const id = trackedNavIds[i];
        const sectionEl = document.getElementById(id);
        if (!sectionEl) continue;

        const rect = sectionEl.getBoundingClientRect();
        let bottom = rect.bottom;

        // If projects, also extend to cover the codebases showcase section
        if (id === 'projects' && codebasesEl) {
          const cbRect = codebasesEl.getBoundingClientRect();
          bottom = Math.max(bottom, cbRect.bottom);
        }

        // Section is active if its top has reached the header trigger zone and its bottom is still below the trigger
        if (rect.top <= 240 && bottom > 100) {
          activeId = id;
          break;
        }
      }
    }

    if (activeId !== currentActiveId) {
      currentActiveId = activeId;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
      });
      mobileLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
      });

      // Keep URL hash synchronized without unwanted jumps
      if (window.history && window.history.replaceState) {
        const targetUrl = activeId === 'hero' 
          ? window.location.pathname + window.location.search 
          : `#${activeId}`;
        const currentHash = window.location.hash;
        const expectedHash = activeId === 'hero' ? '' : `#${activeId}`;

        if (currentHash !== expectedHash) {
          window.history.replaceState(null, '', targetUrl);
        }
      }
    }
  };

  let isScrollTicking = false;
  const onScroll = () => {
    updateNavbarState();
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateNavbarState();
  updateActiveSection();

  // --------------------------------------------------------------------------
  // 04 MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const menuBurger = document.getElementById('menu-burger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  const toggleMobileNav = (open) => {
    if (!mobileNav || !menuBurger) return;
    mobileNav.classList.toggle('open', open);
    menuBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('drawer-open', open);
  };

  if (menuBurger) {
    menuBurger.addEventListener('click', () => {
      const isOpen = mobileNav?.classList.contains('open');
      toggleMobileNav(!isOpen);
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileNav(false));
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', () => toggleMobileNav(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      toggleMobileNav(false);
    }
  });

  // --------------------------------------------------------------------------
  // 05 INTERACTIVE SCROLL REVEAL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 06 CAPABILITIES FILTERING
  // --------------------------------------------------------------------------
  const capabilityTabs = document.querySelectorAll('.capability-tab');
  const capabilityCards = document.querySelectorAll('.capability-card');

  capabilityTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      capabilityTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.getAttribute('data-category');

      capabilityCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('in'), 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 07 PROJECTS: QUICK SWITCHER & INTERACTIVE STORYTELLING
  // --------------------------------------------------------------------------
  const projectSwitchBtns = document.querySelectorAll('.project-switch-btn');
  const projectShowcases = document.querySelectorAll('.project-showcase');

  projectSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navOffset = navbar ? navbar.offsetHeight + 24 : 80;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navOffset;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }

      projectSwitchBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    });
  });

  // Project Scroll Spy for Switcher Pills
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        projectSwitchBtns.forEach(btn => {
          const isCurrent = btn.getAttribute('data-target') === id;
          btn.classList.toggle('active', isCurrent);
          btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-10% 0px -40% 0px'
  });

  projectShowcases.forEach(el => projectObserver.observe(el));

  // Stage 02: RBAC Security Context Toggle (Customer vs Merchant)
  const btnRoleCustomer = document.getElementById('btn-role-customer');
  const btnRoleMerchant = document.getElementById('btn-role-merchant');
  const panelRoleCustomer = document.getElementById('panel-role-customer');
  const panelRoleMerchant = document.getElementById('panel-role-merchant');

  if (btnRoleCustomer && btnRoleMerchant && panelRoleCustomer && panelRoleMerchant) {
    btnRoleCustomer.addEventListener('click', () => {
      btnRoleCustomer.classList.add('active');
      btnRoleCustomer.setAttribute('aria-selected', 'true');
      btnRoleMerchant.classList.remove('active');
      btnRoleMerchant.setAttribute('aria-selected', 'false');

      panelRoleCustomer.classList.remove('hidden');
      panelRoleMerchant.classList.add('hidden');
      showToast('Switched to Authenticated Customer context');
    });

    btnRoleMerchant.addEventListener('click', () => {
      btnRoleMerchant.classList.add('active');
      btnRoleMerchant.setAttribute('aria-selected', 'true');
      btnRoleCustomer.classList.remove('active');
      btnRoleCustomer.setAttribute('aria-selected', 'false');

      panelRoleMerchant.classList.remove('hidden');
      panelRoleCustomer.classList.add('hidden');
      showToast('Switched to Store Administrator / Merchant context');
    });
  }

  // Stage 03: SSE Event Stream Simulator
  const sseSimulateBtn = document.getElementById('sse-simulate-btn');
  const sseLogContainer = document.getElementById('sse-log-container');

  const sseEvents = [
    { type: 'stock_update', msg: 'Product #102 (Mechanical Keyboard) stock decreased: 2 → 1 (Order #9042 reserved).' },
    { type: 'price_tick', msg: 'Price stream adjustment: Acoustic Studio ANC Pro marked down -$15 (Limited promo active).' },
    { type: 'order_status', msg: 'Order #9041 transitioned state: [PROCESSING] → [SHIPPED] with tracking token.' },
    { type: 'auto_restore', msg: 'Timeout watchdog: Expired checkout session #8831 released. +1 unit restored to stock.' }
  ];

  let sseIndex = 0;
  if (sseSimulateBtn && sseLogContainer) {
    sseSimulateBtn.addEventListener('click', () => {
      const ev = sseEvents[sseIndex % sseEvents.length];
      sseIndex++;

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const logItem = document.createElement('div');
      logItem.className = 'log-item highlight';
      logItem.innerHTML = `<span class="log-time">${timeStr}</span> <span class="log-ev">EVENT [${ev.type}]</span>: ${ev.msg}`;

      sseLogContainer.prepend(logItem);
      while (sseLogContainer.children.length > 5) {
        sseLogContainer.lastElementChild?.remove();
      }
      showToast(`SSE Event broadcasted: [${ev.type}]`);
    });
  }

  // Stage 05: Automated Stock Restoration State Machine Simulator
  const btnTestRollback = document.getElementById('btn-test-rollback');
  const rollbackStatusText = document.getElementById('rollback-status-text');

  if (btnTestRollback && rollbackStatusText) {
    let isRollbackRunning = false;

    btnTestRollback.addEventListener('click', () => {
      if (isRollbackRunning) return;
      isRollbackRunning = true;
      btnTestRollback.disabled = true;
      btnTestRollback.style.opacity = '0.6';
      btnTestRollback.innerHTML = '<span>Simulating Timeout...</span>';

      rollbackStatusText.innerHTML = '<span class="live-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b;"></span> State: Checkout Session Expired (Active Hold Released)';

      setTimeout(() => {
        rollbackStatusText.innerHTML = '<span class="live-dot" style="background:#38bdf8;box-shadow:0 0 8px #38bdf8;"></span> State: Django Signal Triggered (transaction.atomic restore)';
      }, 700);

      setTimeout(() => {
        rollbackStatusText.innerHTML = '<span class="live-dot"></span> State: ✓ Stock Restored (+1 unit catalog sync via SSE)';
        btnTestRollback.disabled = false;
        btnTestRollback.style.opacity = '1';
        btnTestRollback.innerHTML = '<span>Simulate Cart Timeout</span>';
        isRollbackRunning = false;
        showToast('Django signal executed: Stock restored (+1 unit to inventory)');
      }, 1500);
    });
  }

  // --------------------------------------------------------------------------
  // 07B PROJECT 2: CI/CD PIPELINE (GITHUB ACTIONS & DOCKER SIMULATOR)
  // --------------------------------------------------------------------------
  const btnRunPipeline = document.getElementById('btn-run-pipeline');
  const stage1Status = document.getElementById('stage-1-status');
  const stage2Status = document.getElementById('stage-2-status');
  const pipelineTelemetryStatus = document.getElementById('pipeline-telemetry-status');
  const cicdTerminalTitle = document.getElementById('cicd-terminal-title');
  const cicdLatency = document.getElementById('cicd-latency');
  const cicdTerminalOutput = document.getElementById('cicd-terminal-output');
  const probeButtons = document.querySelectorAll('.probe-btn');

  const cicdEndpointData = {
    health: {
      cmd: 'curl -s http://localhost:5000/api/health',
      latency: 'HTTP/1.1 200 OK · 12ms',
      json: {
        status: "healthy",
        service: "flask-rest-api",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        python: "3.12",
        checks: {
          pytest_suite: "24/24 PASSING (100%)",
          container_security: "non-root user (appuser:10001)",
          docker_healthcheck: "PASSING",
          secrets_management: "GitHub Actions Secrets (zero leak)"
        },
        deployment: {
          engine: "Gunicorn / Flask",
          registry: "Docker Hub (mythreyan26/flask-cicd-api:latest)",
          orchestration: "Docker Compose"
        }
      }
    },
    info: {
      cmd: 'curl -s http://localhost:5000/api/info',
      latency: 'HTTP/1.1 200 OK · 8ms',
      json: {
        project: "CI/CD Pipeline with GitHub Actions & Docker",
        author: "Mythreyan S",
        framework: "Flask 3.0 + Gunicorn WSGI",
        python_version: "3.12-alpine",
        pipeline: {
          type: "Two-Stage Gated Delivery",
          ci_runner: "GitHub Actions (ubuntu-latest)",
          test_runner: "Pytest (24 unit/integration tests)",
          container_builder: "Docker Buildx Multi-Stage"
        },
        docker_hub: "https://hub.docker.com/u/mythreyan26",
        dashboard: "Interactive monitoring UI with live health polling"
      }
    },
    container: {
      cmd: "docker inspect --format='{{json .State.Health}}' flask-api",
      latency: 'LOCAL DOCKER DAEMON · 4ms',
      json: {
        Status: "healthy",
        FailingStreak: 0,
        Log: [
          {
            Start: new Date().toISOString(),
            ExitCode: 0,
            Output: "HTTP/1.1 200 OK - Service Healthy (curl --fail http://localhost:5000/api/health)\n"
          }
        ],
        SecurityOpt: [
          "no-new-privileges:true",
          "user:appuser(10001:10001)"
        ]
      }
    }
  };

  probeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      probeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const ep = btn.getAttribute('data-endpoint');
      const data = cicdEndpointData[ep];
      if (!data) return;

      if (cicdTerminalTitle) cicdTerminalTitle.textContent = data.cmd;
      if (cicdLatency) cicdLatency.textContent = data.latency;
      if (cicdTerminalOutput) cicdTerminalOutput.textContent = JSON.stringify(data.json, null, 2);

      showToast(`Probed ${data.cmd.split(' ')[2] || ep}: 200 OK`);
    });
  });

  if (btnRunPipeline) {
    let isPipelineRunning = false;
    btnRunPipeline.addEventListener('click', () => {
      if (isPipelineRunning) return;
      isPipelineRunning = true;
      btnRunPipeline.disabled = true;
      btnRunPipeline.innerHTML = '<span>Running CI Pipeline...</span>';

      if (pipelineTelemetryStatus) {
        pipelineTelemetryStatus.innerHTML = '<span class="live-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b;"></span> Pipeline: Stage 1 Running Pytest (24 tests)...';
      }
      if (stage1Status) {
        stage1Status.innerHTML = '<span class="ping-pulse" style="background:#f59e0b;"></span> EXECUTING PYTEST';
      }

      setTimeout(() => {
        if (stage1Status) {
          stage1Status.innerHTML = '<span class="ping-pulse"></span> 24/24 PASSING ✓';
        }
        if (pipelineTelemetryStatus) {
          pipelineTelemetryStatus.innerHTML = '<span class="live-dot" style="background:#38bdf8;box-shadow:0 0 8px #38bdf8;"></span> Stage 2: Building Docker image & publishing to Docker Hub...';
        }
        if (stage2Status) {
          stage2Status.innerHTML = '<span class="ping-pulse" style="background:#38bdf8;"></span> DOCKER BUILD & PUSH';
        }
      }, 900);

      setTimeout(() => {
        if (stage2Status) {
          stage2Status.innerHTML = '<span class="ping-pulse"></span> DOCKER HUB SYNCED ✓';
        }
        if (pipelineTelemetryStatus) {
          pipelineTelemetryStatus.innerHTML = '<span class="live-dot"></span> Pipeline Status: All Stages Green (Image Live on Docker Hub)';
        }
        btnRunPipeline.disabled = false;
        btnRunPipeline.innerHTML = '<span>Simulate Pipeline Run</span> <svg class="icon-sm"><use href="#icon-arrow-right"/></svg>';
        isPipelineRunning = false;

        if (cicdTerminalTitle) cicdTerminalTitle.textContent = 'github-actions-runner — workflow completed';
        if (cicdLatency) cicdLatency.textContent = 'RUN DURATION: 1m 24s · 0 FAILURES';
        if (cicdTerminalOutput) {
          cicdTerminalOutput.textContent = JSON.stringify({
            workflow: "ci-cd-pipeline.yml",
            trigger: "git push origin main",
            stages: [
              { stage: "test", runner: "pytest", tests_passed: 24, tests_failed: 0, status: "SUCCESS" },
              { stage: "build_and_publish", registry: "Docker Hub", image: "mythreyan26/flask-cicd-api:latest", digest: "sha256:4f8e91a27b8c...", status: "SUCCESS" },
              { stage: "health_check", check: "container health probe", status: "HEALTHY" }
            ],
            conclusion: "SUCCESSFUL_DEPLOYMENT"
          }, null, 2);
        }

        showToast('Pipeline success: 24/24 Pytest passed · Docker image published!');
      }, 1900);
    });
  }

  // --------------------------------------------------------------------------
  // 08 PROJECT 3: KIN (AUTONOMOUS AI AGENT PIPELINE SIMULATOR)
  // --------------------------------------------------------------------------
  const promptChips = document.querySelectorAll('.prompt-chip');
  const dagNodes = document.querySelectorAll('.dag-node');
  const kinJsonOutput = document.getElementById('kin-json-output');
  const kinLatency = document.getElementById('kin-latency');

  const simulations = {
    research: {
      prompt: '"Search web & summarize latest AI models"',
      nodes: [
        'Task: 3-Stage Plan',
        'WebSearch: Live Query',
        'Sandboxed Python: Run',
        'Limits: Guard Validated'
      ],
      latency: 'LATENCY: 220ms · STATUS: 200 OK',
      json: `{
  "status": "success",
  "workflow_id": "wf_gemini_kin_9021",
  "agent": "KIN-Gemini-Autonomous-Core",
  "model": "Google Gemini API",
  "steps_executed": [
    { "step": 1, "task": "Plan research strategy", "tool": "Gemini-Planner", "status": "COMPLETED" },
    { "step": 2, "task": "Execute live web search", "tool": "WebSearchTool", "status": "COMPLETED" },
    { "step": 3, "task": "Run sandboxed parsing script", "tool": "SandboxedPythonRunner", "status": "COMPLETED" },
    { "step": 4, "task": "Enforce iteration cap & timeouts", "tool": "ResourceGuard", "status": "PASSED" },
    { "step": 5, "task": "Write immutable audit log", "tool": "AuditLogger", "status": "SAVED" }
  ],
  "result": {
    "summary": "Retrieved and synthesized documentation across targeted web sources.",
    "iterations_used": 3,
    "max_iteration_cap": 10,
    "timeout_seconds": 30,
    "audit_log": "logs/audit_9021.jsonl"
  },
  "sandbox_violations": 0
}`
    },
    python: {
      prompt: '"Execute sandboxed Python script for data stats"',
      nodes: [
        'Plan: Stat Analysis',
        'Sandbox: Isolated FS',
        'Python 3.12: Subprocess',
        'Audit: Output Verified'
      ],
      latency: 'LATENCY: 175ms · STATUS: 200 OK',
      json: `{
  "status": "success",
  "workflow_id": "wf_python_sandbox_4402",
  "agent": "KIN-Gemini-Autonomous-Core",
  "model": "Google Gemini API",
  "steps_executed": [
    { "step": 1, "task": "Generate Python statistics script", "tool": "Gemini-Planner", "status": "COMPLETED" },
    { "step": 2, "task": "Mount sandboxed workspace directory", "tool": "SandboxMount", "status": "COMPLETED" },
    { "step": 3, "task": "Execute Python in restricted subprocess", "tool": "SandboxedPythonRunner", "status": "COMPLETED" },
    { "step": 4, "task": "Validate execution timeout (<5s)", "tool": "TimeoutGuard", "status": "PASSED" }
  ],
  "result": {
    "stdout": "Dataset processed: 10,000 records. Mean: 42.8, StdDev: 3.14.",
    "execution_time_seconds": 0.41,
    "sandbox_exit_code": 0
  },
  "audit_trail_recorded": true
}`
    },
    timeout: {
      prompt: '"Simulate timeout guard & iteration cap enforcement"',
      nodes: [
        'Plan: Safety Trigger',
        'Watchdog: Loop Cap (10)',
        'Guard: SIGKILL Enforced',
        'Audit: Log Recorded'
      ],
      latency: 'LATENCY: 310ms · STATUS: 200 OK (GUARDED)',
      json: `{
  "status": "guarded_termination",
  "workflow_id": "wf_safety_timeout_8819",
  "agent": "KIN-Gemini-Autonomous-Core",
  "model": "Google Gemini API",
  "steps_executed": [
    { "step": 1, "task": "Dispatch task with iteration cap: 10", "tool": "ResourceGuard", "status": "ACTIVE" },
    { "step": 2, "task": "Iteration watchdog detected cap threshold", "tool": "IterationCapGuard", "status": "INTERCEPTED" },
    { "step": 3, "task": "Enforce execution timeout cutoff (30s)", "tool": "TimeoutSupervisor", "status": "ENFORCED" },
    { "step": 4, "task": "Record security event in audit journal", "tool": "AuditLogger", "status": "SAVED" }
  ],
  "result": {
    "guard_triggered": "IterationCap & ExecutionTimeout",
    "action": "Graceful process termination without resource exhaustion",
    "system_health": "Uncompromised (100% sandbox integrity preserved)"
  },
  "audit_logged": true
}`
    }
  };

  let dagTimeouts = [];
  const clearDagTimeouts = () => {
    dagTimeouts.forEach(t => clearTimeout(t));
    dagTimeouts = [];
  };

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      clearDagTimeouts();
      promptChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const simKey = chip.getAttribute('data-prompt');
      const data = simulations[simKey];
      if (!data) return;

      // Reset and prepare DAG nodes
      dagNodes.forEach((node, i) => {
        node.classList.remove('active');
        const dataEl = document.getElementById(`dag-data-${i + 1}`);
        if (dataEl && i === 0) {
          dataEl.textContent = data.prompt;
        } else if (dataEl && data.nodes[i - 1]) {
          dataEl.textContent = data.nodes[i - 1];
        }
      });

      // Sequential lighting of nodes with cancellation tracking
      dagNodes.forEach((node, idx) => {
        const t = setTimeout(() => {
          node.classList.add('active');
        }, idx * 110);
        dagTimeouts.push(t);
      });

      // Update terminal output
      if (kinLatency) kinLatency.textContent = data.latency;
      if (kinJsonOutput) kinJsonOutput.textContent = data.json;

      showToast(`Agent executed: ${data.prompt.slice(0, 30)}...`);
    });
  });

  // Custom AI Prompt Runner
  const customPromptInput = document.getElementById('custom-prompt-input');
  const customPromptBtn = document.getElementById('custom-prompt-btn');

  const executeCustomPrompt = () => {
    clearDagTimeouts();
    const rawPrompt = customPromptInput?.value?.trim() || 'Plan multi-step task and analyze files with Gemini API';
    promptChips.forEach(c => c.classList.remove('active'));

    dagNodes.forEach((node, i) => {
      node.classList.remove('active');
      const dataEl = document.getElementById(`dag-data-${i + 1}`);
      if (dataEl) {
        if (i === 0) dataEl.textContent = `"${rawPrompt.slice(0, 24)}..."`;
        if (i === 1) dataEl.textContent = 'Gemini: Plan Decomposed';
        if (i === 2) dataEl.textContent = 'WebSearch: Query Active';
        if (i === 3) dataEl.textContent = 'Runner: Python Sandboxed';
        if (i === 4) dataEl.textContent = 'Audit: Trace Recorded';
      }
    });

    dagNodes.forEach((node, idx) => {
      const t = setTimeout(() => node.classList.add('active'), idx * 110);
      dagTimeouts.push(t);
    });

    if (kinLatency) kinLatency.textContent = 'LATENCY: 215ms · STATUS: 200 OK';
    if (kinJsonOutput) {
      kinJsonOutput.textContent = JSON.stringify({
        status: "success",
        workflow_id: `wf_gemini_${Math.floor(1000 + Math.random() * 9000)}_custom`,
        agent: "KIN-Gemini-Autonomous-Core",
        model: "Google Gemini API",
        input_prompt: rawPrompt,
        steps_executed: [
          { step: 1, task: "Plan task steps with Gemini", tool: "Gemini-Planner", status: "COMPLETED" },
          { step: 2, task: "Perform web retrieval", tool: "WebSearchTool", status: "COMPLETED" },
          { step: 3, task: "Execute sandboxed Python script", tool: "SandboxedPythonRunner", status: "COMPLETED" },
          { step: 4, task: "Enforce execution timeouts & iteration cap", tool: "ResourceGuard", status: "PASSED" },
          { step: 5, task: "Write audit log entry", tool: "AuditLogger", status: "SAVED" }
        ],
        result: {
          execution_summary: "Task planned and executed with full sandbox isolation.",
          status_code: 200,
          iterations_used: 2,
          iteration_cap: 10,
          audit_logged: true
        },
        sandbox_violations: 0
      }, null, 2);
    }

    showToast(`Custom task executed: "${rawPrompt.slice(0, 25)}..."`);
  };

  if (customPromptBtn) {
    customPromptBtn.addEventListener('click', executeCustomPrompt);
  }
  if (customPromptInput) {
    customPromptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeCustomPrompt();
    });
  }

  // Progressive DAG entrance animation when entering viewport
  const workflowDag = document.getElementById('workflow-dag');
  if (workflowDag) {
    let dagAnimated = false;
    const dagObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !dagAnimated) {
          dagAnimated = true;
          clearDagTimeouts();
          dagNodes.forEach(node => node.classList.remove('active'));
          dagNodes.forEach((node, idx) => {
            const t = setTimeout(() => {
              node.classList.add('active');
            }, idx * 160);
            dagTimeouts.push(t);
          });
          dagObserver.unobserve(workflowDag);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -40px 0px'
    });
    dagObserver.observe(workflowDag);
  }

  // Interactive Mock Storefront "Add to Cart" Buttons
  let cartTotalCount = 0;
  const cartBadgeCount = document.getElementById('cart-item-count');
  const mockAddButtons = document.querySelectorAll('.btn-mock-add');

  mockAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      cartTotalCount++;
      if (cartBadgeCount) {
        cartBadgeCount.textContent = `${cartTotalCount} ${cartTotalCount === 1 ? 'item' : 'items'}`;
      }

      const originalText = btn.textContent;
      btn.textContent = '✓ Added';
      btn.style.background = '#10b981';
      btn.style.color = '#ffffff';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);

      const productCard = btn.closest('.mockup-product-card');
      const title = productCard?.querySelector('h5')?.textContent || 'Item';
      showToast(`Added to ShopKart cart: ${title} (Cart total: ${cartTotalCount})`);
    });
  });

  // --------------------------------------------------------------------------
  // 09 RESUME MODAL VIEWER
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroPreviewResumeBtn = document.getElementById('hero-preview-resume-btn');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeModalBackdrop = document.getElementById('resume-modal-backdrop');

  const toggleResumeModal = (show) => {
    if (!resumeModal) return;
    resumeModal.classList.toggle('active', show);
    resumeModal.setAttribute('aria-hidden', show ? 'false' : 'true');
    document.body.classList.toggle('modal-open', show);
  };

  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', () => toggleResumeModal(true));
  }
  if (heroPreviewResumeBtn) {
    heroPreviewResumeBtn.addEventListener('click', () => toggleResumeModal(true));
  }
  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', () => toggleResumeModal(false));
  }
  if (resumeModalBackdrop) {
    resumeModalBackdrop.addEventListener('click', () => toggleResumeModal(false));
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal?.classList.contains('active')) {
      toggleResumeModal(false);
    }
  });

  // --------------------------------------------------------------------------
  // 10 VERIFIED CODEBASES & REPOSITORY SHOWCASE
  // --------------------------------------------------------------------------
  // Static verified repository cards for mythreyan26/ShopKart, CI/CD Pipeline, and mythreyan26/KIN
  // link directly to authentic GitHub & Docker Hub production repos with real metrics.


  // --------------------------------------------------------------------------
  // 11 COPY TO CLIPBOARD BUTTONS
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 12 CONTACT FORM (PRE-POPULATES SYSTEM EMAIL CLIENT)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const subject = formData.get('subject') || 'Software Engineering Opportunity';
      const message = formData.get('message') || '';

      const bodyText = `Hello Mythreyan,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`;

      const mailtoUrl = `mailto:mythreyan.vnb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.innerHTML = '<span style="color:#10b981;">✓ Email client launched with pre-filled message!</span>';
      }

      showToast('Opening default email client...');
    });
  }

  // --------------------------------------------------------------------------
  // 13 BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 14 TOAST NOTIFICATION HELPER
  // --------------------------------------------------------------------------
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:#38bdf8;">✦</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

});
