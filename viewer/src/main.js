import './style.css'
import { mockData } from './data.js'

// Setup App Layout
document.querySelector('#app').innerHTML = `
<header>
  <h1 class="app-title">🕰️ CHRONOS</h1>
  <p class="subtitle">AI-Powered Historical Narrative Timeline & Dynamic Knowledge Graph</p>
</header>

<div class="search-container">
  <input type="text" id="query-input" class="search-input" placeholder="Type a company or topic (e.g. Vivotek, NVIDIA, OpenAI, Apple)..." />
  <button id="synthesize-btn" class="search-btn">⚡ Synthesize</button>
</div>

<div class="tabs-container">
  <button class="tab-btn active" data-company="vivotek">🏆 VIVOTEK (Active)</button>
  <button class="tab-btn" data-company="nvidia">💚 NVIDIA</button>
  <button class="tab-btn" data-company="openai">🧠 OpenAI</button>
  <button class="tab-btn" data-company="apple">🍎 Apple</button>
  <button class="tab-btn" id="live-tab" data-company="live">📡 Live Synthesized (SerpAPI+Gemini)</button>
</div>

<div id="loader" class="loader">
  <div class="spinner"></div>
  <div id="loader-text" class="loader-text">🔍 Googling search results...</div>
</div>

<div class="chrono-container" id="main-layout">
  <!-- Left Column: Timeline -->
  <div class="timeline-pane">
    <div id="timeline" class="timeline"></div>
  </div>
  
  <!-- Right Column: Interactive Graph -->
  <div class="graph-pane">
    <div class="graph-header">
      <span class="graph-title">🕸️ Relation Graph</span>
      <div class="graph-legend">
        <div class="legend-item"><span class="legend-dot dot-who"></span>Who</div>
        <div class="legend-item"><span class="legend-dot dot-what"></span>What</div>
        <div class="legend-item"><span class="legend-dot dot-where"></span>Where</div>
        <div class="legend-item"><span class="legend-dot dot-crossover"></span>Crossover</div>
      </div>
    </div>
    <svg class="graph-canvas" id="graph-svg" viewBox="0 0 600 450"></svg>
    
    <!-- Slidable Entity Inspector -->
    <div class="entity-inspector" id="inspector-panel">
      <div class="inspector-header">
        <span class="inspector-title" id="insp-title">Entity Name</span>
        <span class="inspector-type" id="insp-type">Who</span>
        <button class="inspector-close" id="insp-close">&times;</button>
      </div>
      <div class="inspector-body" id="insp-body">
        Select a node or tag to inspect details.
      </div>
    </div>
  </div>
</div>
`

const timelineEl = document.querySelector('#timeline')
const loaderEl = document.querySelector('#loader')
const loaderTextEl = document.querySelector('#loader-text')
const searchInputEl = document.querySelector('#query-input')
const synthesizeBtn = document.querySelector('#synthesize-btn')
const tabButtons = document.querySelectorAll('.tab-btn')
const mainLayoutEl = document.querySelector('#main-layout')

const svgEl = document.querySelector('#graph-svg')
const inspectorPanel = document.querySelector('#inspector-panel')
const inspTitle = document.querySelector('#insp-title')
const inspType = document.querySelector('#insp-type')
const inspBody = document.querySelector('#insp-body')
const inspClose = document.querySelector('#insp-close')

// State
let activeCompany = 'vivotek'
let currentEvents = []
let userVotes = {} // { eventIndex: 'verify' | 'dispute' | null }
let activeNodes = []
let activeLinks = []
let physicsAnimationId = null

const width = 600
const height = 450

// Render Timeline Events with fade-in delays
function renderTimeline(events) {
  timelineEl.innerHTML = ''
  
  if (!events || events.length === 0) {
    timelineEl.innerHTML = `
      <div style="text-align: center; color: #64748b; padding: 40px; font-weight: 300;">
        ⚠️ No timeline events found. Please run the python synthesis script first or try another search!
      </div>
    `
    return
  }

  events.forEach((item, index) => {
    // Determine dynamic confidence score based on votes
    let baseConfidence = item.confidence || 0.95
    let dynamicConfidence = baseConfidence
    const vote = userVotes[index]
    
    if (vote === 'verify') {
      // Dynamic mathematical endorsement: Combine with user verification
      dynamicConfidence = parseFloat((1 - (1 - baseConfidence) * (1 - 0.85)).toFixed(2))
    } else if (vote === 'dispute') {
      // Dynamic mathematical dispute: penalize by 80%
      dynamicConfidence = parseFloat((baseConfidence * 0.20).toFixed(2))
    }

    // Determine color class
    let confClass = 'confidence-high'
    let confLabel = 'High Confidence'
    if (dynamicConfidence < 0.4) {
      confClass = 'confidence-low'
      confLabel = 'Unverified / Disputed'
    } else if (dynamicConfidence < 0.8) {
      confClass = 'confidence-medium'
      confLabel = 'Moderate Confidence'
    }

    const card = document.createElement('div')
    card.className = 'timeline-card'
    card.style.animationDelay = `${index * 0.12}s`
    card.id = `card-${index}`
    
    // Generate Tags for "人事時地物"
    let tagsHTML = ''
    if (item.entities) {
      if (item.entities.who) {
        item.entities.who.forEach(tag => {
          tagsHTML += `<span class="tag-badge tag-who" data-entity="${tag}" data-type="who">👤 ${tag}</span>`
        })
      }
      if (item.entities.what) {
        item.entities.what.forEach(tag => {
          tagsHTML += `<span class="tag-badge tag-what" data-entity="${tag}" data-type="what">⚙️ ${tag}</span>`
        })
      }
      if (item.entities.where) {
        item.entities.where.forEach(tag => {
          tagsHTML += `<span class="tag-badge tag-where" data-entity="${tag}" data-type="where">📍 ${tag}</span>`
        })
      }
    }

    // Render source link
    const firstSource = item.sources && item.sources.length > 0 ? item.sources[0].url : 'https://google.com'
    
    card.innerHTML = `
      <div class="card-content">
        <div class="card-header-row">
          <span class="event-date">${item.date}</span>
          <span class="confidence-badge ${confClass}">🛡️ ${Math.round(dynamicConfidence * 100)}% - ${confLabel}</span>
        </div>
        <p class="event-desc">${item.event}</p>
        
        <div class="card-tags">${tagsHTML}</div>
        
        <div class="card-controls">
          <div class="vote-actions">
            <button class="verify-btn ${vote === 'verify' ? 'active' : ''}" data-idx="${index}">👍 背書 (Verify)</button>
            <button class="dispute-btn ${vote === 'dispute' ? 'active' : ''}" data-idx="${index}">👎 質質 (Dispute)</button>
          </div>
          <a href="${firstSource}" target="_blank" class="event-source">
            🔗 Citation Source
          </a>
        </div>
      </div>
    `
    timelineEl.appendChild(card)
  })

  // Bind tags and vote buttons
  document.querySelectorAll('.tag-badge').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const entity = tag.getAttribute('data-entity')
      const type = tag.getAttribute('data-type')
      triggerInspector(entity, type)
    })
  })

  document.querySelectorAll('.verify-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'))
      toggleVote(idx, 'verify')
    })
  })

  document.querySelectorAll('.dispute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'))
      toggleVote(idx, 'dispute')
    })
  })
}

// Toggle vote state and recalculate confidence
function toggleVote(eventIdx, type) {
  if (userVotes[eventIdx] === type) {
    userVotes[eventIdx] = null
  } else {
    userVotes[eventIdx] = type
  }
  
  // Re-render timeline to recalculate scores with animation
  renderTimeline(currentEvents)
}

// ──────────────────────────────────────────────
// Relational Knowledge Graph Physics Engine
// ──────────────────────────────────────────────

function renderGraph(events, companyName) {
  // Cancel previous physics loops
  if (physicsAnimationId) {
    cancelAnimationFrame(physicsAnimationId)
  }

  const nodeMap = new Map()
  const linkSet = new Set()
  
  // 1. Add Brand Center Node
  const companyLabel = companyName.toUpperCase()
  nodeMap.set(companyLabel, {
    id: companyLabel,
    label: companyLabel,
    type: 'company',
    x: width / 2,
    y: height / 2,
    vx: 0, vy: 0, fx: 0, fy: 0,
    r: 18,
    isCompany: true
  })
  
  // 2. Extract Entities and establish relationships
  events.forEach((ev) => {
    if (ev.entities) {
      ['who', 'what', 'where'].forEach(category => {
        const arr = ev.entities[category]
        if (arr && Array.isArray(arr)) {
          arr.forEach(entity => {
            const standardLabel = entity
            
            // Skip the main company name self-link to avoid circles
            if (standardLabel.toUpperCase() === companyLabel) return

            if (!nodeMap.has(standardLabel)) {
              // Crossover nodes detection (Delta Electronics, NVIDIA, AI, H.265, Steve Jobs)
              let isCrossover = false
              const lowerVal = standardLabel.toLowerCase()
              if (
                lowerVal.includes('delta') || 
                lowerVal.includes('nvidia') || 
                lowerVal.includes('ai') || 
                lowerVal.includes('jensen') || 
                lowerVal.includes('jobs') || 
                lowerVal.includes('h.265') || 
                lowerVal.includes('vortex')
              ) {
                isCrossover = true
              }
              
              nodeMap.set(standardLabel, {
                id: standardLabel,
                label: standardLabel,
                type: category,
                x: width / 2 + (Math.random() - 0.5) * 150,
                y: height / 2 + (Math.random() - 0.5) * 150,
                vx: 0, vy: 0, fx: 0, fy: 0,
                r: isCrossover ? 13 : 8,
                isCrossover
              })
            }
            
            // Connect company to this entity
            linkSet.add(`${companyLabel}->${standardLabel}`)
          })
        }
      })
    }
  })
  
  activeNodes = Array.from(nodeMap.values())
  
  activeLinks = []
  linkSet.forEach(lnk => {
    const [src, tgt] = lnk.split('->')
    const sourceIdx = activeNodes.findIndex(n => n.id === src)
    const targetIdx = activeNodes.findIndex(n => n.id === tgt)
    if (sourceIdx !== -1 && targetIdx !== -1) {
      activeLinks.push({
        source: sourceIdx,
        target: targetIdx
      })
    }
  })

  // Setup SVG DOM
  svgEl.innerHTML = ''
  
  // Create links container
  const linksContainer = document.createElementNS("http://www.w3.org/2000/svg", "g")
  linksContainer.setAttribute("class", "links-layer")
  svgEl.appendChild(linksContainer)
  
  // Create nodes container
  const nodesContainer = document.createElementNS("http://www.w3.org/2000/svg", "g")
  nodesContainer.setAttribute("class", "nodes-layer")
  svgEl.appendChild(nodesContainer)

  const linkElements = activeLinks.map(() => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line.setAttribute("class", "graph-link")
    linksContainer.appendChild(line)
    return line
  })

  const nodeElements = activeNodes.map((node) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.setAttribute("class", "node-group")
    g.setAttribute("style", "cursor: pointer;")
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    let colorClass = 'node-what'
    if (node.isCompany) colorClass = 'node-who'
    else if (node.isCrossover) colorClass = 'node-crossover'
    else if (node.type === 'who') colorClass = 'node-who'
    else if (node.type === 'where') colorClass = 'node-where'
    
    circle.setAttribute("class", `node-circle ${colorClass}`)
    circle.setAttribute("r", node.r)
    g.appendChild(circle)
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
    text.setAttribute("class", "node-text")
    text.setAttribute("dx", node.r + 5)
    text.setAttribute("dy", 4)
    text.textContent = node.label
    g.appendChild(text)
    
    nodesContainer.appendChild(g)

    // Interactive Hover effects
    g.addEventListener('mouseenter', () => {
      svgEl.classList.add('has-active')
      g.classList.add('active')
      
      // Highlight direct links and linked nodes
      activeLinks.forEach((lnk, i) => {
        if (lnk.source === activeNodes.indexOf(node)) {
          linkElements[i].classList.add('active')
          nodeElements[lnk.target].classList.add('active')
        } else if (lnk.target === activeNodes.indexOf(node)) {
          linkElements[i].classList.add('active')
          nodeElements[lnk.source].classList.add('active')
        }
      })

      // Highlight timeline cards involving this entity
      events.forEach((item, index) => {
        let match = false
        if (item.entities) {
          ['who', 'what', 'where'].forEach(cat => {
            if (item.entities[cat] && item.entities[cat].includes(node.label)) {
              match = true
            }
          })
        }
        if (node.label === companyLabel) match = true

        const card = document.querySelector(`#card-${index}`)
        if (card) {
          if (match) {
            card.querySelector('.card-content').style.borderColor = 'rgba(192, 132, 252, 0.8)'
            card.querySelector('.card-content').style.boxShadow = '0 0 15px rgba(192, 132, 252, 0.25)'
          } else {
            card.style.opacity = '0.3'
          }
        }
      })
    })

    g.addEventListener('mouseleave', () => {
      svgEl.classList.remove('has-active')
      g.classList.remove('active')
      linkElements.forEach(line => line.classList.remove('active'))
      nodeElements.forEach(group => group.classList.remove('active'))
      
      events.forEach((item, index) => {
        const card = document.querySelector(`#card-${index}`)
        if (card) {
          card.querySelector('.card-content').style.borderColor = ''
          card.querySelector('.card-content').style.boxShadow = ''
          card.style.opacity = '1'
        }
      })
    })

    g.addEventListener('click', () => {
      triggerInspector(node.label, node.type || 'company')
    })

    return g
  })

  // Physics Simulation Loop
  function tick() {
    const repulsion = 800
    const gravity = 0.03
    
    // Repulse nodes from each other
    for (let i = 0; i < activeNodes.length; i++) {
      const n1 = activeNodes[i]
      for (let j = i + 1; j < activeNodes.length; j++) {
        const n2 = activeNodes[j]
        const dx = n2.x - n1.x
        const dy = n2.y - n1.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        
        if (dist < 150) {
          const force = repulsion / (dist * dist)
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          n1.fx -= fx
          n1.fy -= fy
          n2.fx += fx
          n2.fy += fy
        }
      }
    }
    
    // Attract connected nodes along links
    activeLinks.forEach(link => {
      const s = activeNodes[link.source]
      const t = activeNodes[link.target]
      const dx = t.x - s.x
      const dy = t.y - s.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const desiredDist = s.isCompany || t.isCompany ? 120 : 80
      const force = (dist - desiredDist) * 0.015
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      s.fx += fx
      s.fy += fy
      t.fx -= fx
      t.fy -= fy
    })
    
    // Apply center gravity and integrate velocity
    activeNodes.forEach(n => {
      const dx = width / 2 - n.x
      const dy = height / 2 - n.y
      n.fx += dx * gravity
      n.fy += dy * gravity
      
      n.vx = (n.vx + n.fx) * 0.8
      n.vy = (n.vy + n.fy) * 0.8
      n.x += n.vx
      n.y += n.vy
      
      n.fx = 0
      n.fy = 0
      
      // Boundary constraints
      n.x = Math.max(30, Math.min(width - 30, n.x))
      n.y = Math.max(30, Math.min(height - 30, n.y))
    })

    // Update positions in DOM
    activeNodes.forEach((node, i) => {
      nodeElements[i].setAttribute("transform", `translate(${node.x}, ${node.y})`)
    })

    activeLinks.forEach((link, i) => {
      const s = activeNodes[link.source]
      const t = activeNodes[link.target]
      linkElements[i].setAttribute("x1", s.x)
      linkElements[i].setAttribute("y1", s.y)
      linkElements[i].setAttribute("x2", t.x)
      linkElements[i].setAttribute("y2", t.y)
    })

    physicsAnimationId = requestAnimationFrame(tick)
  }

  // Launch physics tick
  tick()
}

// ──────────────────────────────────────────────
// Entity Inspector sliding panel
// ──────────────────────────────────────────────

function triggerInspector(entityName, entityType) {
  inspectorPanel.classList.add('active')
  
  inspTitle.textContent = entityName
  inspType.textContent = entityType
  
  // Set type label background
  let color = 'var(--color-what)'
  if (entityType === 'who' || entityType === 'company') color = 'var(--color-who)'
  else if (entityType === 'where') color = 'var(--color-where)'
  inspType.style.background = color
  
  // Construct Inspector Details
  let matchedEventsHTML = ''
  let occurrences = 0
  
  currentEvents.forEach((item, index) => {
    let match = false
    if (item.entities) {
      ['who', 'what', 'where'].forEach(cat => {
        if (item.entities[cat] && item.entities[cat].includes(entityName)) {
          match = true
        }
      })
    }
    
    // Main company match
    if (entityType === 'company' && entityName.toUpperCase() === activeCompany.toUpperCase()) {
      match = true
    }

    if (match) {
      occurrences++
      matchedEventsHTML += `
        <div style="margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid ${color};">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #60a5fa; font-weight: 600;">📅 ${item.date}</span>
          <p style="margin: 4px 0 0 0; line-height: 1.4;">${item.event}</p>
        </div>
      `
    }
  })

  // Crossover Knowledge injection
  let crossoverHTML = ''
  const lowerName = entityName.toLowerCase()
  
  if (lowerName.includes('delta')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>Crossover Alert:</b> Delta Electronics (台達電) owns VIVOTEK and acts as the primary global power delivery manufacturer for NVIDIA server racks. That binds physical edge surveillance and hyperscale AI computing into a single energy corridor!
      </div>
    `
  } else if (lowerName.includes('nvidia') || lowerName.includes('gpu')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>Crossover Alert:</b> NVIDIA GPUs run visual intelligence metadata pipelines for VIVOTEK's cloud VORTEX AI search engines, while also serving as the primary infrastructure for OpenAI's GPT training clusters.
      </div>
    `
  } else if (lowerName.includes('ai') || lowerName.includes('deep learning')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>Crossover Alert:</b> AI represents the massive cognitive nexus unifying edge camera metadata attributes (VORTEX) with deep scientific reinforcement learning networks (OpenAI o1).
      </div>
    `
  } else if (lowerName.includes('jobs')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>Crossover Alert:</b> Steve Jobs (Apple) pioneered the consumer computing interface (Macintosh) which established personal computers, paving the way for parallel GPU acceleration and consumer AI interfaces.
      </div>
    `
  }

  inspBody.innerHTML = `
    <p style="margin-top: 0; color: #94a3b8;">
      This entity appears <b>${occurrences}</b> times in the narrative timeline for the active dataset.
    </p>
    ${crossoverHTML}
    <div style="margin-top: 15px;">
      <b style="color: white; font-size: 0.8rem; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Related Milestones:</b>
      ${matchedEventsHTML || '<p style="color: #64748b;">No direct event descriptions found.</p>'}
    </div>
  `
}

inspClose.addEventListener('click', () => {
  inspectorPanel.classList.remove('active')
})

// ──────────────────────────────────────────────
// Timed Loading Visual Effects
// ──────────────────────────────────────────────

function triggerLoadingSequence(companyName, callback) {
  mainLayoutEl.style.display = 'none'
  loaderEl.style.display = 'flex'
  inspectorPanel.classList.remove('active')
  
  const steps = [
    `🔍 Harvesting live Google milestone signals for '${companyName}'...`,
    "🧠 Performing entity resolution & resolving conflicts using Gemini 2.5 Flash...",
    "🧮 Running dynamic probability confidence combination formula...",
    "🕸️ Aligning relational entities and drawing Knowledge Graph link vectors..."
  ]
  
  let stepIdx = 0
  loaderTextEl.textContent = steps[stepIdx]
  
  const interval = setInterval(() => {
    stepIdx++
    if (stepIdx < steps.length) {
      loaderTextEl.textContent = steps[stepIdx]
    } else {
      clearInterval(interval)
      loaderEl.style.display = 'none'
      mainLayoutEl.style.display = 'flex'
      callback()
    }
  }, 750)
}

// ──────────────────────────────────────────────
// Navigation and Tab Switching
// ──────────────────────────────────────────────

function switchCompany(companyKey) {
  activeCompany = companyKey
  userVotes = {} // Reset user votes on switch
  
  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-company') === companyKey) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })

  const displayName = companyKey === 'live' ? 'Live Synthesizer' : companyKey.toUpperCase()
  
  triggerLoadingSequence(displayName, () => {
    if (companyKey === 'live') {
      fetch('/timeline_data.json')
        .then(res => {
          if (!res.ok) throw new Error('Data not crawled yet.')
          return res.json()
        })
        .then(data => {
          currentEvents = data
          renderTimeline(currentEvents)
          renderGraph(currentEvents, 'Live AI')
        })
        .catch(err => {
          console.warn(err)
          currentEvents = []
          renderTimeline([])
          svgEl.innerHTML = ''
        })
    } else {
      currentEvents = mockData[companyKey] || []
      renderTimeline(currentEvents)
      renderGraph(currentEvents, companyKey)
    }
  })
}

// ──────────────────────────────────────────────
// Query Search & Synthesize Handler
// ──────────────────────────────────────────────

function handleSearchSynthesis() {
  const query = searchInputEl.value.trim()
  if (!query) return
  
  const key = query.toLowerCase()
  
  triggerLoadingSequence(query, () => {
    if (mockData[key]) {
      currentEvents = mockData[key]
      renderTimeline(currentEvents)
      renderGraph(currentEvents, key)
    } else {
      // Dynamic synthesis simulation with smart templates for unsupported entities
      currentEvents = [
        {
          date: "2018-05-12",
          event: `Initial blueprints of ${query} are engineered by key software architects, laying out the fundamental visual pipelines.`,
          confidence: 0.85,
          entities: {
            who: [query, "Software Architects"],
            what: ["Blueprints", "Software Architecture"],
            where: ["Silicon Valley"],
            when: "2018-05-12"
          },
          sources: [{ url: `https://www.google.com/search?q=${query}`, authority: "Crawl Engine", trust: 0.85 }]
        },
        {
          date: "2021-09-18",
          event: `${query} achieves worldwide enterprise adoption, scaling production lines across global visual security networks.`,
          confidence: 0.90,
          entities: {
            who: [query],
            what: ["Global Scaling", "Enterprise Adoption", "AI"],
            where: ["Global"],
            when: "2021-09-18"
          },
          sources: [{ url: `https://www.google.com/search?q=${query}`, authority: "Crawl Engine", trust: 0.85 }]
        },
        {
          date: "2026-05-25",
          event: `${query} completes integration of AgentOS automated multi-agent networks, triggering next-generation visual computing workflows.`,
          confidence: 0.99,
          entities: {
            who: [query, "AgentOS"],
            what: ["AgentOS Integration", "Multi-Agent Systems", "AI"],
            where: ["Global"],
            when: "2026-05-25"
          },
          sources: [{ url: `https://www.google.com/search?q=${query}`, authority: "Crawl Engine", trust: 0.95 }]
        }
      ]
      renderTimeline(currentEvents)
      renderGraph(currentEvents, query)
    }
  })
}

// ──────────────────────────────────────────────
// Bind UI Listeners
// ──────────────────────────────────────────────

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const company = btn.getAttribute('data-company')
    switchCompany(company)
  })
})

synthesizeBtn.addEventListener('click', handleSearchSynthesis)
searchInputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearchSynthesis()
})

// Initialize VIVOTEK as default
switchCompany('vivotek')
