
// Copy to clipboard functionality
function copyToClipboard(button) {
    const codeBlock = button.parentElement.querySelector('code');
    const text = codeBlock.textContent;
    
    // Create temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Visual feedback
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied', 'copying');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('copied', 'copying');
        }, 2000);
        
        // Show notification
        showNotification('Command copied to clipboard!', 'success');
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy command', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Notification system with Tokyo Night colors
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Tokyo Night color scheme
    const colors = {
        success: '#9ece6a',
        error: '#f7768e',
        info: '#7aa2f7'
    };
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: #1a1b26;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed header
                const offset = 160; // Header height + some padding
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                const sidebar = document.querySelector('.sidebar');
                const overlay = document.querySelector('.mobile-overlay');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    if (overlay) overlay.classList.remove('active');
                }
            }
        });
    });
    
    // Highlight current section in navigation while scrolling
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.sidebar a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });
    
    // Add keyboard shortcut for copying (Ctrl+Shift+C on focused code block)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.closest('.command-block')) {
                const copyBtn = focusedElement.closest('.command-block').querySelector('.copy-btn');
                if (copyBtn) {
                    copyToClipboard(copyBtn);
                    e.preventDefault();
                }
            }
        }
    });
    
    // Add search functionality
    createSearchBox();
    
    // Add progress indicator
    createProgressIndicator();
    
    // Add mobile menu functionality
    createMobileMenu();
});

// Create enhanced search functionality
function createSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search commands...';
    searchInput.className = 'search-input';
    
    searchContainer.appendChild(searchInput);
    document.body.appendChild(searchContainer);
    
    // Search functionality with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase();
            const commandBlocks = document.querySelectorAll('.command-block');
            let matchCount = 0;
            
            commandBlocks.forEach(block => {
                const code = block.querySelector('code').textContent.toLowerCase();
                const title = block.querySelector('h3').textContent.toLowerCase();
                
                if (code.includes(query) || title.includes(query)) {
                    block.style.display = 'block';
                    block.style.background = query ? 'rgba(158, 206, 106, 0.1)' : '';
                    matchCount++;
                } else {
                    block.style.display = query ? 'none' : 'block';
                }
            });
            
            // Show search results count
            if (query) {
                showNotification(`Found ${matchCount} matching commands`, 'info');
            }
        }, 300);
    });
    
    // Clear search on Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

// Create progress indicator with Tokyo Night colors
function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #9ece6a, #7aa2f7);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Create mobile menu functionality
function createMobileMenu() {
    // Create mobile menu button
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    
    document.body.appendChild(menuBtn);
    document.body.appendChild(overlay);
    
    // Toggle menu
    menuBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        
        // Update button icon
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const icon = menuBtn.querySelector('i');
        
        sidebar.classList.remove('open');
        this.classList.remove('active');
        icon.className = 'fas fa-bars';
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.mobile-overlay');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            const icon = menuBtn.querySelector('i');
            
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            icon.className = 'fas fa-bars';
        }
    });
}

// Add CSS for active navigation links with Tokyo Night colors
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .sidebar a.active {
        background: rgba(158, 206, 106, 0.2);
        border-left-color: #9ece6a;
        color: #9ece6a;
        font-weight: bold;
    }
    
    .command-block:focus-within {
        border-color: #9ece6a;
        box-shadow: 0 0 0 2px rgba(158, 206, 106, 0.3);
    }
    
    .command-block.highlight {
        animation: highlightPulse 0.6s ease;
    }
    
    @keyframes highlightPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    /* Enhanced mobile styles */
    @media (max-width: 768px) {
        .search-container {
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 40px);
            max-width: 300px;
        }
        
        .search-input {
            width: 100%;
        }
        
        .mobile-menu-btn {
            display: block;
        }
        
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .sidebar.open {
            transform: translateX(0);
        }
        
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100%);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :root {
            --tokyo-bg: #000000;
            --tokyo-fg: #ffffff;
            --tokyo-blue: #4a9eff;
            --tokyo-green: #4caf50;
            --tokyo-red: #f44336;
        }
    }
`;

document.head.appendChild(additionalStyles);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Ctrl/Cmd + / to toggle mobile menu
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (menuBtn) {
            menuBtn.click();
        }
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll handling logic here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

console.log('🎨 Arch Linux Installation Guide loaded successfully!');
console.log('💡 Features:');
console.log('   • Tokyo Night theme with JetBrains Mono font');
console.log('   • Click any copy button to copy commands to clipboard');
console.log('   • Use Ctrl+Shift+C to copy focused code blocks');
console.log('   • Search for specific commands using the search box (Ctrl+K)');
console.log('   • Navigate smoothly through sections using the sidebar');
console.log('   • Mobile-friendly responsive design');
console.log('   • Keyboard shortcuts: Ctrl+K (search), Ctrl+/ (menu)');
