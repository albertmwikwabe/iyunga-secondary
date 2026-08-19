/**
 * Iyunga Secondary School Website - Core Scripts
 * Features: Announcement Ticker, Department Filter, and Fee Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
    initAnnouncementTicker();
    initDepartmentFilter();
    initFeeCalculator();
});

/**
 * 1. Dynamic Announcement Ticker
 * Rotates important notices at the top of the homepage.
 */
function initAnnouncementTicker() {
    const notices = [
        "Form Five Selection results for 2026 are now out!",
        "Mid-term examinations start on Monday, September 7, 2026.",
        "Parents-Teachers Association (PTA) meeting scheduled for next month.",
        "Join the Iyunga Talent Club - Registrations open at the sports office."
    ];
    
    const tickerContainer = document.getElementById('ticker-content');
    if (!tickerContainer) return;

    let currentIndex = 0;

    function updateTicker() {
        tickerContainer.style.opacity = 0;
        setTimeout(() => {
            tickerContainer.textContent = notices[currentIndex];
            tickerContainer.style.opacity = 1;
            currentIndex = (currentIndex + 1) % notices.length;
        }, 500); // Smooth fade transition
    }

    updateTicker();
    setInterval(updateTicker, 5000); // Change notice every 5 seconds
}

/**
 * 2. Department Filter
 * Filters school departments (Science, Arts, Sports) dynamically.
 */
function initDepartmentFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const departmentCards = document.querySelectorAll('.dept-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            // Show or hide department cards
            departmentCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 3. Admission Fee Calculator
 * Calculates estimated starting costs based on school type (Boarding vs. Day).
 */
function initFeeCalculator() {
    const form = document.getElementById('fee-calculator-form');
    const resultDisplay = document.getElementById('fee-total-display');

    if (!form || !resultDisplay) return;

    form.addEventListener('change', () => {
        const studentType = document.getElementById('student-type').value; // 'boarding' or 'day'
        const uniformQty = parseInt(document.getElementById('uniform-qty').value) || 0;

        // Base fees in Tanzanian Shillings (TZS)
        const baseFee = studentType === 'boarding' ? 150000 : 40000;
        const uniformCostPerUnit = 25000;
        const cautiousMoney = 10000;

        // Total calculation
        const totalCost = baseFee + (uniformQty * uniformCostPerUnit) + cautiousMoney;

        // Format currency for display
        resultDisplay.textContent = `TZS ${totalCost.toLocaleString('en-US')}`;
    });
}
