class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.icon = this.themeToggle.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.initializeTheme();
        this.setupEventListeners();
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();
    }

    setupEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
    }

    updateIcon() {
        const isDark = this.currentTheme === 'dark';
        this.icon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
        feather.replace();
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
