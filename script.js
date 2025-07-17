// Sample file data - in a real application, this would come from an API
const sampleFiles = [
    { name: 'index.html', type: 'html', isFolder: false },
    { name: 'styles.css', type: 'css', isFolder: false },
    { name: 'script.js', type: 'js', isFolder: false },
    { name: 'README.md', type: 'md', isFolder: false },
    { name: 'package.json', type: 'json', isFolder: false },
    { name: 'src', type: 'folder', isFolder: true },
    { name: 'components', type: 'folder', isFolder: true },
    { name: 'utils', type: 'folder', isFolder: true },
    { name: 'App.jsx', type: 'jsx', isFolder: false },
    { name: 'main.tsx', type: 'tsx', isFolder: false },
    { name: 'style.scss', type: 'scss', isFolder: false },
    { name: 'config.py', type: 'py', isFolder: false },
    { name: 'Main.java', type: 'java', isFolder: false },
    { name: 'program.cpp', type: 'cpp', isFolder: false },
    { name: 'header.h', type: 'c', isFolder: false },
    { name: 'porting manual', type: 'file', isFolder: false }
];

class FileBrowser {
    constructor() {
        this.fileList = document.getElementById('fileList');
        this.toast = document.getElementById('toast');
        this.init();
    }

    init() {
        this.renderFiles();
        this.setupEventListeners();
    }

    getFileIcon(file) {
        if (file.isFolder) {
            return 'fas fa-folder';
        }
        
        const iconMap = {
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'scss': 'fab fa-sass',
            'js': 'fab fa-js-square',
            'jsx': 'fab fa-react',
            'ts': 'fas fa-code',
            'tsx': 'fab fa-react',
            'json': 'fas fa-brackets-curly',
            'md': 'fab fa-markdown',
            'py': 'fab fa-python',
            'java': 'fab fa-java',
            'cpp': 'fas fa-code',
            'c': 'fas fa-code',
            'h': 'fas fa-code'
        };
        
        return iconMap[file.type] || 'fas fa-file';
    }

    createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.setAttribute('data-type', file.type);
        
        const icon = document.createElement('i');
        icon.className = `file-icon ${file.isFolder ? 'folder' : 'file'} ${this.getFileIcon(file)}`;
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyButton.setAttribute('data-filename', file.name);
        
        fileItem.appendChild(icon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(copyButton);
        
        return fileItem;
    }

    renderFiles() {
        this.fileList.innerHTML = '';
        
        // Sort files: folders first, then files alphabetically
        const sortedFiles = [...sampleFiles].sort((a, b) => {
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;
            return a.name.localeCompare(b.name);
        });
        
        sortedFiles.forEach(file => {
            const fileItem = this.createFileItem(file);
            this.fileList.appendChild(fileItem);
        });
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast();
        } catch (err) {
            // Fallback for older browsers
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
                this.showToast();
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            
            document.body.removeChild(textArea);
        }
    }

    showToast() {
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }

    setupEventListeners() {
        this.fileList.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-button') || e.target.closest('.copy-button')) {
                e.stopPropagation();
                const button = e.target.closest('.copy-button');
                const filename = button.getAttribute('data-filename');
                this.copyToClipboard(filename);
            }
        });

        // Add keyboard support
        this.fileList.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const copyButton = e.target.querySelector('.copy-button');
                if (copyButton) {
                    e.preventDefault();
                    const filename = copyButton.getAttribute('data-filename');
                    this.copyToClipboard(filename);
                }
            }
        });

        // Make file items focusable for accessibility
        document.querySelectorAll('.file-item').forEach(item => {
            item.setAttribute('tabindex', '0');
        });
    }
}

// Initialize the file browser when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FileBrowser();
});

// Add some additional functionality for demo purposes
document.addEventListener('DOMContentLoaded', () => {
    // Add a refresh button functionality (optional)
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Files';
    refreshButton.style.cssText = `
        background: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        transition: background 0.2s ease;
    `;
    
    refreshButton.addEventListener('mouseenter', () => {
        refreshButton.style.background = '#2980b9';
    });
    
    refreshButton.addEventListener('mouseleave', () => {
        refreshButton.style.background = '#3498db';
    });
    
    refreshButton.addEventListener('click', () => {
        location.reload();
    });
    
    const fileBrowser = document.querySelector('.file-browser');
    fileBrowser.insertBefore(refreshButton, fileBrowser.firstChild);
});