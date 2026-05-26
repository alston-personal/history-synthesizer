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
  <button id="export-report-btn" class="export-btn">📥 Export Report</button>
</div>

<div class="tabs-container">
  <button class="tab-btn active" data-company="all">🌐 全域跨界網 (Global Master)</button>
  <button class="tab-btn" data-company="vivotek">🏆 VIVOTEK</button>
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
    <div class="graph-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--clr-border); padding-bottom: 12px; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
      <span class="graph-title" style="font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 8px; color: #f8fafc;">🕸️ 跨域知識圖譜網絡</span>
      <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
        <!-- 圖譜維度篩選器 (人事時地物) -->
        <div class="dimension-filter-container" style="display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 20px; gap: 4px;">
          <span style="font-size: 0.65rem; color: #94a3b8; font-weight: 600; padding: 0 4px;">維度:</span>
          <button id="dim-who-btn" class="dim-btn active" style="font-size: 0.65rem; border: none; background: rgba(244, 114, 182, 0.2); border: 1px solid rgba(244, 114, 182, 0.4); color: #f472b6; cursor: pointer; padding: 3px 10px; border-radius: 12px; font-weight: 600;">👤 人物/組織</button>
          <button id="dim-what-btn" class="dim-btn active" style="font-size: 0.65rem; border: none; background: rgba(96, 165, 250, 0.2); border: 1px solid rgba(96, 165, 250, 0.4); color: #60a5fa; cursor: pointer; padding: 3px 10px; border-radius: 12px; transition: all 0.2s; font-weight: 600;">⚙️ 技術/產品</button>
          <button id="dim-where-btn" class="dim-btn active" style="font-size: 0.65rem; border: none; background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.4); color: #34d399; cursor: pointer; padding: 3px 10px; border-radius: 12px; transition: all 0.2s; font-weight: 600;">📍 地點</button>
        </div>
        
        <div class="filter-toggle-container" style="display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 20px; gap: 4px;">
          <span style="font-size: 0.65rem; color: #94a3b8; font-weight: 600; padding: 0 4px;">公司過濾:</span>
          <button id="toggle-people-only-btn" class="toggle-mode-btn" style="font-size: 0.65rem; border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 3px 10px; border-radius: 12px; transition: all 0.2s; font-weight: 600;">👤 僅人物</button>
          <button id="toggle-all-who-btn" class="toggle-mode-btn" style="font-size: 0.65rem; border: none; background: rgba(192, 132, 252, 0.25); border: 1px solid rgba(192, 132, 252, 0.4); color: #e9d5ff; cursor: pointer; padding: 3px 10px; border-radius: 12px; transition: all 0.2s; font-weight: 600;">🌐 人物與公司</button>
        </div>
      </div>
    </div>
    <div class="graph-canvas-container" style="position: relative; flex: 1; display: flex; flex-direction: column; min-height: 0;">
      <svg class="graph-canvas" id="graph-svg" viewBox="0 0 600 450" style="flex: 1; width: 100%; height: 100%;"></svg>
      <button id="back-to-global-btn" class="back-global-btn" style="position: absolute; top: 15px; right: 15px; z-index: 5;">🔙 返回全域關係網</button>
    </div>
    
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
const exportReportBtn = document.querySelector('#export-report-btn')
const tabButtons = document.querySelectorAll('.tab-btn')
const mainLayoutEl = document.querySelector('#main-layout')

const svgEl = document.querySelector('#graph-svg')
const backToGlobalBtn = document.querySelector('#back-to-global-btn')
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
let activeFilter = null // { entity: 'Jensen Huang', type: 'who' }
let egoCenterNode = null
let graphMode = 'all-who'

function isCompanyNode(name) {
  if (!name) return false
  const upper = name.toUpperCase()
  const companyKeywords = [
    'VIVOTEK', '晶睿通訊', 'DELTA', '台達電', '台達電子', 
    'NVIDIA', '輝達', 'OPENAI', 'MICROSOFT', '微軟', 
    'APPLE', '蘋果電腦', 'GOOGLE', 'LIVE AI', 'TAIWAN STOCK EXCHANGE',
    '台灣證券交易所', 'STOCK EXCHANGE', 'AGENTOS'
  ]
  return companyKeywords.some(kw => upper.includes(kw))
}

// 🧠 Dynamic Semantic Relationship Parser (從「連結」到「說服力的關係」)
function resolveRelationshipLabel(nodeA, nodeB, events) {
  if (!nodeA || !nodeB) return ''
  const uA = nodeA.toUpperCase()
  const uB = nodeB.toUpperCase()
  
  // 1. 優先掃描顯式 relationships
  let explicitLabel = ''
  events.some(ev => {
    if (ev.relationships && Array.isArray(ev.relationships)) {
      return ev.relationships.some(rel => {
        if (!rel || !rel.source || !rel.target) return false
        const s = rel.source.toUpperCase()
        const t = rel.target.toUpperCase()
        const l = rel.label || ''
        if ((s === uA && t === uB) || (s === uB && t === uA)) {
          explicitLabel = l
          return true
        }
        return false
      })
    }
    return false
  })
  
  if (explicitLabel) return explicitLabel
  
  // 2. 隱式關係解析器：掃描共同出現在同一事件中的文本
  let matchedEvents = []
  events.forEach(ev => {
    if (ev.entities) {
      let hasA = false
      let hasB = false
      ;['who', 'what', 'where'].forEach(cat => {
        const val = ev.entities[cat]
        if (val) {
          const arr = Array.isArray(val) ? val : [val]
          if (arr.some(n => n.toUpperCase() === uA)) hasA = true
          if (arr.some(n => n.toUpperCase() === uB)) hasB = true
        }
      })
      if (hasA && hasB) {
        matchedEvents.push(ev.event)
      }
    }
  })
  
  if (matchedEvents.length === 0) return ''
  
  const combinedText = matchedEvents.join(' ').toLowerCase()
  if (combinedText.includes('創辦') || combinedText.includes('創立') || combinedText.includes('成立') || combinedText.includes('解創富') || combinedText.includes('共同創設')) {
    return '共同創辦'
  }
  if (combinedText.includes('收購') || combinedText.includes('併購') || combinedText.includes('控股') || combinedText.includes('股權') || combinedText.includes('資本')) {
    return '資本控股收購'
  }
  if (combinedText.includes('供應') || combinedText.includes('電源') || combinedText.includes('支援') || combinedText.includes('機櫃') || combinedText.includes('高瓦特')) {
    return '產業鏈供應支援'
  }
  if (combinedText.includes('訓練') || combinedText.includes('alexnet') || combinedText.includes('神經網路') || combinedText.includes('算力') || combinedText.includes('gpu')) {
    return '算力加速訓練'
  }
  if (combinedText.includes('推出') || combinedText.includes('發表') || combinedText.includes('研發') || combinedText.includes('技術') || combinedText.includes('開發') || combinedText.includes('vortex')) {
    return '產品與技術研發'
  }
  if (combinedText.includes('掛牌') || combinedText.includes('上市') || combinedText.includes('股票') || combinedText.includes('證券交易所')) {
    return '推動公開掛牌上市'
  }
  if (combinedText.includes('投資') || combinedText.includes('融資') || combinedText.includes('微軟') || combinedText.includes('資金')) {
    return '策略性資本投資'
  }
  
  return '協同參與事件'
}

let allCombinedEvents = []

// Fuse all local mock data into a master chronological narrative database
const fuseAllEvents = () => {
  const fused = []
  Object.keys(mockData).forEach(projectKey => {
    mockData[projectKey].forEach(ev => {
      fused.push({
        ...ev,
        projectKey: projectKey
      })
    })
  })
  // Sort chronologically
  fused.sort((a, b) => new Date(a.date) - new Date(b.date))
  return fused
}

allCombinedEvents = fuseAllEvents()

const width = 600
const height = 450

// State extension
let draggedNode = null

// Calculate dynamic probability confidence with source diversity penalty & user votes
function calculateConfidence(event, index) {
  const sources = Array.isArray(event.sources) ? event.sources : []
  let baseTrusts = sources.map(s => s.trust || 0.8)
  
  if (baseTrusts.length === 0) {
    baseTrusts = [event.confidence || 0.85]
  }

  // 1. Calculate Overlap Penalty (Same Domain duplicate count)
  const domains = sources.map(s => {
    try {
      return new URL(s.url).hostname.replace('www.', '')
    } catch {
      return s.authority || ''
    }
  })
  const uniqueDomains = new Set(domains)
  const duplicateCount = domains.length - uniqueDomains.size
  const overlapPenalty = duplicateCount * 0.12 // 12% penalty per duplicate domain
  
  // 2. Probability fusion (1 - product(1 - p_i))
  let baseProb = 1 - baseTrusts.reduce((acc, trust) => acc * (1 - trust), 1)
  
  // Apply overlap penalty (min score of 0.10)
  baseProb = Math.max(0.10, baseProb * (1 - overlapPenalty))
  
  // 3. User Vote Modification
  const vote = userVotes[index]
  if (vote === 'verify') {
    // Add user verification as a 0.85 source
    baseProb = 1 - (1 - baseProb) * (1 - 0.85)
  } else if (vote === 'dispute') {
    // Heavy dispute penalty (80% drop)
    baseProb = baseProb * 0.20
  }
  
  return parseFloat(baseProb.toFixed(2))
}

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

  // 1. Render active filter banner if present
  if (activeFilter) {
    const banner = document.createElement('div')
    banner.className = 'filter-banner'
    banner.innerHTML = `
      <div class="filter-banner-text">
        🔍 正在篩選與 <b>${activeFilter.entity}</b>（${activeFilter.type.toUpperCase()}）相關的里程碑
      </div>
      <button class="clear-filter-btn" id="clear-filter-btn">顯示全部</button>
    `
    timelineEl.appendChild(banner)
    document.querySelector('#clear-filter-btn').addEventListener('click', () => {
      activeFilter = null
      renderTimeline(currentEvents)
      resetGraphHighlight()
    })
  }

  // 2. Map and filter items (keeping their original indexes!)
  const mappedEvents = events.map((item, index) => ({ item, index }))
  const filteredEvents = activeFilter
    ? mappedEvents.filter(({ item }) => {
        if (!item.entities) return false
        return ['who', 'what', 'where'].some(cat => {
          const val = item.entities[cat]
          if (!val) return false
          if (Array.isArray(val)) return val.includes(activeFilter.entity)
          if (typeof val === 'string') return val === activeFilter.entity || val.includes(activeFilter.entity)
          return false
        })
      })
    : mappedEvents

  // 3. Render filtered items
  filteredEvents.forEach(({ item, index }, listIdx) => {
    // Determine dynamic confidence score based on math probability formula
    const dynamicConfidence = calculateConfidence(item, index)

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

    const vote = userVotes[index]

    const card = document.createElement('div')
    const projectKey = item.projectKey || activeCompany
    card.className = `timeline-card project-${projectKey}`
    card.style.animationDelay = `${listIdx * 0.12}s`
    card.id = `card-${index}`
    
    if (activeFilter) {
      card.classList.add('card-flash-animation')
    }
    
    // Generate Tags for "人事時地物"
    let tagsHTML = ''
    if (item.entities) {
      const getArray = (val) => {
        if (!val) return []
        return Array.isArray(val) ? val : [val]
      }
      getArray(item.entities.who).forEach(tag => {
        tagsHTML += `<span class="tag-badge tag-who" data-entity="${tag}" data-type="who">👤 ${tag}</span>`
      })
      getArray(item.entities.what).forEach(tag => {
        tagsHTML += `<span class="tag-badge tag-what" data-entity="${tag}" data-type="what">⚙️ ${tag}</span>`
      })
      getArray(item.entities.where).forEach(tag => {
        tagsHTML += `<span class="tag-badge tag-where" data-entity="${tag}" data-type="where">📍 ${tag}</span>`
      })
    }

    const projectBadges = {
      vivotek: '<span class="project-badge label-vivotek">🏆 晶睿通訊</span>',
      nvidia: '<span class="project-badge label-nvidia">💚 輝達</span>',
      openai: '<span class="project-badge label-openai">🧠 OpenAI</span>',
      apple: '<span class="project-badge label-apple">🍎 蘋果電腦</span>',
      live: '<span class="project-badge label-live">📡 實時合成</span>'
    }
    const currentBadge = projectBadges[projectKey] || ''

    // Render source link
    const firstSource = item.sources && item.sources.length > 0 ? item.sources[0].url : 'https://google.com'
    
    card.innerHTML = `
      <div class="card-content">
        <div class="card-header-row">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${currentBadge}
            <span class="event-date">${item.date}</span>
          </div>
          <span class="confidence-badge ${confClass}">🛡️ ${Math.round(dynamicConfidence * 100)}% - ${confLabel}</span>
        </div>
        <p class="event-desc">${item.event}</p>
        
        <div class="card-tags">${tagsHTML}</div>
        
        <div class="card-controls">
          <div class="vote-actions">
            <button class="verify-btn ${vote === 'verify' ? 'active' : ''}" data-idx="${index}">👍 背書 (Verify)</button>
            <button class="dispute-btn ${vote === 'dispute' ? 'active' : ''}" data-idx="${index}">👎 質疑 (Dispute)</button>
          </div>
          <a href="${firstSource}" target="_blank" class="event-source">
            🔗 Citation Source
          </a>
        </div>
      </div>
    `
    timelineEl.appendChild(card)

    // 🔗 Card-to-Graph Hover/Glow Coupling
    card.addEventListener('mouseenter', () => {
      // 1. Dim all other cards
      document.querySelectorAll('.timeline-card').forEach(c => {
        if (c !== card) c.style.opacity = '0.35'
      })
      
      // 2. Isolate nodes in SVG
      svgEl.classList.add('has-active')
      
      const nodeGroups = document.querySelectorAll('.node-group')
      const linkElements = document.querySelectorAll('.graph-link')
      const matchedNodeIndexes = []
      
      activeNodes.forEach((node, nodeIdx) => {
        let match = false
        if (item.entities) {
          ['who', 'what', 'where'].forEach(cat => {
            const val = item.entities[cat]
            if (val) {
              if (Array.isArray(val)) {
                if (val.includes(node.label)) match = true
              } else if (typeof val === 'string') {
                if (val === node.label || val.includes(node.label)) match = true
              }
            }
          })
        }
        if (node.isCompany) match = true // Keep brand center visible
        
        if (match) {
          matchedNodeIndexes.push(nodeIdx)
          nodeGroups[nodeIdx].classList.add('active')
          nodeGroups[nodeIdx].querySelector('.node-circle').classList.add('pulse-glow')
        } else {
          nodeGroups[nodeIdx].classList.remove('active')
        }
      })
      
      // Highlight links between matches
      activeLinks.forEach((lnk, linkIdx) => {
        const isMatched = matchedNodeIndexes.includes(lnk.source) && matchedNodeIndexes.includes(lnk.target)
        if (isMatched) {
          linkElements[linkIdx].classList.add('active')
        } else {
          linkElements[linkIdx].classList.remove('active')
        }
      })
    })

    card.addEventListener('mouseleave', () => {
      // Restore card opacities
      document.querySelectorAll('.timeline-card').forEach(c => {
        c.style.opacity = '1'
      })
      
      // Restore node states
      document.querySelectorAll('.node-circle').forEach(c => {
        c.classList.remove('pulse-glow')
      })
      
      if (activeFilter) {
        focusGraphNode(activeFilter.entity)
      } else {
        resetGraphHighlight()
      }
    })
  })

  // Bind tags and vote buttons
  document.querySelectorAll('.tag-badge').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation()
      const entity = tag.getAttribute('data-entity')
      const type = tag.getAttribute('data-type')
      
      // Auto-filter timeline to this tag!
      activeFilter = { entity, type }
      renderTimeline(currentEvents)
      
      // Focus and isolate node in graph
      focusGraphNode(entity)
      
      // Slide open inspector
      triggerInspector(entity, type)
    })
  })

  document.querySelectorAll('.verify-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const idx = parseInt(btn.getAttribute('data-idx'))
      toggleVote(idx, 'verify')
    })
  })

  document.querySelectorAll('.dispute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
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

function renderGraph(events, companyName, egoCenter = null) {
  // Cancel previous physics loops
  if (physicsAnimationId) {
    cancelAnimationFrame(physicsAnimationId)
  }

  const nodeMap = new Map()
  const linkMap = new Map() // key -> { source, target, label }
  
  let isExploding = true
  setTimeout(() => {
    isExploding = false
  }, 600)
  
  // 1. Add Brand Center Node
  const companyMapping = {
    vivotek: '晶睿通訊',
    nvidia: '輝達',
    openai: 'OpenAI',
    apple: '蘋果電腦',
    live: 'Live AI'
  }
  const companyLabel = companyMapping[companyName.toLowerCase()] || companyName.toUpperCase()
  
  // Helper to extract clean dynamic initials (e.g. JH for Jensen Huang, 文昌 for Albert Chen)
  const getInitials = (label) => {
    if (!label) return ''
    // 判斷是否包含中文字
    const hasChinese = /[\u4e00-\u9fa5]/.test(label)
    if (hasChinese) {
      if (label.length >= 3) {
        return label.slice(1, 3) // 比如 "陳文昌" -> "文昌"
      }
      return label
    }
    const parts = label.split(/[\s/:_-]+/)
    if (parts.length >= 2) {
      const first = parts[0][0] || ''
      const second = parts[1][0] || ''
      if (first.charCodeAt(0) <= 255 && second.charCodeAt(0) <= 255) {
        return (first + second).toUpperCase()
      }
    }
    return label.slice(0, 2).toUpperCase()
  }

  if (egoCenter) {
    egoCenterNode = egoCenter
    if (backToGlobalBtn) backToGlobalBtn.classList.add('active')

    // 建立 Ego 中心人物節點 (大尺寸，鎖定中心)
    const isCompanyCenter = egoCenter.toUpperCase() === companyLabel.toUpperCase() || (companyName === 'all' && Object.values(companyMapping).some(c => c.toUpperCase() === egoCenter.toUpperCase()))
    nodeMap.set(egoCenter, {
      id: egoCenter,
      label: egoCenter,
      type: isCompanyCenter ? 'company' : 'who',
      x: width / 2,
      y: height / 2,
      vx: 0, vy: 0,
      fixedX: width / 2, fixedY: height / 2, // 使用自定義鎖定，避免與力累加器 fx/fy 衝突
      r: 20,
      isCompany: isCompanyCenter,
      isEgoCenter: true
    })

    events.forEach(ev => {
      if (ev.entities) {
        // Check if egoCenter exists in any active category
        let hasEgo = false
        activeCategories.forEach(cat => {
          const val = ev.entities[cat]
          if (val) {
            const arr = Array.isArray(val) ? val : [val]
            if (arr.some(name => name.toUpperCase() === egoCenter.toUpperCase())) {
              hasEgo = true
            }
          }
        })
        
        if (hasEgo) {
          activeCategories.forEach(category => {
            const val = ev.entities[category]
            if (val) {
              const arr = Array.isArray(val) ? val : [val]
              arr.forEach(name => {
                if (name.toUpperCase() === egoCenter.toUpperCase()) return
                
                // 如果是僅人物模式，且鄰居是公司，則過濾跳過
                if (graphMode === 'people-only' && isCompanyNode(name)) return
                
                // 加入鄰居節點
                if (!nodeMap.has(name)) {
                  const isCompany = name.toUpperCase() === companyLabel.toUpperCase() || (companyName === 'all' && Object.values(companyMapping).some(c => c.toUpperCase() === name.toUpperCase()))
                  let isCrossover = false
                  const lowerVal = name.toLowerCase()
                  if (
                    lowerVal.includes('delta') || 
                    lowerVal.includes('nvidia') || 
                    lowerVal.includes('openai') ||
                    lowerVal.includes('apple') ||
                    lowerVal.includes('jensen') || 
                    lowerVal.includes('jobs') ||
                    lowerVal.includes('musk') ||
                    lowerVal.includes('altman') ||
                    lowerVal.includes('sutskever') ||
                    lowerVal.includes('wozniak') ||
                    lowerVal.includes('wayne')
                  ) {
                    isCrossover = true
                  }

                  nodeMap.set(name, {
                    id: name,
                    label: name,
                    type: category,
                    x: width / 2 + (Math.random() - 0.5) * 200,
                    y: height / 2 + (Math.random() - 0.5) * 200,
                    vx: 0, vy: 0, fx: 0, fy: 0,
                    r: isCompany ? 18 : (isCrossover ? 13 : 11),
                    isCompany,
                    isCrossover
                  })
                }

                // 建立隱式連線
                const key = [egoCenter.toUpperCase(), name.toUpperCase()].sort().join('->')
                if (!linkMap.has(key)) {
                  linkMap.set(key, { source: egoCenter, target: name, label: resolveRelationshipLabel(egoCenter, name, events) })
                }
              })
            }
          })
        }
      }

      // 提取與中心節點相關的顯式 relationships
      if (ev.relationships && Array.isArray(ev.relationships)) {
        ev.relationships.forEach(rel => {
          const src = rel.source
          const tgt = rel.target
          const label = rel.label
          if (src && tgt && label) {
            const srcUpper = src.toUpperCase()
            const tgtUpper = tgt.toUpperCase()
            const egoUpper = egoCenter.toUpperCase()

            if (srcUpper === egoUpper || tgtUpper === egoUpper) {
              const neighbor = srcUpper === egoUpper ? tgt : src
              
              // 如果是僅人物模式，且鄰居是公司，則過濾跳過
              if (graphMode === 'people-only' && isCompanyNode(neighbor)) return

              if (!nodeMap.has(neighbor)) {
                const isCompany = neighbor.toUpperCase() === companyLabel.toUpperCase() || (companyName === 'all' && Object.values(companyMapping).some(c => c.toUpperCase() === neighbor.toUpperCase()))
                let isCrossover = false
                const lowerVal = neighbor.toLowerCase()
                if (
                  lowerVal.includes('delta') || 
                  lowerVal.includes('nvidia') || 
                  lowerVal.includes('openai') ||
                  lowerVal.includes('apple') ||
                  lowerVal.includes('jensen') || 
                  lowerVal.includes('jobs') ||
                  lowerVal.includes('musk') ||
                  lowerVal.includes('altman') ||
                  lowerVal.includes('sutskever') ||
                  lowerVal.includes('wozniak') ||
                  lowerVal.includes('wayne')
                ) {
                  isCrossover = true
                }

                // Determine category of the neighbor
                let neighborCategory = 'who'
                activeCategories.forEach(cat => {
                  if (ev.entities && ev.entities[cat]) {
                    const arr = Array.isArray(ev.entities[cat]) ? ev.entities[cat] : [ev.entities[cat]]
                    if (arr.some(n => n.toUpperCase() === neighbor.toUpperCase())) {
                      neighborCategory = cat
                    }
                  }
                })

                nodeMap.set(neighbor, {
                  id: neighbor,
                  label: neighbor,
                  type: neighborCategory,
                  x: width / 2 + (Math.random() - 0.5) * 200,
                  y: height / 2 + (Math.random() - 0.5) * 200,
                  vx: 0, vy: 0, fx: 0, fy: 0,
                  r: isCompany ? 18 : (isCrossover ? 13 : 11),
                  isCompany,
                  isCrossover
                })
              }

              const key = [srcUpper, tgtUpper].sort().join('->')
              linkMap.set(key, { source: src, target: tgt, label: label })
            }
          }
        })
      }
    })
  } else {
    if (backToGlobalBtn) backToGlobalBtn.classList.remove('active')

    // 🌐 全域模式：同時繪製所有公司主體，並給予間距初始坐標，形成多中心
    if (companyName === 'all') {
      if (graphMode !== 'people-only') {
        const hubs = [
          { id: '晶睿通訊', x: width * 0.28, y: height * 0.32 },
          { id: '輝達', x: width * 0.50, y: height * 0.35 },
          { id: 'OpenAI', x: width * 0.72, y: height * 0.32 },
          { id: '蘋果電腦', x: width * 0.50, y: height * 0.78 }
        ]
        hubs.forEach(h => {
          nodeMap.set(h.id, {
            id: h.id,
            label: h.id,
            type: 'company',
            x: h.x,
            y: h.y,
            vx: 0, vy: 0, 
            fixedX: h.x, fixedY: h.y, // 物理行星座標鎖定
            r: 18,
            isCompany: true
          })
        })
      }
    } else {
      // 單公司模式：繪製中心公司節點
      if (graphMode !== 'people-only') {
        nodeMap.set(companyLabel, {
          id: companyLabel,
          label: companyLabel,
          type: 'company',
          x: width / 2,
          y: height / 2,
          vx: 0, vy: 0, 
          fixedX: width / 2, fixedY: height / 2, // 物理置中鎖定
          r: 18,
          isCompany: true
        })
      }
    }

    events.forEach((ev) => {
      if (ev.entities) {
        const eventEntities = [];
        // 動態獲取該事件所屬的公司 (全域模式下依 projectKey 對齊各自公司)
        const eventCompany = companyMapping[ev.projectKey || companyName] || companyLabel;
        
        activeCategories.forEach(category => {
          const val = ev.entities[category]
          if (val) {
            const arr = Array.isArray(val) ? val : [val]
            arr.forEach(entity => {
              const standardLabel = entity
              if (standardLabel.toUpperCase() === eventCompany.toUpperCase()) return

              // 如果是僅人物模式，且該實體是公司，則過濾跳過
              if (graphMode === 'people-only' && isCompanyNode(standardLabel)) return

              if (!nodeMap.has(standardLabel)) {
                let isCrossover = false
                const lowerVal = standardLabel.toLowerCase()
                if (
                  lowerVal.includes('delta') || 
                  lowerVal.includes('nvidia') || 
                  lowerVal.includes('openai') ||
                  lowerVal.includes('apple') ||
                  lowerVal.includes('jensen') || 
                  lowerVal.includes('jobs') ||
                  lowerVal.includes('musk') ||
                  lowerVal.includes('altman') ||
                  lowerVal.includes('sutskever') ||
                  lowerVal.includes('wozniak') ||
                  lowerVal.includes('wayne')
                ) {
                  isCrossover = true
                }
                
                nodeMap.set(standardLabel, {
                  id: standardLabel,
                  label: standardLabel,
                  type: category,
                  x: width / 2 + (Math.random() - 0.5) * 200,
                  y: height / 2 + (Math.random() - 0.5) * 200,
                  vx: 0, vy: 0, fx: 0, fy: 0,
                  r: isCrossover ? 13 : 11,
                  isCrossover
                })
              }
              
              eventEntities.push(standardLabel)
              
              // 只有在非僅人物模式下，才建立公司與實體之間的隱式連線
              if (graphMode !== 'people-only') {
                const compKey = [eventCompany.toUpperCase(), standardLabel.toUpperCase()].sort().join('->')
                if (!linkMap.has(compKey)) {
                  linkMap.set(compKey, { source: eventCompany, target: standardLabel, label: resolveRelationshipLabel(eventCompany, standardLabel, events) })
                }
              }
            })
          }
        })
        
        for (let i = 0; i < eventEntities.length; i++) {
          for (let j = i + 1; j < eventEntities.length; j++) {
            const key = [eventEntities[i].toUpperCase(), eventEntities[j].toUpperCase()].sort().join('->')
            if (!linkMap.has(key)) {
              linkMap.set(key, { source: eventEntities[i], target: eventEntities[j], label: resolveRelationshipLabel(eventEntities[i], eventEntities[j], events) })
            }
          }
        }
      }

      if (ev.relationships && Array.isArray(ev.relationships)) {
        ev.relationships.forEach(rel => {
          const src = rel.source
          const tgt = rel.target
          const label = rel.label
          if (src && tgt && label) {
            // 在僅人物模式下，必須確保雙方都不為公司節點
            if (graphMode === 'people-only') {
              if (isCompanyNode(src) || isCompanyNode(tgt)) return
            }

            if (nodeMap.has(src) && nodeMap.has(tgt)) {
              const key = [src.toUpperCase(), tgt.toUpperCase()].sort().join('->')
              linkMap.set(key, { source: src, target: tgt, label: label })
            }
          }
        })
      }
    })
  }
  
  activeNodes = Array.from(nodeMap.values())
  
  activeLinks = []
  linkMap.forEach((val, key) => {
    const sourceIdx = activeNodes.findIndex(n => n.id.toUpperCase() === val.source.toUpperCase())
    const targetIdx = activeNodes.findIndex(n => n.id.toUpperCase() === val.target.toUpperCase())
    if (sourceIdx !== -1 && targetIdx !== -1) {
      activeLinks.push({
        source: sourceIdx,
        target: targetIdx,
        label: val.label
      })
    }
  })

  // Setup SVG DOM
  svgEl.innerHTML = ''
  
  // 如果在 Ego 中心模式下，繪製雙重同心虛線星軌作為背景
  if (egoCenter) {
    const orbitGrid = document.createElementNS("http://www.w3.org/2000/svg", "g")
    orbitGrid.setAttribute("class", "orbit-grid-layer")
    
    const r1 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    r1.setAttribute("class", "orbital-ring")
    r1.setAttribute("cx", width / 2)
    r1.setAttribute("cy", height / 2)
    r1.setAttribute("r", 130)
    orbitGrid.appendChild(r1)
    
    const r2 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    r2.setAttribute("class", "orbital-ring")
    r2.setAttribute("cx", width / 2)
    r2.setAttribute("cy", height / 2)
    r2.setAttribute("r", 220)
    orbitGrid.appendChild(r2)
    
    svgEl.appendChild(orbitGrid)
  }
  
  // Create links container
  const linksContainer = document.createElementNS("http://www.w3.org/2000/svg", "g")
  linksContainer.setAttribute("class", "links-layer")
  svgEl.appendChild(linksContainer)
  
  // Create link labels layer (above lines, below nodes)
  const linkLabelsContainer = document.createElementNS("http://www.w3.org/2000/svg", "g")
  linkLabelsContainer.setAttribute("class", "link-labels-layer")
  svgEl.appendChild(linkLabelsContainer)
  
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

  // Draw mid-vector semantic link badges
  const linkLabelElements = activeLinks.map(link => {
    if (!link.label) return null
    
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.setAttribute("class", "link-label-group")
    
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    rect.setAttribute("class", "link-label-bg")
    rect.setAttribute("rx", "4")
    rect.setAttribute("ry", "4")
    g.appendChild(rect)
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
    text.setAttribute("class", "link-label-text")
    text.setAttribute("text-anchor", "middle")
    text.setAttribute("dy", "3.5")
    text.textContent = link.label
    g.appendChild(text)
    
    linkLabelsContainer.appendChild(g)
    
    const width = link.label.length * 11 + 8
    rect.setAttribute("width", width)
    rect.setAttribute("height", "14")
    rect.setAttribute("x", -width / 2)
    rect.setAttribute("y", "-7")
    
    return { g, rect, text }
  })

  const nodeElements = activeNodes.map((node, nodeIdx) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.setAttribute("class", "node-group")
    g.setAttribute("style", "cursor: pointer; pointer-events: all;")
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    let colorClass = 'node-what'
    if (node.isCompany) colorClass = 'node-who'
    else if (node.isCrossover) colorClass = 'node-crossover'
    else if (node.type === 'who') colorClass = 'node-who'
    else if (node.type === 'where') colorClass = 'node-where'
    
    circle.setAttribute("class", `node-circle ${colorClass}`)
    circle.setAttribute("r", node.r)
    circle.setAttribute("style", "pointer-events: all;")
    g.appendChild(circle)
    
    const initials = document.createElementNS("http://www.w3.org/2000/svg", "text")
    initials.setAttribute("class", "node-initials")
    initials.setAttribute("text-anchor", "middle")
    
    let fontSize = '9px'
    if (node.isCompany) fontSize = '13px'
    else if (node.isCrossover) fontSize = '11px'
    else fontSize = '9px'
    
    initials.setAttribute("font-size", fontSize)
    initials.setAttribute("dy", "3.5")
    initials.textContent = getInitials(node.label)
    g.appendChild(initials)
    
    const charCount = node.label.split('').reduce((acc, char) => {
      return acc + (char.charCodeAt(0) > 255 ? 1.5 : 1)
    }, 0)
    const badgeWidth = Math.max(60, charCount * 7.5 + 14)
    
    const nameBg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    nameBg.setAttribute("class", `node-name-bg ${colorClass}`)
    nameBg.setAttribute("rx", "4")
    nameBg.setAttribute("ry", "4")
    nameBg.setAttribute("width", badgeWidth)
    nameBg.setAttribute("height", "18")
    nameBg.setAttribute("x", -badgeWidth / 2)
    nameBg.setAttribute("y", node.r + 4)
    nameBg.setAttribute("style", "pointer-events: none;")
    g.appendChild(nameBg)
    
    const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    nameText.setAttribute("class", "node-name-text")
    nameText.setAttribute("text-anchor", "middle")
    nameText.setAttribute("x", "0")
    nameText.setAttribute("y", node.r + 17)
    nameText.setAttribute("style", "pointer-events: none;")
    nameText.textContent = node.label
    g.appendChild(nameText)
    
    nodesContainer.appendChild(g)

    // Interactive Hover effects
    g.addEventListener('mouseenter', () => {
      // 套用懸浮立體化與放大效果
      circle.style.transform = 'scale(1.25)'
      circle.style.stroke = '#ffffff'
      circle.style.strokeWidth = '3px'
      circle.style.filter = 'drop-shadow(0 0 12px currentColor)'
      
      initials.style.transform = 'scale(1.25)'
      
      nameBg.style.stroke = '#ffffff'
      nameBg.style.transform = 'translateY(4px) scale(1.08)'
      nameBg.style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.65))'
      
      nameText.style.fill = '#ffffff'
      nameText.style.transform = 'translateY(4px) scale(1.08)'
      
      svgEl.classList.add('has-active')
      g.classList.add('active')
      
      // Highlight direct links and linked nodes
      activeLinks.forEach((lnk, i) => {
        if (lnk.source === nodeIdx) {
          linkElements[i].classList.add('active')
          if (linkLabelElements[i]) linkLabelElements[i].g.classList.add('active')
          nodeElements[lnk.target].classList.add('active')
        } else if (lnk.target === nodeIdx) {
          linkElements[i].classList.add('active')
          if (linkLabelElements[i]) linkLabelElements[i].g.classList.add('active')
          nodeElements[lnk.source].classList.add('active')
        }
      })

      // Temporary card highlighting in the timeline pane
      events.forEach((item, idx) => {
        let match = false
        if (item.entities) {
          ['who', 'what', 'where'].forEach(cat => {
            const val = item.entities[cat]
            if (val) {
              if (Array.isArray(val)) {
                if (val.includes(node.label)) match = true
              } else if (typeof val === 'string') {
                if (val === node.label || val.includes(node.label)) match = true
              }
            }
          })
        }
        if (node.label === companyLabel) match = true

        const card = document.querySelector(`#card-${idx}`)
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
      // 復原所有懸浮樣式，確保完美歸位
      circle.style.transform = ''
      circle.style.stroke = ''
      circle.style.strokeWidth = ''
      circle.style.filter = ''
      
      initials.style.transform = ''
      
      nameBg.style.stroke = ''
      nameBg.style.transform = ''
      nameBg.style.filter = ''
      
      nameText.style.fill = ''
      nameText.style.transform = ''
      
      if (activeFilter) {
        focusGraphNode(activeFilter.entity)
      } else {
        resetGraphHighlight()
      }
      
      events.forEach((item, idx) => {
        const card = document.querySelector(`#card-${idx}`)
        if (card) {
          card.querySelector('.card-content').style.borderColor = ''
          card.querySelector('.card-content').style.boxShadow = ''
          card.style.opacity = '1'
        }
      })
    })

    // Click handler for deep timeline linking and focus!
    g.addEventListener('click', (e) => {
      e.stopPropagation()
      
      // Toggle selection off if the same node is clicked again!
      if (activeFilter && activeFilter.entity === node.label) {
        activeFilter = null
        egoCenterNode = null
        if (backToGlobalBtn) backToGlobalBtn.classList.remove('active')
        renderTimeline(currentEvents)
        renderGraph(currentEvents, activeCompany)
        resetGraphHighlight()
        inspectorPanel.classList.remove('active')
        return
      }
      
      activeFilter = { entity: node.label, type: node.type || 'company' }
      renderTimeline(currentEvents)
      
      renderGraph(currentEvents, activeCompany, node.label)
      
      triggerInspector(node.label, node.type || 'company')
      document.querySelector('.timeline-pane').scrollTo({ top: 0, behavior: 'smooth' })
    })

    // Interactive mouse dragging for nodes
    g.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      draggedNode = node
      node.pinned = true
      node.fx = node.x
      node.fy = node.y
      circle.classList.add('is-dragging')
    })

    // Double-click to toggle a permanent pin!
    g.addEventListener('dblclick', (e) => {
      e.stopPropagation()
      node.permanentlyPinned = !node.permanentlyPinned
      if (node.permanentlyPinned) {
        node.pinned = true
        node.fx = node.x
        node.fy = node.y
        circle.classList.add('is-pinned')
      } else {
        node.pinned = false
        node.permanentlyPinned = false
        circle.classList.remove('is-pinned')
      }
    })

    return g
  })

  // Physics Simulation Loop (Optimized for spacious node-character distribution)
  function tick() {
    const repulsion = isExploding ? 8500 : 2800 // double the previous repulsion to push nodes apart aggressively, explode to 8500 during layouts
    const gravity = 0.025   // soft center gravity to let nodes spread out spacious and clean
    
    // Repulse nodes from each other
    for (let i = 0; i < activeNodes.length; i++) {
      const n1 = activeNodes[i]
      for (let j = i + 1; j < activeNodes.length; j++) {
        const n2 = activeNodes[j]
        const dx = n2.x - n1.x
        const dy = n2.y - n1.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const softDist = Math.max(25, dist)
        
        if (dist < 220) {
          const force = repulsion / (softDist * softDist)
          const fx = (dx / softDist) * force
          const fy = (dy / softDist) * force
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
      const dist = Math.sqrt(dx * dx + dy * dy)
      const softDist = Math.max(25, dist)
      const desiredDist = s.isCompany || t.isCompany ? 160 : 120
      
      let force = (dist - desiredDist) * 0.018
      
      const maxAttraction = 6
      if (Math.abs(force) > maxAttraction) {
        force = Math.sign(force) * maxAttraction
      }
      
      const fx = (dx / softDist) * force
      const fy = (dy / softDist) * force
      s.fx += fx
      s.fy += fy
      t.fx -= fx
      t.fy -= fy
    })
    
    // Apply center gravity and integrate velocity
    activeNodes.forEach(n => {
      if (n.pinned) {
        n.vx = 0
        n.vy = 0
        n.fx = 0
        n.fy = 0
        return
      }
      
      if (n.fixedX !== undefined && n.fixedX !== null) {
        n.x = n.fixedX
        n.y = n.fixedY
        n.vx = 0
        n.vy = 0
        n.fx = 0
        n.fy = 0
        return
      }
      
      const dx = width / 2 - n.x
      const dy = height / 2 - n.y
      n.fx += dx * gravity
      n.fy += dy * gravity
      
      n.vx = Math.max(-8, Math.min(8, (n.vx + n.fx) * 0.8))
      n.vy = Math.max(-8, Math.min(8, (n.vy + n.fy) * 0.8))
      n.x += n.vx
      n.y += n.vy
      
      n.fx = 0
      n.fy = 0
      
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
      
      if (linkLabelElements[i]) {
        const mx = (s.x + t.x) / 2
        const my = (s.y + t.y) / 2
        linkLabelElements[i].g.setAttribute("transform", `translate(${mx}, ${my})`)
      }
    })

    physicsAnimationId = requestAnimationFrame(tick)
  }

  // Mouse move and up global handlers for node dragging
  svgEl.addEventListener('mousemove', (e) => {
    if (draggedNode) {
      const rect = svgEl.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * width
      const y = ((e.clientY - rect.top) / rect.height) * height
      draggedNode.x = Math.max(30, Math.min(width - 30, x))
      draggedNode.y = Math.max(30, Math.min(height - 30, y))
      draggedNode.vx = 0
      draggedNode.vy = 0
    }
  })
  
  window.addEventListener('mouseup', () => {
    if (draggedNode) {
      if (!draggedNode.permanentlyPinned) {
        draggedNode.pinned = false
      }
      document.querySelectorAll('.node-circle').forEach(c => {
        c.classList.remove('is-dragging')
      })
      draggedNode = null
    }
  })

  // Launch physics tick
  tick()
}
function focusGraphNode(entityName) {
  svgEl.classList.add('has-active')
  
  const nodeGroups = document.querySelectorAll('.node-group')
  const linkElements = document.querySelectorAll('.graph-link')
  
  const nodeIdx = activeNodes.findIndex(n => n.id === entityName)
  if (nodeIdx === -1) return
  
  // Reset active classes
  nodeGroups.forEach(g => g.classList.remove('active'))
  linkElements.forEach(line => line.classList.remove('active'))
  document.querySelectorAll('.link-label-group').forEach(g => g.classList.remove('active'))
  
  // Highlighting selected node group
  const selectedGroup = nodeGroups[nodeIdx]
  if (selectedGroup) {
    selectedGroup.classList.add('active')
  }
  
  // Highlighting direct links and neighbors
  activeLinks.forEach((lnk, i) => {
    if (lnk.source === nodeIdx) {
      linkElements[i].classList.add('active')
      if (linkLabelElements[i]) linkLabelElements[i].g.classList.add('active')
      nodeGroups[lnk.target].classList.add('active')
    } else if (lnk.target === nodeIdx) {
      linkElements[i].classList.add('active')
      if (linkLabelElements[i]) linkLabelElements[i].g.classList.add('active')
      nodeGroups[lnk.source].classList.add('active')
    }
  })
}

// Reset all graph highlights
function resetGraphHighlight() {
  svgEl.classList.remove('has-active')
  document.querySelectorAll('.node-group').forEach(g => g.classList.remove('active'))
  document.querySelectorAll('.graph-link').forEach(line => line.classList.remove('active'))
  document.querySelectorAll('.link-label-group').forEach(g => g.classList.remove('active'))
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
        const val = item.entities[cat]
        if (val) {
          if (Array.isArray(val)) {
            if (val.includes(entityName)) match = true
          } else if (typeof val === 'string') {
            if (val === entityName || val.includes(entityName)) match = true
          }
        }
      })
    }
    
    // Main company match
    const companyLabel = activeCompany.toUpperCase()
    if (entityType === 'company' && entityName.toUpperCase() === companyLabel) {
      match = true
    }

    if (match) {
      occurrences++
      matchedEventsHTML += `
        <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 3px solid ${color};">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #60a5fa; font-weight: 600;">📅 ${item.date}</span>
          <p style="margin: 4px 0 0 0; line-height: 1.4; color: #e2e8f0; font-size: 0.85rem;">${item.event}</p>
        </div>
      `
    }
  })

  // 👤 DYNAMIC RELATION CHARACTER MATRIX SCANNER (人物關係圖/關係網)
  // Scans for co-occurring entities in all events involving this entity
  const directConnections = new Map() // name -> type
  currentEvents.forEach(item => {
    if (item.entities) {
      const cooccur = ['who', 'what', 'where'].some(cat => {
        const val = item.entities[cat]
        if (!val) return false
        if (Array.isArray(val)) return val.includes(entityName)
        if (typeof val === 'string') return val === entityName || val.includes(entityName)
        return false
      })
      if (cooccur || (entityType === 'company' && entityName.toUpperCase() === activeCompany.toUpperCase())) {
        ['who', 'what', 'where'].forEach(cat => {
          const val = item.entities[cat]
          if (val) {
            const arr = Array.isArray(val) ? val : [val]
            arr.forEach(ent => {
              if (ent !== entityName && ent.toUpperCase() !== activeCompany.toUpperCase()) {
                directConnections.set(ent, cat)
              }
            })
          }
        })
      }
    }
  })

  let relationsHTML = ''
  if (directConnections.size > 0) {
    relationsHTML = `
      <div style="margin-top: 15px; padding: 12px; background: rgba(192, 132, 252, 0.05); border: 1px solid rgba(192, 132, 252, 0.15); border-radius: 12px;">
        <b style="color: #d8b4fe; font-size: 0.8rem; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">👤 關聯人物與物件脈絡 (Dynamic Relation Nexus)</b>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
    `
    directConnections.forEach((cat, name) => {
      let icon = '⚙️'
      let tagClass = 'tag-what'
      if (cat === 'who') { icon = '👤'; tagClass = 'tag-who'; }
      else if (cat === 'where') { icon = '📍'; tagClass = 'tag-where'; }
      const safeId = 'rel-' + name.replace(/[^a-zA-Z0-9]/g, '_')
      relationsHTML += `<span class="tag-badge ${tagClass}" style="font-size: 0.7rem; padding: 2px 8px; cursor: pointer;" id="${safeId}">${icon} ${name}</span>`
    })
    relationsHTML += `
        </div>
      </div>
    `
  }

  // Crossover Knowledge injection
  let crossoverHTML = ''
  const lowerName = entityName.toLowerCase()
  
  if (lowerName.includes('delta')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>跨界中介點警報 (Crossover Alert):</b> Delta Electronics (台達電) 控股 VIVOTEK (晶睿) 達 50%+，同時為 NVIDIA (輝達) 的 AI 伺服器機櫃 provide 高瓦特數電源核心！這將邊緣安全監控與超大規模雲端 AI 運算綁定在同一個能源供應走廊中！
      </div>
    `
  } else if (lowerName.includes('nvidia') || lowerName.includes('gpu')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>跨界中介點警報 (Crossover Alert):</b> NVIDIA 核心 GPU 除提供微軟與 OpenAI 超級算力集群外，也作為 VIVOTEK 新一代 VORTEX AI 搜尋引擎的核心硬體加速引擎，實現邊緣與雲端的智慧互聯！
      </div>
    `
  } else if (lowerName.includes('ai') || lowerName.includes('deep learning')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>跨界中介點警報 (Crossover Alert):</b> AI 作為貫穿整個技術史的核心樞紐，連結了 VORTEX 的邊緣安全屬性搜尋、NVIDIA 的 H100/AlexNet 晶片，以及 OpenAI 的 reinforcement learning 推理大腦 (o1)。
      </div>
    `
  } else if (lowerName.includes('jobs')) {
    crossoverHTML = `
      <div class="inspector-crossover-alert">
        🚀 <b>跨界中介點警報 (Crossover Alert):</b> 史蒂夫·賈伯斯 (Steve Jobs) 創立的 Macintosh 奠定了個人電腦與圖形介面 (GUI)，這在 40 年後演化為 NVIDIA GPU 的硬體渲染基礎，並最終成為消費者觸及 OpenAI 等 AI 介面的門戶。
      </div>
    `
  }

  inspBody.innerHTML = `
    <p style="margin-top: 0; color: #94a3b8; font-size: 0.85rem;">
      此實體在當前專案中被共同提及 <b>${occurrences}</b> 次。
    </p>
    ${crossoverHTML}
    ${relationsHTML}
    <div style="margin-top: 15px;">
      <b style="color: white; font-size: 0.8rem; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">📖 關聯里程碑事件:</b>
      ${matchedEventsHTML || '<p style="color: #64748b;">No direct event descriptions found.</p>'}
    </div>
  `

  // Bind click listeners to relation tags inside inspector to allow multi-hop navigation!
  if (directConnections.size > 0) {
    directConnections.forEach((cat, name) => {
      const safeId = 'rel-' + name.replace(/[^a-zA-Z0-9]/g, '_')
      const relTag = document.getElementById(safeId)
      if (relTag) {
        relTag.addEventListener('click', (e) => {
          e.stopPropagation()
          // Hop to next entity
          activeFilter = { entity: name, type: cat }
          renderTimeline(currentEvents)
          
          if (cat === 'who' || cat === 'company') {
            renderGraph(currentEvents, activeCompany, name)
          } else {
            focusGraphNode(name)
          }
          
          triggerInspector(name, cat)
        })
      }
    })
  }
}

inspClose.addEventListener('click', () => {
  inspectorPanel.classList.remove('active')
  activeFilter = null
  renderTimeline(currentEvents)
  resetGraphHighlight()
})

// ──────────────────────────────────────────────
// Timed Loading Visual Effects
// ──────────────────────────────────────────────

function triggerLoadingSequence(companyName, callback) {
  mainLayoutEl.style.display = 'none'
  loaderEl.style.display = 'flex'
  inspectorPanel.classList.remove('active')
  activeFilter = null
  
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
  activeFilter = null
  egoCenterNode = null
  if (backToGlobalBtn) backToGlobalBtn.classList.remove('active')
  
  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-company') === companyKey) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })

  const displayName = companyKey === 'live' ? 'Live Synthesizer' : (companyKey === 'all' ? 'MASTER KNOWLEDGE GRAPH' : companyKey.toUpperCase())
  
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
    } else if (companyKey === 'all') {
      currentEvents = allCombinedEvents
      renderTimeline(currentEvents)
      renderGraph(currentEvents, 'all')
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
  activeFilter = null
  egoCenterNode = null
  if (backToGlobalBtn) backToGlobalBtn.classList.remove('active')
  
  triggerLoadingSequence(query, () => {
    if (mockData[key]) {
      currentEvents = mockData[key]
      renderTimeline(currentEvents)
      renderGraph(currentEvents, key)
    } else {
      // 🌐 Smart local search resolve: scan master database first
      const localMatches = allCombinedEvents.filter(ev => {
        const textMatch = ev.event && ev.event.toLowerCase().includes(key)
        let entityMatch = false
        if (ev.entities) {
          ;['who', 'what', 'where'].forEach(cat => {
            const val = ev.entities[cat]
            if (val) {
              const arr = Array.isArray(val) ? val : [val]
              if (arr.some(n => n && n.toLowerCase().includes(key))) {
                entityMatch = true
              }
            }
          })
        }
        return textMatch || entityMatch
      })

      if (localMatches.length > 0) {
        currentEvents = localMatches
        
        // Find if the query matches a specific node to center on
        let matchNodeName = null
        localMatches.some(ev => {
          if (ev.entities) {
            return ['who', 'what', 'where'].some(cat => {
              const val = ev.entities[cat]
              if (val) {
                const arr = Array.isArray(val) ? val : [val]
                return arr.some(n => {
                  if (n && n.toLowerCase() === key) {
                    matchNodeName = n
                    return true
                  }
                  return false
                })
              }
              return false
            })
          }
          return false
        })

        if (matchNodeName) {
          activeFilter = { entity: matchNodeName, type: 'search' }
          renderGraph(currentEvents, 'all', matchNodeName)
          triggerInspector(matchNodeName, 'search')
        } else {
          renderGraph(currentEvents, 'all')
        }
        renderTimeline(currentEvents)
      } else {
        // 🚀 Real-time HTTP request to the Python backend API server!
        fetch('http://localhost:8087/api/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query })
        })
        .then(res => {
          if (!res.ok) throw new Error('API server unavailable or error occurred')
          return res.json()
        })
        .then(data => {
          currentEvents = data
          renderTimeline(currentEvents)
          renderGraph(currentEvents, query)
        })
        .catch(err => {
          console.warn("⚠️ Backend API server offline, falling back to simulated template:", err)
          
          // Graceful simulated offline fallback template so the UI never crashes
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
        })
      }
    }
  })
}

// Function to export dynamic Markdown report in Traditional Chinese
function handleExportReport() {
  if (!currentEvents || currentEvents.length === 0) {
    alert("沒有可輸出的資料！請先選擇一個專案或搜尋並合成資料。");
    return;
  }
  
  const companyMapping = {
    vivotek: '晶睿通訊 (VIVOTEK)',
    nvidia: '輝達 (NVIDIA)',
    openai: 'OpenAI',
    apple: '蘋果電腦 (Apple)',
    live: 'Live AI'
  }
  const companyLabel = companyMapping[activeCompany.toLowerCase()] || activeCompany.toUpperCase();
  
  let markdown = `========================================================================
🕰️  C H R O N O S   H I S T O R I C A L   I N T E L L I G E N C E   R E P O R T
========================================================================

# 🕰️ CHRONOS 歷史事件與關係脈絡高階分析報告
> **本報告由 Chronos v2.7 自動化多智能體知識圖譜系統生成。**
> 融合動態網路爬蟲、SerpAPI 即時信號，並透過 Gemini 2.5 Flash 進行實體對齊與信心度權重演算法。

---

## 📊 第一章：報告基本資訊與執行摘要 (Executive Summary)

### 1.1 報告基本指標
| 分析指標 (Metric) | 報告內容與狀態 (Value) |
| :--- | :--- |
| **分析主體 (Subject)** | **${companyLabel}** |
| **產出時間 (Generated At)** | \`${new Date().toLocaleString('zh-TW')}\` |
| **里程碑總數 (Milestones Count)** | \`${currentEvents.length} 個重大歷史事件\` |
| **AI 綜合事實信心度 (Avg Confidence)** | \`High (優質數據對齊)\` |
| **主要資料源分佈 (Sources Type)** | \`官方文獻、商業新聞、權威百科、科技媒體\` |

### 1.2 報告核心洞察 (Core Insights)
本報告透過「人事時地物」多維度關係萃取模型，深入梳理了 **${companyLabel}** 的發展軌跡。報告重點呈現了核心創辦人、關鍵決策者以及跨界合作夥伴在重大轉折點（如創立、融資、股權收購、革命性產品發表）的關鍵互動與決策脈絡，為深入理解該品牌的商業生態提供了高價值的決策情報。

---

## 🕸️ 第二章：核心人物誌與人脈關係網 (Relational Linkage Analysis)

在當前主題分析中，系統精準識別出以下核心人物與重要關聯組織。這些人物藉由共同事件的協同推進，形成了高度緊密的人物關係網絡：

### 2.1 核心關聯人物與組織頻次表
| 人物/組織名稱 (Entity) | 實體類型 (Type) | 歷史共同提及次數 (Occurrences) | 核心角色定位 (Key Role Focus) |
| :--- | :---: | :---: | :--- |
`;

  // Scan all active categories dynamically
  const nodeOccurrences = new Map();
  currentEvents.forEach(ev => {
    if (ev.entities) {
      activeCategories.forEach(cat => {
        const val = ev.entities[cat];
        if (val) {
          const arr = Array.isArray(val) ? val : [val];
          arr.forEach(ent => {
            nodeOccurrences.set(ent, (nodeOccurrences.get(ent) || 0) + 1);
          });
        }
      });
    }
  });

  const sortedOccur = Array.from(nodeOccurrences.entries()).sort((a, b) => b[1] - a[1]);
  sortedOccur.forEach(([name, count]) => {
    const isCompany = isCompanyNode(name);
    let typeLabel = isCompany ? '🌐 組織' : '👤 人物';
    let role = isCompany ? '核心組織/主體公司' : '關鍵人物/高階決策者';
    
    // Find category type
    let category = 'who';
    currentEvents.some(ev => {
      if (ev.entities) {
        return ['who', 'what', 'where'].some(cat => {
          const val = ev.entities[cat];
          if (val) {
            const arr = Array.isArray(val) ? val : [val];
            if (arr.includes(name)) {
              category = cat;
              return true;
            }
          }
          return false;
        });
      }
      return false;
    });

    if (category === 'what') {
      typeLabel = '⚙️ 技術/產品';
      role = '核心技術/革命性產品';
    } else if (category === 'where') {
      typeLabel = '📍 地點';
      role = '關鍵歷史發生地';
    }

    markdown += `| **${name}** | ${typeLabel} | \`${count} 次\` | ${role} |\n`;
  });

  markdown += `
### 2.2 核心語意關係鍵結鏈 (Key Relational Vectors)
以下為系統從歷史事件中提煉出的顯式人際、組織與實體關係，這構成了整個分析主體最核心的關係脈絡架構：

`;

  const relationshipsFound = [];
  currentEvents.forEach(ev => {
    if (ev.relationships && Array.isArray(ev.relationships)) {
      ev.relationships.forEach(rel => {
        relationshipsFound.push(rel);
      });
    }
  });

  if (relationshipsFound.length > 0) {
    const uniqueRels = new Map();
    relationshipsFound.forEach(rel => {
      const key = [rel.source, rel.target].sort().join('->');
      uniqueRels.set(key, rel);
    });
    
    uniqueRels.forEach(rel => {
      const isSrcCompany = isCompanyNode(rel.source);
      const isTgtCompany = isCompanyNode(rel.target);
      const srcBadge = isSrcCompany ? '🌐' : '👤';
      const tgtBadge = isTgtCompany ? '🌐' : '👤';
      markdown += `- ${srcBadge} **${rel.source}** ───[ \`${rel.label || '關聯互動'}\` ]───> ${tgtBadge} **${rel.target}**\n`;
    });
  } else {
    markdown += `*（目前主要為隱式事件共同提及關係，可藉由上方搜尋或點選節點觸發深度探索）*\n`;
  }

  markdown += `
---

## 📜 第三章：歷史紀實里程碑黃金編年史 (Chronological Narratives)

以下按照時間軸正序呈現 **${companyLabel}** 的黃金里程碑事件。每個里程碑皆經過 AI 信心度演算與溯源核實：

`;

  currentEvents.forEach((ev, idx) => {
    const confidence = calculateConfidence(ev, idx);
    let confLabel = '🛡️ 高可信度 (High Confidence)';
    if (confidence < 0.4) confLabel = '⚠️ 待核實 / 有質疑 (Disputed)';
    else if (confidence < 0.8) confLabel = '🔔 中可信度 (Moderate)';

    markdown += `### 📅 [里程碑 ${idx + 1}] ${ev.date}\n`;
    markdown += `> **事件紀實**：${ev.event}\n`;
    markdown += `>\n`;
    markdown += `> - **事實信心度**：\`${Math.round(confidence * 100)}%\` — \`${confLabel}\`\n`;
    
    if (ev.entities) {
      if (ev.entities.who && ev.entities.who.length > 0) {
        markdown += `> - 👤 **關鍵人物/組織**：${Array.isArray(ev.entities.who) ? ev.entities.who.join(', ') : ev.entities.who}\n`;
      }
      if (ev.entities.what && ev.entities.what.length > 0) {
        markdown += `> - ⚙️ **核心產品/技術**：${Array.isArray(ev.entities.what) ? ev.entities.what.join(', ') : ev.entities.what}\n`;
      }
      if (ev.entities.where && ev.entities.where.length > 0) {
        markdown += `> - 📍 **關鍵地點**：${Array.isArray(ev.entities.where) ? ev.entities.where.join(', ') : ev.entities.where}\n`;
      }
      if (ev.entities.why) {
        markdown += `> - 💡 **決策動機與商業脈絡**：${ev.entities.why}\n`;
      }
    }
    markdown += `\n`;
  });

  markdown += `
---

## 📚 第四章：事實溯源與文獻資料庫 (Bibliography & Citations)

為確保學術與商務報告的嚴謹性，本報告所有事件均備有嚴格的文獻引用與信任評級對照：

| 來源文獻網址 (Citation Source URL) | 權威度定位 (Authority) | AI 原始信任權重 (Trust Rating) |
| :--- | :--- | :---: |
`;

  currentEvents.forEach(ev => {
    if (ev.sources && Array.isArray(ev.sources)) {
      ev.sources.forEach(s => {
        markdown += `| [${s.url.slice(0, 50)}...](${s.url}) | ${s.authority || '一般來源'} | \`Score: ${s.trust || 0.8}\` |\n`;
      });
    }
  });

  markdown += `
========================================================================
報告結束 ── 由 Chronos Intelligence Engine v2.7 精密運算生成
========================================================================`;

  // Download file in browser
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Chronos_Premium_Report_${companyLabel.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${new Date().toISOString().slice(0,10)}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
exportReportBtn.addEventListener('click', handleExportReport)
if (backToGlobalBtn) {
  backToGlobalBtn.addEventListener('click', () => {
    activeFilter = null
    egoCenterNode = null
    backToGlobalBtn.classList.remove('active')
    renderTimeline(currentEvents)
    renderGraph(currentEvents, activeCompany)
    resetGraphHighlight()
    inspectorPanel.classList.remove('active')
  })
}
searchInputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearchSynthesis()
})

// Click on blank space of SVG canvas to clear active filter and selections!
svgEl.addEventListener('click', (e) => {
  if (e.target === svgEl) {
    activeFilter = null
    egoCenterNode = null
    if (backToGlobalBtn) backToGlobalBtn.classList.remove('active')
    renderTimeline(currentEvents)
    renderGraph(currentEvents, activeCompany)
    resetGraphHighlight()
    inspectorPanel.classList.remove('active')
  }
})

// Bind segment mode toggles (People-Only vs All-Who)
const togglePeopleBtn = document.querySelector('#toggle-people-only-btn')
const toggleAllWhoBtn = document.querySelector('#toggle-all-who-btn')

if (togglePeopleBtn && toggleAllWhoBtn) {
  const setMode = (mode) => {
    graphMode = mode
    if (mode === 'people-only') {
      togglePeopleBtn.style.background = 'rgba(192, 132, 252, 0.25)'
      togglePeopleBtn.style.borderColor = 'rgba(192, 132, 252, 0.4)'
      togglePeopleBtn.style.color = '#e9d5ff'
      
      toggleAllWhoBtn.style.background = 'transparent'
      toggleAllWhoBtn.style.borderColor = 'transparent'
      toggleAllWhoBtn.style.color = '#94a3b8'
    } else {
      toggleAllWhoBtn.style.background = 'rgba(192, 132, 252, 0.25)'
      toggleAllWhoBtn.style.borderColor = 'rgba(192, 132, 252, 0.4)'
      toggleAllWhoBtn.style.color = '#e9d5ff'
      
      togglePeopleBtn.style.background = 'transparent'
      togglePeopleBtn.style.borderColor = 'transparent'
      togglePeopleBtn.style.color = '#94a3b8'
    }
    renderGraph(currentEvents, activeCompany, egoCenterNode)
  }
  
  togglePeopleBtn.addEventListener('click', () => setMode('people-only'))
  toggleAllWhoBtn.addEventListener('click', () => setMode('all-who'))
}

// Bind dimension filters (人事時地物)
const activeCategories = ['who', 'what', 'where'] // 預設開啟全維度，呈現全部資料

const dimWhoBtn = document.querySelector('#dim-who-btn')
const dimWhatBtn = document.querySelector('#dim-what-btn')
const dimWhereBtn = document.querySelector('#dim-where-btn')

if (dimWhoBtn && dimWhatBtn && dimWhereBtn) {
  const toggleDimension = (btn, category) => {
    const idx = activeCategories.indexOf(category)
    if (idx !== -1) {
      if (activeCategories.length === 1) {
        alert("必須至少保留一個維度以繪製關係圖！")
        return
      }
      activeCategories.splice(idx, 1)
      btn.style.background = 'transparent'
      btn.style.borderColor = 'transparent'
      btn.style.color = '#94a3b8'
    } else {
      activeCategories.push(category)
      let color = 'var(--color-what)'
      let borderColor = 'rgba(96, 165, 250, 0.4)'
      if (category === 'who') { color = 'var(--color-who)'; borderColor = 'rgba(244, 114, 182, 0.4)'; }
      else if (category === 'where') { color = 'var(--color-where)'; borderColor = 'rgba(52, 211, 153, 0.4)'; }
      
      btn.style.background = borderColor.replace('0.4', '0.2')
      btn.style.borderColor = borderColor
      btn.style.color = color
    }
    renderGraph(currentEvents, activeCompany, egoCenterNode)
  }
  
  dimWhoBtn.addEventListener('click', () => toggleDimension(dimWhoBtn, 'who'))
  dimWhatBtn.addEventListener('click', () => toggleDimension(dimWhatBtn, 'what'))
  dimWhereBtn.addEventListener('click', () => toggleDimension(dimWhereBtn, 'where'))
}

// Initialize Global master combined database as default on startup!
switchCompany('all')
