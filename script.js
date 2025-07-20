
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

// Notification system
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
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#50fa7b' : type === 'error' ? '#ff5555' : '#bd93f9'};
        color: #282a36;
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
});

// Create search functionality
function createSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: rgba(40, 42, 54, 0.95);
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #6272a4;
        backdrop-filter: blur(10px);
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search commands...';
    searchInput.style.cssText = `
        background: #21222c;
        border: 1px solid #44475a;
        color: #f8f8f2;
        padding: 8px 12px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        width: 200px;
    `;
    
    searchContainer.appendChild(searchInput);
    document.body.appendChild(searchContainer);
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const commandBlocks = document.querySelectorAll('.command-block');
        
        commandBlocks.forEach(block => {
            const code = block.querySelector('code').textContent.toLowerCase();
            const title = block.querySelector('h3').textContent.toLowerCase();
            
            if (code.includes(query) || title.includes(query)) {
                block.style.display = 'block';
                block.style.background = query ? 'rgba(80, 250, 123, 0.1)' : '';
            } else {
                block.style.display = query ? 'none' : 'block';
            }
        });
    });
}

// Create progress indicator
function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #50fa7b, #bd93f9);
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

// Add CSS for active navigation links
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .sidebar a.active {
        background: rgba(80, 250, 123, 0.2);
        border-left-color: #50fa7b;
        color: #50fa7b;
        font-weight: bold;
    }
    
    .command-block:focus-within {
        border-color: #50fa7b;
        box-shadow: 0 0 0 2px rgba(80, 250, 123, 0.3);
    }
    
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .sidebar.open {
            transform: translateX(0);
        }
    }
`;

document.head.appendChild(additionalStyles);

// Mobile menu toggle for responsive design
if (window.innerWidth <= 768) {
    const menuToggle = document.createElement('button');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: #bd93f9;
        color: #282a36;
        border: none;
        padding: 12px;
        border-radius: 6px;
        font-size: 1.2rem;
        cursor: pointer;
    `;
    
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    });
}

console.log('🎨 Arch Linux Installation Guide loaded successfully!');
console.log('💡 Features:');
console.log('   • Click any copy button to copy commands to clipboard');
console.log('   • Use Ctrl+Shift+C to copy focused code blocks');
console.log('   • Search for specific commands using the search box');
console.log('   • Navigate smoothly through sections using the sidebar');
