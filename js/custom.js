/* source/js/custom.js */

function liizPageLogic() {
  var path = location.pathname;
  var isHome = path === '/' || path === '/index.html';
  var isArchive = path.includes('/archives/');
  var isCategory = path.includes('/categories/');
  var isTag = path.includes('/tags/');
  
  // 判定是否为“特殊页面”（归档、分类、标签）
  var isSpecialPage = !isHome && (isArchive || isCategory || isTag);

  // ============================================
  // 🏠 1. 首页逻辑：锁屏
  // ============================================
  var styleId = 'home-lock-style';
  var existStyle = document.getElementById(styleId);

  if (isHome) {
    if (!existStyle) {
      var style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        #content-inner, #recent-posts, #aside-content, #pagination, #footer, #scroll-down, #top-container, #rightside { display: none !important; }
        body { overflow: hidden !important; height: 100vh !important; }
        #page-header { height: 100vh !important; background-attachment: fixed !important; }
        #site-info {
          position: absolute !important; top: 50% !important; left: 50% !important;
          transform: translate(-50%, -50%) !important; width: 100% !important;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    if (existStyle) existStyle.remove();
  }

  // ============================================
  // ⌨️ 2. 内页逻辑：诗句打字机
  // ============================================
  if (isSpecialPage) {
    var myStrings = ['默认标题']; 
    if (isArchive) { myStrings = ['欲买桂花同载酒', '终不似', '少年游']; } 
    else if (isCategory) { myStrings = ['被酒莫惊春睡重', '赌书消得泼茶香', '当时只道是寻常']; } 
    else if (isTag) { myStrings = ['关山难越', '谁悲失路之人', '萍水相逢', '尽是他乡之客']; }

    var checkCount = 0;
    var typeInterval = setInterval(function() {
      var titleElem = document.querySelector('#page-header .page-title') || document.getElementById('site-title');
      if (titleElem && !titleElem.classList.contains('typed-ready')) {
        titleElem.classList.add('typed-ready');
        titleElem.innerHTML = ''; 
        var span = document.createElement('span');
        span.style.borderRight = "0.1em solid"; 
        span.style.fontSize = "0.8em"; 
        span.style.fontFamily = "'LXGW WenKai Screen', sans-serif";
        titleElem.appendChild(span);

        if (typeof Typed !== 'undefined') {
          new Typed(span, {
            strings: myStrings, typeSpeed: 120, backSpeed: 50, startDelay: 300, loop: true, showCursor: true, cursorChar: '|'
          });
          clearInterval(typeInterval);
        }
      }
      checkCount++;
      if (checkCount > 50) clearInterval(typeInterval);
    }, 100);
  }

  // ============================================
  // 🤖 3. 按钮管理 (新增：隐藏齿轮设置按钮)
  // ============================================
  setTimeout(function() {
    // 1. 单双栏切换按钮 (之前你要删的)
    var hideAsideBtn = document.getElementById('hide-aside-btn');
    // 2. 设置按钮/齿轮图标 (这次你要删的)
    var settingBtn = document.getElementById('rightside-config');

    if (isSpecialPage) {
      // --- 在归档、标签页：统统隐藏 ---
      if (hideAsideBtn) hideAsideBtn.style.setProperty('display', 'none', 'important');
      if (settingBtn) settingBtn.style.setProperty('display', 'none', 'important');
    } else {
      // --- 在文章页、首页等：恢复显示 ---
      // 只有 hideAsideBtn 需要恢复 (因为它是被我们强制隐藏的)
      // settingBtn 默认就是显示的，但也顺手恢复一下以防万一
      if (hideAsideBtn) hideAsideBtn.style.display = 'block';
      if (settingBtn) settingBtn.style.display = 'block';
    }
  }, 100);
}

// ============================================
// 🔗 4. 文章链接优化 (拦截器版 - God Mode)
// ============================================
function handleLinkClick(e) {
  var target = e.target.closest('a');
  if (!target) return;

  var isPostTitle = target.classList.contains('article-title') || 
                    target.classList.contains('article-sort-item-title') ||
                    target.closest('.recent-post-info') ||
                    target.closest('.aside-list-item');
  
  if (e.target.closest('.article-meta')) return;

  if (isPostTitle) {
    e.preventDefault();
    e.stopPropagation();
    window.open(target.href, '_blank');
  }
}

window.addEventListener('click', handleLinkClick, true);

document.addEventListener('DOMContentLoaded', liizPageLogic);
document.addEventListener('pjax:complete', liizPageLogic);