// Gruvbox Light Theme - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializePage();
    
    function initializePage() {
        wrapCodeBlocks();
        addTableOfContents();
        addGlossary();
        initializeCopyButtons();
        addScrollToTop();
        addKeyboardShortcuts();
    }
    
    // Wrap all pre elements with copy functionality
    function wrapCodeBlocks() {
        const preElements = document.querySelectorAll('pre');
        
        preElements.forEach((pre, index) => {
            // Skip if already wrapped
            if (pre.parentElement.classList.contains('code-container')) {
                return;
            }
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'code-container';
            
            // Create header
            const header = document.createElement('div');
            header.className = 'code-header';
            
            // Create title
            const title = document.createElement('div');
            title.className = 'code-title';
            title.textContent = getCodeTitle(pre.textContent);
            
            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.setAttribute('data-code-id', index);
            
            // Assemble header
            header.appendChild(title);
            header.appendChild(copyBtn);
            
            // Wrap the pre element
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
        });
    }
    
    // Determine appropriate title for code block based on content
    function getCodeTitle(content) {
        const trimmed = content.trim().toLowerCase();
        
        if (trimmed.includes('pacman -s') || trimmed.includes('yay -s')) {
            return 'Package Installation';
        } else if (trimmed.includes('systemctl')) {
            return 'System Service Management';
        } else if (trimmed.includes('mkdir') || trimmed.includes('cat >')) {
            return 'File/Directory Operations';
        } else if (trimmed.includes('grub') || trimmed.includes('bootloader')) {
            return 'Bootloader Configuration';
        } else if (trimmed.includes('wifi') || trimmed.includes('network')) {
            return 'Network Configuration';
        } else if (trimmed.includes('bluetooth')) {
            return 'Bluetooth Configuration';
        } else if (trimmed.includes('config') || trimmed.includes('settings')) {
            return 'Configuration';
        } else if (trimmed.includes('#!/bin/bash') || trimmed.includes('#!/usr/bin/env')) {
            return 'Shell Script';
        } else if (trimmed.includes('reboot') || trimmed.includes('shutdown')) {
            return 'System Control';
        } else {
            return 'Terminal Commands';
        }
    }
    
    // Initialize copy button functionality
    function initializeCopyButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('copy-btn')) {
                const button = e.target;
                const codeContainer = button.closest('.code-container');
                const preElement = codeContainer.querySelector('pre');
                
                copyToClipboard(preElement.textContent, button);
            }
        });
    }
    
    // Copy text to clipboard with visual feedback
    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            showCopySuccess(button);
        } catch (err) {
            // Fallback for older browsers
            fallbackCopyToClipboard(text, button);
        }
    }
    
    // Fallback copy method
    function fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showCopyError(button);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Show copy success feedback
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }
    
    // Show copy error feedback
    function showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = 'Error!';
        button.style.background = 'linear-gradient(45deg, #cc241d, #9d0006)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    // Add table of contents
    function addTableOfContents() {
        const headings = document.querySelectorAll('h2');
        if (headings.length === 0) return;
        
        const toc = document.createElement('div');
        toc.className = 'toc';
        toc.innerHTML = '<h3>📚 Table of Contents</h3>';
        
        const ul = document.createElement('ul');
        
        headings.forEach((heading, index) => {
            // Add ID to heading if it doesn't have one
            if (!heading.id) {
                heading.id = 'section-' + index;
            }
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;
            a.addEventListener('click', function(e) {
                e.preventDefault();
                smoothScrollTo(heading);
            });
            
            li.appendChild(a);
            ul.appendChild(li);
        });
        
        toc.appendChild(ul);
        
        // Insert after the main title
        const mainTitle = document.querySelector('h1');
        if (mainTitle) {
            mainTitle.parentNode.insertBefore(toc, mainTitle.nextSibling);
        }
    }
    
    // Smooth scroll to element
    function smoothScrollTo(element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Add comprehensive glossary
    function addGlossary() {
        const glossaryHTML = `
        <div class="glossary">
            <h2>🔖 Arch Linux Setup Glossary & Cheat Sheet</h2>
            
            <div class="glossary-grid">
                <div class="glossary-section">
                    <h4>🖥️ i3 Window Manager Shortcuts</h4>
                    <ul>
                        <li><code>Super + Enter</code> - Open terminal (Alacritty)</li>
                        <li><code>Super + d</code> - Open application launcher (Rofi)</li>
                        <li><code>Super + Shift + q</code> - Kill focused window</li>
                        <li><code>Super + h/v</code> - Split horizontal/vertical</li>
                        <li><code>Super + f</code> - Toggle fullscreen</li>
                        <li><code>Super + Shift + Space</code> - Toggle floating</li>
                        <li><code>Super + 1-0</code> - Switch to workspace</li>
                        <li><code>Super + Shift + 1-0</code> - Move window to workspace</li>
                        <li><code>Super + r</code> - Resize mode</li>
                        <li><code>Super + Shift + r</code> - Restart i3</li>
                        <li><code>Super + x</code> - Lock screen</li>
                        <li><code>Super + Shift + p</code> - Power menu</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🎯 Application Shortcuts</h4>
                    <ul>
                        <li><code>Super + b</code> - Firefox browser</li>
                        <li><code>Super + t</code> - Thunar file manager</li>
                        <li><code>Super + m</code> - Cmus music player</li>
                        <li><code>Super + Shift + m</code> - Spotify</li>
                        <li><code>Super + n</code> - Neovim text editor</li>
                        <li><code>Super + p</code> - Btop system monitor</li>
                        <li><code>Print</code> - Screenshot to clipboard</li>
                        <li><code>Shift + Print</code> - Screenshot tool (Flameshot)</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🔧 System Commands</h4>
                    <ul>
                        <li><code>update</code> - Update system and AUR packages</li>
                        <li><code>debloat</code> - Clean system cache and temp files</li>
                        <li><code>performance</code> - Switch to performance mode</li>
                        <li><code>powersave</code> - Switch to power saving mode</li>
                        <li><code>boost</code> - Temporary performance boost</li>
                        <li><code>boottime</code> - Analyze boot performance</li>
                        <li><code>sudo systemctl status [service]</code> - Check service status</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>📦 Package Management</h4>
                    <ul>
                        <li><code>sudo pacman -S [package]</code> - Install package</li>
                        <li><code>sudo pacman -R [package]</code> - Remove package</li>
                        <li><code>sudo pacman -Syu</code> - Update system</li>
                        <li><code>sudo pacman -Ss [query]</code> - Search packages</li>
                        <li><code>yay -S [package]</code> - Install AUR package</li>
                        <li><code>yay -Rns [package]</code> - Remove package completely</li>
                        <li><code>pacman -Q | grep [name]</code> - Check if installed</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🌐 Network Management</h4>
                    <ul>
                        <li><code>nmcli device wifi list</code> - List available networks</li>
                        <li><code>nmcli device wifi connect "SSID"</code> - Connect to WiFi</li>
                        <li><code>nmcli connection show</code> - Show saved connections</li>
                        <li><code>nmcli device status</code> - Show device status</li>
                        <li><code>ping -c 3 google.com</code> - Test internet connection</li>
                        <li><code>ip addr show</code> - Show network interfaces</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🎵 Cmus Music Player</h4>
                    <ul>
                        <li><code>c</code> - Play/pause</li>
                        <li><code>b/n</code> - Previous/next track</li>
                        <li><code>s</code> - Toggle shuffle</li>
                        <li><code>r</code> - Toggle repeat</li>
                        <li><code>+/-</code> - Volume up/down</li>
                        <li><code>1-7</code> - Switch between views</li>
                        <li><code>:add ~/Music</code> - Add music directory</li>
                        <li><code>q</code> - Quit</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🔧 Fish Shell Features</h4>
                    <ul>
                        <li><code>Tab</code> - Auto-complete commands/paths</li>
                        <li><code>Ctrl + R</code> - Search command history</li>
                        <li><code>Alt + Left/Right</code> - Move between words</li>
                        <li><code>mkcd [dir]</code> - Create and enter directory</li>
                        <li><code>extract [file]</code> - Auto-extract any archive</li>
                        <li><code>ll</code> - Detailed file listing</li>
                        <li><code>vim = nvim</code> - Neovim alias</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>📁 File Management</h4>
                    <ul>
                        <li><code>~/.config/</code> - User configuration files</li>
                        <li><code>~/.local/share/</code> - User data directory</li>
                        <li><code>/etc/</code> - System configuration</li>
                        <li><code>/var/log/</code> - System logs</li>
                        <li><code>/usr/local/bin/</code> - Custom system scripts</li>
                        <li><code>~/.xinitrc</code> - X11 startup script</li>
                        <li><code>~/.config/i3/config</code> - i3 configuration</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🚀 Performance Tips</h4>
                    <ul>
                        <li>Use <code>performance</code> command before gaming</li>
                        <li>Run <code>debloat</code> weekly to clean system</li>
                        <li>Monitor with <code>btop</code> for resource usage</li>
                        <li>Use <code>powersave</code> on battery</li>
                        <li>Check <code>boottime</code> if system is slow</li>
                        <li>Restart i3 with <code>Super + Shift + r</code> if issues</li>
                        <li>Use <code>journalctl -xe</code> for troubleshooting</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🛠️ Troubleshooting</h4>
                    <ul>
                        <li><code>journalctl -xe</code> - Check system logs</li>
                        <li><code>systemctl --failed</code> - List failed services</li>
                        <li><code>dmesg | tail</code> - Check kernel messages</li>
                        <li><code>htop</code> - Monitor system resources</li>
                        <li><code>lsof -i :PORT</code> - Check what's using a port</li>
                        <li><code>sudo systemctl restart NetworkManager</code> - Fix network</li>
                        <li><code>xrandr</code> - Fix display issues</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>🎨 Theme & Customization</h4>
                    <ul>
                        <li>Colors: Gruvbox Light theme throughout</li>
                        <li>Font: JetBrains Mono Nerd Font everywhere</li>
                        <li><code>~/.config/scripts/wallpaper.sh</code> - Change wallpaper</li>
                        <li><code>Super + Shift + w</code> - Random wallpaper</li>
                        <li>Picom: Window compositor for transparency</li>
                        <li>Rofi: Application launcher with theme</li>
                        <li>GTK Theme: Adwaita with Papirus icons</li>
                    </ul>
                </div>
                
                <div class="glossary-section">
                    <h4>⚡ Hardware Specific (HP EliteBook 845 G8)</h4>
                    <ul>
                        <li>AMD Ryzen 5 PRO 5650U optimizations enabled</li>
                        <li><code>amd_pstate=active</code> in GRUB for power efficiency</li>
                        <li>Brightness control: <code>XF86MonBrightnessUp/Down</code></li>
                        <li>Touchpad: Natural scrolling and tap-to-click enabled</li>
                        <li>Audio: Pipewire with SOF firmware for best audio</li>
                        <li>Graphics: Mesa drivers with RADV Vulkan</li>
                        <li>Power: TLP configured for battery optimization</li>
                    </ul>
                </div>
            </div>
            
            <div class="alert alert-info">
                <strong>💡 Pro Tip:</strong> Bookmark this page and use <code>Ctrl + F</code> to quickly search for commands or shortcuts you need!
            </div>
        </div>
        `;
        
        // Add glossary at the end of the document
        document.body.insertAdjacentHTML('beforeend', glossaryHTML);
    }
    
    // Add scroll to top functionality
    function addScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.textContent = '↑';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--gruvbox-blue), var(--gruvbox-blue-bright));
            color: var(--gruvbox-bg0);
            border: none;
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(69, 133, 136, 0.3);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide scroll button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add keyboard shortcuts
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + / to show help
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                showKeyboardHelp();
            }
            
            // Escape to close any open modals
            if (e.key === 'Escape') {
                closeModals();
            }
        });
    }
    
    // Show keyboard help modal
    function showKeyboardHelp() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(40, 40, 40, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--gruvbox-bg0);
                border: 3px solid var(--gruvbox-blue);
                border-radius: 12px;
                padding: 2rem;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            ">
                <h3 style="color: var(--gruvbox-blue); margin-bottom: 1rem; text-align: center;">⌨️ Keyboard Shortcuts</h3>
                <ul style="list-style: none; padding: 0; color: var(--gruvbox-fg1);">
                    <li style="margin: 0.5rem 0;"><code>Ctrl + /</code> - Show this help</li>
                    <li style="margin: 0.5rem 0;"><code>Escape</code> - Close modals</li>
                    <li style="margin: 0.5rem 0;"><code>Ctrl + F</code> - Search page</li>
                    <li style="margin: 0.5rem 0;"><code>Tab</code> - Navigate copy buttons</li>
                    <li style="margin: 0.5rem 0;"><code>Enter</code> - Activate focused copy button</li>
                </ul>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--gruvbox-red);
                    color: var(--gruvbox-bg0);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: 'JetBrains Mono', monospace;
                    margin-top: 1rem;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                ">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Close any open modals
    function closeModals() {
        const modals = document.querySelectorAll('[style*="z-index: 2000"]');
        modals.forEach(modal => modal.remove());
    }
    
    // Add visual feedback for successful page load
    setTimeout(() => {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: var(--gruvbox-green);
            color: var(--gruvbox-bg0);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        loadingIndicator.textContent = '✅ Page loaded successfully!';
        
        document.body.appendChild(loadingIndicator);
        
        setTimeout(() => {
            loadingIndicator.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => loadingIndicator.remove(), 300);
        }, 3000);
    }, 500);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization: Lazy load heavy content
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add any heavy content loading here if needed
                entry.target.classList.add('visible');
            }
        });
    });
    
    // Observe all code containers for potential optimizations
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const codeContainers = document.querySelectorAll('.code-container');
            codeContainers.forEach(container => observer.observe(container));
        }, 100);
    });
}