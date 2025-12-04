/**
 * Tab System for Grade Levels and Subjects
 * Pinetown Independent Primary School
 */

// Grade subjects data
const gradeTabsData = {
  'grade-1': {
    name: 'Grade 1',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🌟 Life Skills']
  },
  'grade-2': {
    name: 'Grade 2',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🌟 Life Skills']
  },
  'grade-3': {
    name: 'Grade 3',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🌟 Life Skills']
  },
  'grade-4': {
    name: 'Grade 4',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🔬 Natural Sciences and Technology', '🌍 Social Sciences (History & Geography)', '🌟 Life Skills']
  },
  'grade-5': {
    name: 'Grade 5',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🔬 Natural Sciences and Technology', '🌍 Social Sciences (History & Geography)', '🌟 Life Skills']
  },
  'grade-6': {
    name: 'Grade 6',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🔬 Natural Sciences and Technology', '🌍 Social Sciences (History & Geography)', '🌟 Life Skills']
  },
  'grade-7': {
    name: 'Grade 7',
    core: ['📖 English Home Language', '📚 IsiZulu First Additional', '🔢 Mathematics', '🔬 Natural Sciences and Technology', '🌍 Social Sciences (History & Geography)', '🗣️ Life Orientation', '🎨 Creative Arts', '💼 Economic and Management Sciences']
  }
};

// Initialize tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
});

// Initialize tab system
function initializeTabs() {
  console.log('📚 Grade Tabs System initialized');
  
  // Show first tab by default
  showTab('grade-1');
}

// Show specific tab
function showTab(gradeId) {
  // Remove active class from all tabs
  const allTabs = document.querySelectorAll('.grade-tab');
  const allContents = document.querySelectorAll('.grade-content');
  
  allTabs.forEach(tab => {
    tab.classList.remove('active');
    tab.style.backgroundColor = '#f8f9fa';
    tab.style.color = '#000080';
    tab.style.borderBottom = '3px solid transparent';
  });
  
  allContents.forEach(content => {
    content.style.display = 'none';
  });
  
  // Activate selected tab
  const activeTab = document.getElementById(`tab-${gradeId}`);
  const activeContent = document.getElementById(`content-${gradeId}`);
  
  if (activeTab && activeContent) {
    activeTab.classList.add('active');
    activeTab.style.backgroundColor = '#000080';
    activeTab.style.color = '#FFD700';
    activeTab.style.borderBottom = '3px solid #FFD700';
    
    activeContent.style.display = 'block';
    
    // Add animation
    activeContent.style.opacity = '0';
    activeContent.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      activeContent.style.transition = 'all 0.3s ease';
      activeContent.style.opacity = '1';
      activeContent.style.transform = 'translateY(0)';
    }, 50);
  }
  
  console.log(`📖 Switched to ${gradeTabsData[gradeId]?.name || gradeId}`);
}

// Generate subjects HTML for a grade
function generateSubjectsHTML(gradeData) {
  let html = '';
  
  // Core subjects section
  html += `
    <div style="margin-bottom: 30px;">
      <h4 style="color: #000080; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-size: 1.3rem;">
        <span style="background: #000080; color: #FFD700; padding: 8px 12px; border-radius: 50%; font-size: 1rem;">🎯</span>
        Core Subjects
      </h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
  `;
  
  gradeData.core.forEach(subject => {
    html += `
      <div class="subject-card" style="
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        padding: 20px;
        border-radius: 12px;
        border-left: 5px solid #000080;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        cursor: pointer;
      " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 5px 20px rgba(0,0,128,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 10px rgba(0,0,0,0.1)'">
        <div style="font-weight: bold; color: #333; font-size: 1.1rem; margin-bottom: 5px;">
          ${subject}
        </div>
        <div style="color: #666; font-size: 0.9rem;">
          Essential curriculum subject
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Mobile responsive tab switching
function handleMobileTabClick(gradeId) {
  showTab(gradeId);
  
  // Scroll to content on mobile
  if (window.innerWidth <= 768) {
    const content = document.getElementById(`content-${gradeId}`);
    if (content) {
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.target.classList.contains('grade-tab')) {
    const tabs = Array.from(document.querySelectorAll('.grade-tab'));
    const currentIndex = tabs.indexOf(e.target);
    
    let nextIndex = currentIndex;
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const gradeId = e.target.id.replace('tab-', '');
      showTab(gradeId);
      return;
    }
    
    if (nextIndex !== currentIndex) {
      tabs[nextIndex].focus();
      const gradeId = tabs[nextIndex].id.replace('tab-', '');
      showTab(gradeId);
    }
  }
});

console.log('🎯 Grade Tabs System loaded successfully');
