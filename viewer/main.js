import './style.css'
import { mockData } from './src/data.js'

const timelineEl = document.querySelector('#timeline');

function renderTimeline(events) {
  timelineEl.innerHTML = '';
  
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  events.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'timeline-item';
    itemEl.style.animationDelay = `${index * 0.2}s`;
    
    itemEl.innerHTML = `
      <div class="timeline-content">
        <span class="event-date">${item.date}</span>
        <h3 class="event-title">${item.event.split('：')[0].split(':')[0]}</h3>
        <p class="event-desc">${item.event}</p>
      </div>
      <div class="timeline-dot"></div>
    `;
    
    timelineEl.appendChild(itemEl);
  });
}

// Initial render with mock data
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline(mockData);
  
  // Potential for real fetch if keys exist
  // fetchSupabaseData().then(renderTimeline);
});
