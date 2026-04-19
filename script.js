/**
 * Structures de Données en C - Site Web
 * JavaScript pour navigation et thème
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const menuToggleBottom = document.getElementById('menuToggleBottom');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeDropdown = document.querySelector('.theme-dropdown');
    const themeDropdownMenu = document.getElementById('themeDropdownMenu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const scrollToTop = document.getElementById('scrollToTop');
    const scrollToBottom = document.getElementById('scrollToBottom');
    const scrollToTopSidebar = document.getElementById('scrollToTopSidebar');
    const scrollToBottomSidebar = document.getElementById('scrollToBottomSidebar');
    const scrollToTopMobile = document.getElementById('scrollToTopMobile');
    const scrollToBottomMobile = document.getElementById('scrollToBottomMobile');
    const navLinks = document.querySelectorAll('.nav-link');
    const navReadChecks = document.querySelectorAll('.nav-read-check');
    const progressText = document.getElementById('progressText');
    const resetProgress = document.getElementById('resetProgress');
    const navSearch = document.getElementById('navSearch');
    const navList = document.getElementById('navList');
    const navItems = document.querySelectorAll('.nav-item[data-search]');

    // ========================================
    // Mobile Menu Functions
    // ========================================
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // ========================================
    // Theme Functions
    // ========================================
    const THEME_KEY = 'struct-c-theme';

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    function getPreferredTheme() {
        const stored = getStoredTheme();
        if (stored) {
            return stored;
        }
        return 'system';
    }

    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function getAppliedTheme() {
        const applied = document.documentElement.getAttribute('data-theme');
        const mode = document.body.getAttribute('data-theme-mode') || getStoredTheme() || 'system';
        if (mode === 'system') {
            return getSystemTheme();
        }
        return mode;
    }

    function setTheme(theme) {
        const actualTheme = theme === 'system' ? getSystemTheme() : theme;
        document.body.setAttribute('data-theme', actualTheme);
        document.body.setAttribute('data-theme-mode', theme);
        updateThemeIcon(theme);
        storeTheme(theme);
    }

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon', 'fa-desktop');
            themeIcon.classList.add('fa-sun');
            if (themeLabel) themeLabel.textContent = 'Sombre';
        } else if (theme === 'system') {
            themeIcon.classList.remove('fa-moon', 'fa-sun');
            themeIcon.classList.add('fa-desktop');
            if (themeLabel) themeLabel.textContent = 'Système';
        } else {
            themeIcon.classList.remove('fa-sun', 'fa-desktop');
            themeIcon.classList.add('fa-moon');
            if (themeLabel) themeLabel.textContent = 'Clair';
        }

        // Update active state in dropdown
        if (themeOptions) {
            themeOptions.forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-theme') === theme) {
                    option.classList.add('active');
                }
            });
        }
    }

    function toggleTheme() {
        if (themeDropdown) {
            themeDropdown.classList.toggle('open');
        }
    }

    function selectTheme(theme) {
        setTheme(theme);
        if (themeDropdown) {
            themeDropdown.classList.remove('open');
        }
    }

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Close sidebar on mobile
            closeSidebar();
            
            // Scroll to section with offset for fixed header
            const topbarHeight = 56;
            const targetPosition = targetSection.offsetTop - topbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active link
            updateActiveNavLink(targetId);
        }
    }

    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // Scroll Progress
    // ========================================
    function updateScrollProgress() {
        const scrollProgressBar = document.getElementById('scrollProgressBar');
        if (!scrollProgressBar) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgressBar.style.width = scrollPercent + '%';
    }

    // ========================================
    // Scroll Spy - Update active nav on scroll
    // ========================================
    function handleScroll() {
        updateScrollProgress();
        
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('.section[id]');
        
        let currentSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                    // Open parent nav item
                    const navItem = link.closest('.nav-item');
                    if (navItem) {
                        navItem.classList.add('open');
                    }
                }
            });
            
            // Close other nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                const link = item.querySelector('.nav-link');
                if (link && link.getAttribute('href') !== '#' + currentSection) {
                    item.classList.remove('open');
                }
            });
        }
    }

    // ========================================
    // Save checklist state
    // ========================================
    const CHECKLIST_KEY = 'struct-c-checklist';

    function saveChecklistState() {
        const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
        const state = Array.from(checkboxes).map(cb => cb.checked);
        
        try {
            localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
        } catch (e) {
            // Ignore
        }
    }

    function loadChecklistState() {
        try {
            const saved = localStorage.getItem(CHECKLIST_KEY);
            if (saved) {
                const state = JSON.parse(saved);
                const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
                checkboxes.forEach((cb, index) => {
                    if (state[index] !== undefined) {
                        cb.checked = state[index];
                    }
                });
            }
        } catch (e) {
            // Ignore
        }
    }

    function initChecklist() {
        const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', saveChecklistState);
        });
        loadChecklistState();
    }

    // ========================================
    // Keyboard Navigation
    // ========================================
    function handleKeyboard(e) {
        // ESC to close sidebar
        if (e.key === 'Escape') {
            closeSidebar();
        }
        
        // Toggle theme with Ctrl/Cmd + Shift + L
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            toggleTheme();
        }
    }

    // ========================================
    // Touch Gestures for Mobile
    // ========================================
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        // Swipe right from left edge to open menu
        if (diff > swipeThreshold && touchStartX < 50) {
            openSidebar();
        }
        
        // Swipe left to close menu
        if (diff < -swipeThreshold && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    }

    // ========================================
    // Copy Button Functionality
    // ========================================
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach(pre => {
            const code = pre.querySelector('code');
            if (!code) return;
            
            // Check if button already exists
            if (pre.querySelector('.copy-btn')) return;
            
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.innerHTML = '<i class="fas fa-copy"></i>';
            btn.setAttribute('aria-label', 'Copier le code');
            
            btn.addEventListener('click', async () => {
                const text = code.textContent;
                try {
                    await navigator.clipboard.writeText(text);
                    btn.classList.add('copied');
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    btn.classList.add('copied');
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                }
            });
            
            pre.appendChild(btn);
        });
    }

    // ========================================
    // Syntax Highlighting for C code
    // ========================================
    function highlightCCode() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        const cKeywords = ['int','float','double','char','void','long','short','unsigned','signed','const','static','extern','volatile','struct','typedef','enum','union','return','if','else','while','for','do','switch','case','break','continue','default','sizeof','goto'];
        const cTypes = ['NULL','FILE','size_t','Noeud','NoeudC','TabDyn','Pile','File','PileSegments','FileSegments','ListeSegments','Point','Segment','Complexe','TableauDynamique'];
        const cPreproc = ['#include','#define','#ifndef','#endif','#ifdef','#pragma'];
        const cFunctions = ['printf','scanf','malloc','calloc','realloc','free','fopen','fclose','fprintf','fscanf','strlen','strcpy','strcmp','strcat','sqrt','fabs','main','creer','creer_noeud','creer_noeud_complexe','creer_pile','creer_file','inserer','inserer_tete','inserer_queue','supprimer','supprimer_bst','afficher_liste','liberer_liste','liberer','afficher_pile','afficher_file','push','pop','peek','enfiler','defiler','front','est_vide','file_vide','pile_vide','pile_pleine','file_pleine','init_pile','init_file','init_liste','empiler','depiler','ajouter','ajouter_segment','afficher','detruire','minmax','inverse','longueur','inverser','inordre','preordre','postordre','hauteur','rechercher','compter_feuilles','min_noeud','module_max','module_min','module','afficher_complexe','milieu','longueur_segment','afficher_milieux','segment_le_plus_long','verifier_parentheses','inverser_chaine','supprimer_index','doubleVal','doublePtr'];

        codeBlocks.forEach(block => {
            let html = block.innerHTML;
            
            // Protect existing HTML entities
            html = html.replace(/&lt;/g, '\x00LT\x00');
            html = html.replace(/&gt;/g, '\x00GT\x00');
            html = html.replace(/&amp;/g, '\x00AMP\x00');
            
            // Comments // (must be before strings)
            html = html.replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>');
            
            // Comments /* */
            html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');
            
            // Preprocessor directives
            html = html.replace(/(#\w+)/g, '<span class="pp">$1</span>');
            
            // Strings
            html = html.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="st">$1</span>');
            html = html.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="st">$1</span>');
            
            // Format specifiers like %d, %p, %f, %s, %.2f
            html = html.replace(/(%[\d.]*[dfspxc])/g, '<span class="nm">$1</span>');
            
            // Numbers
            html = html.replace(/\b(\d+\.?\d*[f]?)\b/g, '<span class="nm">$1</span>');
            // Hex numbers
            html = html.replace(/\b(0x[0-9a-fA-F]+)\b/g, '<span class="nm">$1</span>');
            
            // Keywords
            cKeywords.forEach(kw => {
                const re = new RegExp('\\b(' + kw + ')\\b', 'g');
                html = html.replace(re, '<span class="kw">$1</span>');
            });
            
            // Types
            cTypes.forEach(tp => {
                const re = new RegExp('\\b(' + tp + ')\\b', 'g');
                html = html.replace(re, '<span class="tp">$1</span>');
            });
            
            // Functions
            cFunctions.forEach(fn => {
                const re = new RegExp('\\b(' + fn + ')\\b', 'g');
                html = html.replace(re, '<span class="fn">$1</span>');
            });
            
            // Restore HTML entities
            html = html.replace(/\x00LT\x00/g, '&lt;');
            html = html.replace(/\x00GT\x00/g, '&gt;');
            html = html.replace(/\x00AMP\x00/g, '&amp;');
            
            block.innerHTML = html;
        });
    }

    // ========================================
    // ========================================
    // Reading Progress Functions
    // ========================================
    const READ_PROGRESS_KEY = 'struct-c-read-progress';
    
    function getReadSections() {
        const stored = localStorage.getItem(READ_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    
    function saveReadSection(sectionId) {
        const readSections = getReadSections();
        if (!readSections.includes(sectionId)) {
            readSections.push(sectionId);
            localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(readSections));
        }
        updateProgressDisplay();
    }
    
    function removeReadSection(sectionId) {
        let readSections = getReadSections();
        readSections = readSections.filter(id => id !== sectionId);
        localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(readSections));
        updateProgressDisplay();
    }
    
    function updateProgressDisplay() {
        if (!progressText) return;
        const readSections = getReadSections();
        const total = navReadChecks.length;
        const read = readSections.length;
        progressText.textContent = `${read}/${total}`;
    }
    
    function resetAllProgress() {
        localStorage.removeItem(READ_PROGRESS_KEY);
        navReadChecks.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateProgressDisplay();
    }
    
    function initReadingProgress() {
        const readSections = getReadSections();
        
        navReadChecks.forEach(checkbox => {
            const sectionId = checkbox.getAttribute('data-section');
            if (readSections.includes(sectionId)) {
                checkbox.checked = true;
            }
            
            checkbox.addEventListener('change', () => {
                const sectionId = checkbox.getAttribute('data-section');
                if (checkbox.checked) {
                    saveReadSection(sectionId);
                } else {
                    removeReadSection(sectionId);
                }
            });
        });
        
        if (resetProgress) {
            resetProgress.addEventListener('click', () => {
                if (confirm('Réinitialiser toute la progression ?')) {
                    resetAllProgress();
                }
            });
        }
        
        updateProgressDisplay();
    }

    // ========================================
    // Navigation Search Function
    // ========================================
    function initNavSearch() {
        if (!navSearch) return;
        
        navSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            navItems.forEach(item => {
                const searchTerms = item.getAttribute('data-search') || '';
                const text = item.textContent.toLowerCase();
                
                if (query === '' || searchTerms.includes(query) || text.includes(query)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
        
        // Clear search on Escape key
        navSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navSearch.value = '';
                navItems.forEach(item => item.classList.remove('hidden'));
            }
        });
    }

    // Initialize
    // ========================================
    function init() {
        // Set initial theme
        const preferredTheme = getPreferredTheme();
        setTheme(preferredTheme);

        // Event listeners
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleSidebar);
        }

        if (menuToggleBottom) {
            menuToggleBottom.addEventListener('click', toggleSidebar);
        }

        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        if (themeOptions) {
            themeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const theme = option.getAttribute('data-theme');
                    selectTheme(theme);
                });
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (themeDropdown && !themeDropdown.contains(e.target)) {
                themeDropdown.classList.remove('open');
            }
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', () => {
                const currentMode = document.body.getAttribute('data-theme-mode');
                if (currentMode === 'system') {
                    setTheme('system');
                }
            });
        }

        if (scrollToTop) {
            scrollToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (scrollToBottom) {
            scrollToBottom.addEventListener('click', () => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
        }

        if (scrollToTopMobile) {
            scrollToTopMobile.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (scrollToBottomMobile) {
            scrollToBottomMobile.addEventListener('click', () => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
        }

        if (scrollToTopSidebar) {
            scrollToTopSidebar.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (scrollToBottomSidebar) {
            scrollToBottomSidebar.addEventListener('click', () => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('keydown', handleKeyboard);
        
        // Touch gestures
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Initialize checklist
        initChecklist();
        
        // Initialize reading progress
        initReadingProgress();
        
        // Initialize navigation search
        initNavSearch();
        
        // Syntax highlighting
        highlightCCode();
        
        // Add copy buttons
        addCopyButtons();

        // Handle system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!getStoredTheme()) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
