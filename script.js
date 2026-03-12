/**
 * ROX WHITE CARD - Core Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. PRELOADER ANIMATION (Cinematic Next-Level)
       ========================================= */
    const preloader = document.querySelector('.preloader');
    const statusText = document.querySelector('.status-text');
    const statusPercentage = document.querySelector('.status-percentage');
    const loaderBar = document.querySelector('.loader-bar');

    // Add loading class to body to prevent scrolling
    document.body.classList.add('loading');

    // Cinematic Loading Sequence
    let progress = 0;

    // Non-linear progress increment for realism
    const simulateLoading = () => {
        const increment = Math.random() * 8 + 2; // Random increment between 2 and 10
        progress += increment;

        if (progress > 100) progress = 100;

        // Update DOM
        loaderBar.style.width = `${progress}%`;

        if (progress < 100) {
            const nextTick = Math.random() * 40 + 20; // Fast smooth loading
            setTimeout(simulateLoading, nextTick);
        } else {
            // Elegant Loading Complete
            setTimeout(() => {
                preloader.classList.add('loaded'); // Triggers elegant fade
                document.body.classList.remove('loading');

                // Trigger initial hero animations after fade
                setTimeout(() => {
                    document.querySelectorAll('.hero-content.reveal-left, .hero-graphic.reveal-right').forEach(el => {
                        el.classList.add('active');
                    });
                }, 800);

            }, 400); // Slight pause at 100%
        }
    };

    // Start sequence
    setTimeout(simulateLoading, 300);

    /* =========================================
       2. NAVBAR SCROLL EFFECT
       ========================================= */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       3. INTERSECTION OBSERVER (Scroll Reveals)
       ========================================= */
    // Top-tier scroll animation logic
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to trigger CSS transition
                entry.target.classList.add('active');

                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        // Exclude hero elements from observer, they animate after preloader
        if (!el.classList.contains('hero-content') && !el.classList.contains('hero-graphic')) {
            revealObserver.observe(el);
        }
    });

    /* =========================================
       4. HERO 3D CARD PARALLAX EFFECT (Mouse Move)
       ========================================= */
    const card = document.querySelector('.rox-card-3d');
    const heroSection = document.querySelector('.hero');

    // Only apply on desktop where mousemove makes sense
    if (window.innerWidth > 992 && card) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            // Apply slight rotation based on cursor position
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset when mouse leaves hero section
        heroSection.addEventListener('mouseleave', () => {
            card.style.transform = `rotateY(-15deg) rotateX(10deg)`; // Back to default
        });
    }

    /* =========================================
       5. SMOOTH SCROLL FOR NAV LINKS
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* =========================================
       6. FLASH USDT FORM LOGIC
       ========================================= */
    const usdtTerminal = document.getElementById('usdt-form-container');
    const btnLaunchTerminal = document.getElementById('btn-show-usdt-form');
    const usdtAmountInput = document.getElementById('usdt-amount');
    const usdtFeeDisplay = document.getElementById('usdt-fee');
    const usdtPurchaseForm = document.getElementById('usdt-purchase-form');

    if (btnLaunchTerminal && usdtTerminal) {
        // Show form overlay modal
        btnLaunchTerminal.addEventListener('click', (e) => {
            e.preventDefault();
            usdtTerminal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Reset form completely on open
            if (usdtPurchaseForm) usdtPurchaseForm.reset();
            if (usdtFeeDisplay) usdtFeeDisplay.textContent = '$0.00';
        });
    }

    if (usdtAmountInput && usdtFeeDisplay) {
        // Calculate Fee Dynamically
        usdtAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value);
            if (!isNaN(amount) && amount > 0) {
                // $17 fee per 1000 USDT calculation
                const fee = (amount / 1000) * 17;
                usdtFeeDisplay.textContent = `$${fee.toFixed(2)}`;
            } else {
                usdtFeeDisplay.textContent = '$0.00';
            }
        });
    }

    if (usdtPurchaseForm) {
        // Handle Submit and Open Shared Crypto QR Modal
        usdtPurchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const wallet = document.getElementById('usdt-wallet').value;
            const amount = document.getElementById('usdt-amount').value;

            if (wallet && amount) {
                // Calculate display amounts
                const parsedAmount = parseFloat(amount);
                const fee = (parsedAmount / 1000) * 17;

                // Hide the USDT order terminal
                usdtTerminal.style.display = 'none';

                // Set universal QR modal values
                document.getElementById('modal-pay-amount').textContent = `$${fee.toFixed(2)}`;

                // Show Universal Crypto QR Modal Popup
                const qrModal = document.getElementById('usdt-modal');
                if (qrModal) {
                    qrModal.classList.add('active');
                    // body is already hidden from previous modal
                }
            }
        });
    }

    // Modal interactions
    const modal = document.getElementById('usdt-modal');
    const btnCloseModal = document.getElementById('close-usdt-modal');
    const btnCopyAddress = document.getElementById('btn-copy-address');
    const btnConfirmPayment = document.getElementById('btn-confirm-payment');

    // Crypto Network Data & Tab Logic
    const cryptoData = {
        'btc': {
            label: 'Send Bitcoin To:',
            img: 'btc.jpeg',
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        },
        'sol': {
            label: 'Send Solana To:',
            img: 'solana.jpeg',
            address: 'CYJec2JtKmA9cfa8gNPNTU9JXkLRo4qMMBzwvV5WNA2Q'
        },
        'usdt-trc20': {
            label: 'Send USDT (TRX)To:',
            img: 'usdt trx.jpeg',
            address: 'TQLuxmGFVveybjtfodTykePjafwX8dRtrd'
        },
        'usdt-erc20': {
            label: 'Send USDT (ERC20) To:',
            img: 'usdt eth.jpeg',
            address: '0xb6C87922C62a36daf93E628A4D02FF6B421E4A3F'
        },
        'usdt-sol': {
            label: 'Send USDT (SOL) To:',
            img: 'usdt sol.jpeg',
            address: 'CYJec2JtKmA9cfa8gNPNTU9JXkLRo4qMMBzwvV5WNA2Q'
        }
    };

    const cryptoTabs = document.querySelectorAll('.crypto-tab');
    const qrImg = document.getElementById('payment-qr-img');
    const networkLabel = document.getElementById('payment-network-label');
    const merchantWallet = document.getElementById('merchant-wallet');

    cryptoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            cryptoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const network = tab.getAttribute('data-network');
            const data = cryptoData[network];

            if (data) {
                qrImg.src = data.img;
                networkLabel.textContent = data.label;
                merchantWallet.value = data.address;
            }
        });
    });

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside content
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (btnCopyAddress) {
        btnCopyAddress.addEventListener('click', () => {
            const copyText = document.getElementById('merchant-wallet');
            copyText.select();
            copyText.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(copyText.value).then(() => {
                btnCopyAddress.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    btnCopyAddress.innerHTML = '<i class="fa-regular fa-copy"></i>';
                }, 2000);
            });
        });
    }

    if (btnConfirmPayment) {
        btnConfirmPayment.addEventListener('click', () => {
            btnConfirmPayment.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            // Simulate processing
            setTimeout(() => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                usdtPurchaseForm.reset();
                usdtFeeDisplay.textContent = '$0.00';
                btnCancelUsdt.click();
                alert("Payment processing initiated. You will be notified once it is confirmed on the blockchain.");
                btnConfirmPayment.innerHTML = 'I Have Made The Payment';
            }, 2000);//https://www.instagram.com/doomsuniverse_?igsh=emlmaW1oNHgwNzJ2
        });
    }

    /* =========================================
       7. CARD ORDER MODAL LOGIC (VISA/MASTERCARD)
       ========================================= */
    const btnBuyVisa = document.getElementById('btn-buy-visa');
const btnBuyMastercard = document.getElementById('btn-buy-mastercard');
const cardOrderModal = document.getElementById('card-order-modal');
const closeCardModal = document.getElementById('close-card-modal');
const cardBalanceInput = document.getElementById('card-balance-input');
const cardRegionRadios = document.querySelectorAll('input[name="card_region"]');
const deliveryMethodRadios = document.querySelectorAll('input[name="delivery_method"]');
const countryInputGroup = document.getElementById('country-input-group');
const digitalDeliveryGroup = document.getElementById('digital-delivery-group');
const physicalDeliveryGroup = document.getElementById('physical-delivery-group');
const cardGmailInput = document.getElementById('card-gmail-input');
const cardShippingName = document.getElementById('card-shipping-name');
const cardShippingAddress = document.getElementById('card-shipping-address');

const cardCalculatedFee = document.getElementById('card-calculated-fee');
const cardOrderForm = document.getElementById('card-order-form');
// We don't need a modal title element anymore since we have the visual card.

// Premium Preview Elements
const previewType = document.getElementById('preview-card-type');
const previewIcon = document.getElementById('preview-card-icon');
const previewRegion = document.getElementById('preview-card-region');

function openCardModal(cardType) {
    if (cardOrderModal) {
        // Update the live visual 3D Card Preview
        if (cardType.toLowerCase().includes("visa")) {
            previewType.textContent = "VISA CARD";
            previewIcon.className = "fa-brands fa-cc-visa";
        } else {
            previewType.textContent = "MASTERCARD";
            previewIcon.className = "fa-brands fa-cc-mastercard";
        }
        previewRegion.textContent = "INTL";

        cardOrderForm.reset();
        cardCalculatedFee.textContent = '$0.00';

        // Default resets
        countryInputGroup.style.display = 'none';
        digitalDeliveryGroup.style.display = 'flex';
        physicalDeliveryGroup.style.display = 'none';
        cardGmailInput.setAttribute('required', 'true');
        cardShippingName.removeAttribute('required');
        cardShippingAddress.removeAttribute('required');

        cardOrderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

if (btnBuyVisa) btnBuyVisa.addEventListener('click', () => openCardModal("Visa Card"));
if (btnBuyMastercard) btnBuyMastercard.addEventListener('click', () => openCardModal("Mastercard"));

if (closeCardModal) {
    closeCardModal.addEventListener('click', () => {
        cardOrderModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (cardBalanceInput) {
    cardBalanceInput.addEventListener('input', (e) => {
        const balance = parseFloat(e.target.value);
        if (!isNaN(balance) && balance > 0) {
            const fee = (balance / 100) * 30;
            cardCalculatedFee.textContent = `$${fee.toFixed(2)}`;
        } else {
            cardCalculatedFee.textContent = '$0.00';
        }
    });
}

cardRegionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'local') {
            countryInputGroup.style.display = 'flex';
            document.getElementById('card-country-input').setAttribute('required', 'true');
            previewRegion.textContent = "LOCAL";
        } else {
            countryInputGroup.style.display = 'none';
            document.getElementById('card-country-input').removeAttribute('required');
            previewRegion.textContent = "INTL";
        }
    });
});

deliveryMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'digital') {
            digitalDeliveryGroup.style.display = 'flex';
            physicalDeliveryGroup.style.display = 'none';
            cardGmailInput.setAttribute('required', 'true');
            cardShippingName.removeAttribute('required');
            cardShippingAddress.removeAttribute('required');
        } else {
            digitalDeliveryGroup.style.display = 'none';
            physicalDeliveryGroup.style.display = 'flex';
            cardGmailInput.removeAttribute('required');
            cardShippingName.setAttribute('required', 'true');
            cardShippingAddress.setAttribute('required', 'true');
        }
    });
});

if (cardOrderForm) {
    cardOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const balance = parseFloat(cardBalanceInput.value);
        if (!isNaN(balance) && balance > 0) {
            const fee = (balance / 100) * 30;

            // Hide card modal
            cardOrderModal.classList.remove('active');

            // Set the payment modal value to ONLY the processing fee
            document.getElementById('modal-pay-amount').textContent = `$${fee.toFixed(2)}`;

            // Show the universal crypto payment modal
            const usdtModal = document.getElementById('usdt-modal');
            if (usdtModal) {
                usdtModal.classList.add('active');
                // Body overflow is already hidden from previous modal
            }
        }
    });
}

/* =========================================
   8. SWIPER 3D COVERFLOW INITIALIZATION
   ========================================= */
if (typeof Swiper !== 'undefined' && document.querySelector('.proofSwiper')) {
    const swiper = new Swiper('.proofSwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true,
    });
}

});
