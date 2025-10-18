// TrackChain Family - Interactive JavaScript

// Global state management
let currentUser = {
    name: 'Sarah Johnson',
    role: 'earner',
    balance: 45230,
    income: 65000,
    expenses: 19770
};

let transactions = [
    {
        id: 1,
        description: 'Grocery Store',
        category: 'food',
        amount: -1250,
        timestamp: '2 hours ago',
        hash: '0x4a7b2c...',
        verified: true
    },
    {
        id: 2,
        description: 'Fuel Station',
        category: 'transport',
        amount: -800,
        timestamp: '5 hours ago',
        hash: '0x8f3e1a...',
        verified: true
    },
    {
        id: 3,
        description: 'Salary Credit',
        category: 'income',
        amount: 65000,
        timestamp: '1 day ago',
        hash: '0x2d9c4f...',
        verified: true
    }
];

// Screen navigation
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('fade-in');
        
        // Update navigation state
        updateNavigation(screenId);
        
        // Load screen-specific data
        loadScreenData(screenId);
    }
}

// Update navigation active state
function updateNavigation(activeScreenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Map screen IDs to navigation items
    const screenToNavMap = {
        'home-screen': 0,
        'add-expense-screen': 1,
        'analytics-screen': 2,
        'ledger-screen': 3,
        'profile-screen': 4
    };
    
    const navIndex = screenToNavMap[activeScreenId];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
    }
}

// Load screen-specific data
function loadScreenData(screenId) {
    switch(screenId) {
        case 'home-screen':
            updateDashboard();
            break;
        case 'analytics-screen':
            updateAnalytics();
            break;
        case 'ledger-screen':
            updateLedger();
            break;
    }
}

// Update dashboard with real-time data
function updateDashboard() {
    // Update balance
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        balanceElement.textContent = `₹${currentUser.balance.toLocaleString()}`;
    }
    
    // Update breakdown
    const incomeElement = document.querySelector('.breakdown-item .positive');
    const expenseElement = document.querySelector('.breakdown-item .negative');
    if (incomeElement) incomeElement.textContent = `+₹${currentUser.income.toLocaleString()}`;
    if (expenseElement) expenseElement.textContent = `-₹${currentUser.expenses.toLocaleString()}`;
    
    // Update recent transactions
    updateRecentTransactions();
    
    // Animate chart
    animateCircularChart();
}

// Update recent transactions list
function updateRecentTransactions() {
    const transactionList = document.querySelector('.transaction-list');
    if (!transactionList) return;
    
    // Clear existing transactions
    transactionList.innerHTML = '';
    
    // Add recent transactions
    transactions.slice(0, 3).forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionList.appendChild(transactionElement);
    });
}

// Create transaction element
function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    const categoryIcons = {
        food: 'fas fa-utensils',
        transport: 'fas fa-car',
        entertainment: 'fas fa-film',
        utilities: 'fas fa-bolt',
        income: 'fas fa-arrow-down'
    };
    
    const categoryColors = {
        food: 'food',
        transport: 'transport',
        entertainment: 'entertainment',
        utilities: 'utilities',
        income: 'positive'
    };
    
    div.innerHTML = `
        <div class="transaction-icon ${categoryColors[transaction.category]}">
            <i class="${categoryIcons[transaction.category]}"></i>
        </div>
        <div class="transaction-details">
            <h5>${transaction.description}</h5>
            <p>${getCategoryName(transaction.category)} • ${transaction.timestamp}</p>
        </div>
        <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
            ${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
        </div>
    `;
    
    return div;
}

// Get category display name
function getCategoryName(category) {
    const categoryNames = {
        food: 'Food & Dining',
        transport: 'Transport',
        entertainment: 'Entertainment',
        utilities: 'Utilities',
        shopping: 'Shopping',
        healthcare: 'Healthcare',
        education: 'Education',
        income: 'Income',
        others: 'Others'
    };
    return categoryNames[category] || 'Others';
}

// Animate circular chart
function animateCircularChart() {
    const chart = document.querySelector('.circular-chart');
    if (!chart) return;
    
    // Reset animation
    chart.style.transform = 'scale(0.8)';
    chart.style.opacity = '0';
    
    // Animate in
    setTimeout(() => {
        chart.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        chart.style.transform = 'scale(1)';
        chart.style.opacity = '1';
    }, 100);
}

// Add new expense
function addExpense() {
    const amount = document.getElementById('expense-amount').value;
    const description = document.getElementById('expense-description').value;
    const category = document.getElementById('expense-category').value;
    
    if (!amount || !description || !category) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Create new transaction
    const newTransaction = {
        id: transactions.length + 1,
        description: description,
        category: category,
        amount: -parseFloat(amount),
        timestamp: 'Just now',
        hash: generateHash(),
        verified: true
    };
    
    // Add to transactions array
    transactions.unshift(newTransaction);
    
    // Update user balance
    currentUser.balance -= parseFloat(amount);
    currentUser.expenses += parseFloat(amount);
    
    // Show success notification
    showNotification('Expense added successfully!', 'success');
    
    // Clear form
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-category').value = '';
    
    // Go back to home screen
    setTimeout(() => {
        showScreen('home-screen');
    }, 1500);
}

// Generate mock blockchain hash
function generateHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 8; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash + '...';
}

// Update analytics screen
function updateAnalytics() {
    // Animate bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.height = '0%';
        setTimeout(() => {
            bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.height = bar.getAttribute('data-height') || bar.style.height;
        }, index * 200);
    });
    
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = bar.getAttribute('data-width') || bar.style.width;
        }, index * 150);
    });
}

// Update ledger screen
function updateLedger() {
    const ledgerList = document.querySelector('.ledger-list');
    if (!ledgerList) return;
    
    // Clear existing items
    ledgerList.innerHTML = '';
    
    // Add all transactions
    transactions.forEach(transaction => {
        const ledgerElement = createLedgerElement(transaction);
        ledgerList.appendChild(ledgerElement);
    });
}

// Create ledger element
function createLedgerElement(transaction) {
    const div = document.createElement('div');
    div.className = 'ledger-item verified';
    
    div.innerHTML = `
        <div class="ledger-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="ledger-details">
            <h5>${transaction.description}</h5>
            <p class="ledger-category">${getCategoryName(transaction.category)}</p>
            <p class="ledger-hash">Hash: ${transaction.hash}</p>
        </div>
        <div class="ledger-amount">
            <span class="amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                ${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
            </span>
            <span class="timestamp">${transaction.timestamp}</span>
        </div>
    `;
    
    return div;
}

// Toggle theme
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle.checked) {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--success-green)' : type === 'error' ? 'var(--danger-red)' : 'var(--accent-teal)'};
        color: white;
        padding: 16px 24px;
        border-radius: var(--border-radius);
        font-weight: 500;
        z-index: 10000;
        box-shadow: var(--shadow-medium);
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Family role selection
function selectRole(roleElement) {
    // Remove selected class from all roles
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked role
    roleElement.classList.add('selected');
    
    // Store selected role
    const role = roleElement.getAttribute('data-role');
    currentUser.role = role;
    
    // Update UI based on role
    updateRoleUI(role);
}

// Update UI based on selected role
function updateRoleUI(role) {
    const roleNames = {
        earner: 'Earner',
        spender: 'Spender',
        child: 'Child'
    };
    
    // Update user details in dashboard
    const userDetails = document.querySelector('.user-details p');
    if (userDetails) {
        userDetails.textContent = `${roleNames[role]} • Family Account`;
    }
}

// Search transactions
function searchTransactions(query) {
    const ledgerItems = document.querySelectorAll('.ledger-item');
    
    ledgerItems.forEach(item => {
        const description = item.querySelector('h5').textContent.toLowerCase();
        const category = item.querySelector('.ledger-category').textContent.toLowerCase();
        
        if (description.includes(query.toLowerCase()) || category.includes(query.toLowerCase())) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize app
function initApp() {
    // Load saved theme
    loadTheme();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize dashboard
    updateDashboard();
    
    // Show welcome screen
    showScreen('welcome-screen');
}

// Add event listeners
function addEventListeners() {
    // Role selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => selectRole(card));
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTransactions(e.target.value);
        });
    }
    
    // File upload
    const fileInput = document.getElementById('receipt-file');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Form validation
    const expenseForm = document.querySelector('.expense-form');
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addExpense();
        });
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const uploadArea = document.querySelector('.upload-area');
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--success-green);"></i>
            <p>Receipt uploaded: ${file.name}</p>
        `;
        uploadArea.style.borderColor = 'var(--success-green)';
        uploadArea.style.background = 'rgba(40, 167, 69, 0.1)';
    }
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Randomly update balance (simulate small transactions)
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            const change = (Math.random() - 0.5) * 1000; // Random change between -500 and +500
            currentUser.balance += change;
            
            if (change < 0) {
                currentUser.expenses += Math.abs(change);
            } else {
                currentUser.income += change;
            }
            
            // Update dashboard if it's currently visible
            if (document.getElementById('home-screen').classList.contains('active')) {
                updateDashboard();
            }
        }
    }, 5000);
}

// Add smooth scrolling
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add pull-to-refresh functionality
let startY = 0;
let currentY = 0;
let isPulling = false;

document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    currentY = e.touches[0].clientY;
    const pullDistance = currentY - startY;
    
    if (pullDistance > 100 && window.scrollY === 0) {
        isPulling = true;
        // Add pull-to-refresh visual feedback
        document.body.style.transform = `translateY(${Math.min(pullDistance * 0.3, 50)}px)`;
    }
});

document.addEventListener('touchend', () => {
    if (isPulling) {
        document.body.style.transform = 'translateY(0)';
        isPulling = false;
        
        // Trigger refresh
        setTimeout(() => {
            updateDashboard();
            showNotification('Data refreshed!', 'success');
        }, 300);
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Start real-time updates
setTimeout(simulateRealTimeUpdates, 2000);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to go back
    if (e.key === 'Escape') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && activeScreen.id !== 'welcome-screen' && activeScreen.id !== 'login-screen') {
            showScreen('home-screen');
        }
    }
    
    // Number keys for quick navigation
    if (e.key >= '1' && e.key <= '5') {
        const screens = ['home-screen', 'add-expense-screen', 'analytics-screen', 'ledger-screen', 'profile-screen'];
        const screenIndex = parseInt(e.key) - 1;
        if (screens[screenIndex]) {
            showScreen(screens[screenIndex]);
        }
    }
});

// Add haptic feedback for mobile
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Add haptic feedback to buttons
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        addHapticFeedback();
    }
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);
