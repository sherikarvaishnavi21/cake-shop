document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    // 1. Authentication Check for Protected Pages
    const protectedPages = ['menu.html', 'account.html'];
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        alert('Please login first to access this service.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Handle Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('loginName').value;
            const email = document.getElementById('loginEmail').value;
            const phone = document.getElementById('loginPhone').value;

            // Save user profile & login status
            const userProfile = { name, email, phone, address: 'Not provided yet' };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            localStorage.setItem('isLoggedIn', 'true');

            alert(`Welcome, ${name}! You are now logged in.`);
            window.location.href = 'menu.html';
        });
    }

    // 3. Order Modal Logic (for Menu page)
    const modal = document.getElementById('orderModal');
    const closeModal = document.querySelector('.close-btn');
    const selectedCakeText = document.getElementById('selectedCakeText');
    const orderForm = document.getElementById('checkoutForm');
    
    let currentSelectedCake = '';
    let currentSelectedPrice = '';

    const buyTriggers = document.querySelectorAll('.buy-trigger');
    buyTriggers.forEach(element => {
        element.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                alert('Please login to place an order.');
                window.location.href = 'login.html';
                return;
            }

            currentSelectedCake = e.currentTarget.getAttribute('data-name');
            currentSelectedPrice = e.currentTarget.getAttribute('data-price');
            
            if (selectedCakeText) {
                selectedCakeText.innerText = `Ordering: ${currentSelectedCake} (${currentSelectedPrice})`;
            }
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 4. Handle Order Submission & Address Update
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const customerAddress = document.getElementById('custAddress').value;
            const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
            savedProfile.address = customerAddress;
            localStorage.setItem('userProfile', JSON.stringify(savedProfile));

            const newOrder = {
                id: '#' + Math.floor(1000 + Math.random() * 9000),
                item: currentSelectedCake,
                price: currentSelectedPrice,
                status: 'Preparing in Kitchen 🍰',
                date: new Date().toLocaleDateString()
            };

            const existingOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
            existingOrders.push(newOrder);
            localStorage.setItem('userOrders', JSON.stringify(existingOrders));

            alert(`Thank you! Your order for ${currentSelectedCake} has been placed successfully.`);
            modal.style.display = 'none';
            orderForm.reset();
        });
    }

    // 5. Populate Account Page Data
    const profileContainer = document.getElementById('accountProfile');
    const historyContainer = document.getElementById('orderHistoryList');

    if (profileContainer && historyContainer) {
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        const savedOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

        if (savedProfile) {
            profileContainer.innerHTML = `
                <p><strong>Name:</strong> ${savedProfile.name}</p>
                <p><strong>Email:</strong> ${savedProfile.email}</p>
                <p><strong>Phone:</strong> ${savedProfile.phone}</p>
                <p><strong>Delivery Address:</strong> ${savedProfile.address}</p>
                <button id="logoutBtn" class="btn-primary" style="margin-top: 15px; background-color: #d9534f;">Logout</button>
            `;

            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                alert('You have been logged out successfully.');
                window.location.href = 'login.html';
            });
        }

        if (savedOrders.length > 0) {
            historyContainer.innerHTML = savedOrders.map(order => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <p><strong>Order ID:</strong> ${order.id} | <strong>Date:</strong> ${order.date}</p>
                    <p><strong>Item:</strong> ${order.item} (${order.price})</p>
                    <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">${order.status}</span></p>
                </div>
            `).join('');
        } else {
            historyContainer.innerHTML = `<p>No previous orders found.</p>`;
        }
    }
});