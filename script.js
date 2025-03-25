document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = [];
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartModal = document.getElementById('cart-modal');
    const cartLink = document.getElementById('cart-link');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show added notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `${name} added to cart!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-name">${item.name} x${item.quantity}</div>
                    <div class="cart-item-price">₹${itemTotal}</div>
                    <span class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
        }
        
        // Update total
        cartTotal.textContent = total;
    }
    
    // Remove from cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // Toggle cart modal
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const orderSummary = cart.map(item => 
            `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
        ).join('\n');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        alert(`Order Summary:\n\n${orderSummary}\n\nTotal: ₹${total}\n\nThank you for your order!\n\nWe'll contact you shortly for delivery details.`);
        
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Here you would typically send this data to a server
        console.log('Form submitted:', { name, phone, message });
        
        // Show success message
        alert('Thank you for your message! We will contact you shortly on your provided phone number.');
        
        // Reset form
        this.reset();
    });
    
    // Add notification style dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Location Finder Functionality
const citySelector = document.getElementById('city-selector');
const locationResult = document.getElementById('location-result');

const locations = {
    delhi: "Our Delhi outlet: Connaught Place, Open 11AM-11PM, Phone: 011-12345678",
    mumbai: "Our Mumbai outlet: Bandra West, Open 10AM-Midnight, Phone: 022-87654321",
    bangalore: "Our Bangalore outlet: Koramangala, Open 10:30AM-11:30PM, Phone: 080-11223344"
};

citySelector.addEventListener('change', function() {
    const selectedCity = this.value;
    if (selectedCity && locations[selectedCity]) {
        locationResult.textContent = locations[selectedCity];
        locationResult.style.display = 'block';
    } else {
        locationResult.style.display = 'none';
    }
});

// Countdown Timer for Special Offer
function updateOfferTimer() {
    const offerEnd = new Date();
    offerEnd.setHours(23, 59, 59); // Today at midnight
    
    const now = new Date();
    const diff = offerEnd - now;
    
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.querySelectorAll('.offer-timer').forEach(el => {
        el.innerHTML = `Offer ends in: ${Math.floor(hours)}h ${mins}m ${secs}s`;
    });
}

setInterval(updateOfferTimer, 1000);
updateOfferTimer();

// Add to Cart Animation
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
    });
});

// Show loader when page is loading
window.addEventListener('load', function() {
    document.getElementById('loader').style.display = 'none';
});

// Timer for special offer
function updateSpecialTimer() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Today at midnight
    
    const diff = endOfDay - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.querySelector('.offer-timer').textContent = 
        `Offer ends in: ${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

setInterval(updateSpecialTimer, 1000);
updateSpecialTimer();

// Special order button functionality
document.querySelector('.special-order-btn').addEventListener('click', function() {
    const specialItem = {
        id: "special-001",
        name: "Spicy Chicken Maharaja Burger (Today's Special)",
        price: 199,
        quantity: 1
    };
    
    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === specialItem.id);
    
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(specialItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    alert(`${specialItem.name} added to cart! Special price: ₹${specialItem.price}`);
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}