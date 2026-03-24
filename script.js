/**
 * ROX WHITE CARD - Core Interactions & Animations
 */

// ==========================================
// ✏️ EDIT: GOOGLE SHEETS WEB APP URL
// Replace the string below with your deployed Google Apps Script Web App URL
// Example: "https://script.google.com/macros/s/AKfycb.../exec"
// ==========================================
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxSLzV2RjeF-r-rxrBM4qeveEdLEI4yuguFeHvyrQBnxBopvulKDg9wvDC3eqKYLagrnQ/exec";

function sendToGoogleSheets(details) {
    if (!GOOGLE_SHEETS_WEB_APP_URL) return; // Skip if URL not set

    let serviceName = "Unknown Service";
    const serviceMatch = details.match(/Service:\s*(.+)/);
    if (serviceMatch && serviceMatch[1]) {
        serviceName = serviceMatch[1].trim();
    }

    const formData = new URLSearchParams();
    formData.append("service", serviceName);
    formData.append("details", details);

    fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).catch(err => console.error("Error sending to Google Sheets:", err));
}

document.addEventListener('DOMContentLoaded', () => {
    let latestOrderDetails = "No details available.";

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

                    // Trigger Welcome Modal (Disclaimer)
                    const welcomeModal = document.getElementById('welcome-modal');
                    const btnAcceptWelcome = document.getElementById('btn-accept-welcome');
                    if (welcomeModal && !sessionStorage.getItem('welcomeShown')) {
                        setTimeout(() => {
                            welcomeModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }, 500); // Small delay after hero animates

                        if (btnAcceptWelcome) {
                            btnAcceptWelcome.addEventListener('click', () => {
                                welcomeModal.classList.remove('active');
                                document.body.style.overflow = '';
                                sessionStorage.setItem('welcomeShown', 'true');
                            });
                        }
                    }
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
       2B. HAMBURGER MOBILE DRAWER
       ========================================= */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when any drawer link is clicked
    document.querySelectorAll('.drawer-links a, .drawer-cta').forEach(link => {
        link.addEventListener('click', closeDrawer);
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
                // $90 fee per 300 USDT calculation
                const fee = (amount / 300) * 90;
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
                const fee = (parsedAmount / 300) * 90;

                latestOrderDetails = `Service: Flash USDT\nWallet ID: ${wallet}\nAmount Requested: $${amount}\nProcessing Fee: $${fee.toFixed(2)}`;

                // Hide the USDT order terminal
                usdtTerminal.style.display = 'none';

                // Set universal QR modal values
                document.getElementById('modal-pay-amount').textContent = `$${fee.toFixed(2)}`;

                // Update modal subtitle
                const modalSubtitle = document.getElementById('payment-modal-subtitle');
                if (modalSubtitle) modalSubtitle.textContent = 'Pay the processing fee for your Flash USDT order in crypto.';

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
            address: 'bc1qf8en7zlwm7t4wxq9y6e4mv0rslq7ray3v2k3wk'
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
        btnConfirmPayment.addEventListener('click', (e) => {
            const proofFile = document.getElementById('proof-of-payment');
            if (proofFile && proofFile.files.length === 0) {
                alert('Please attach a screenshot of your payment proof before confirming.');
                return;
            }

            btnConfirmPayment.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            
            // Set hidden field value
            const hiddenOrderDetails = document.getElementById('hidden-order-details');
            if (hiddenOrderDetails) hiddenOrderDetails.value = latestOrderDetails;

            const cryptoPaymentForm = document.getElementById('crypto-payment-form');
            if (!cryptoPaymentForm) return;

            // Use FormData to include the file attachment natively
            const formData = new FormData(cryptoPaymentForm);

            // Send data to Google Sheets too
            sendToGoogleSheets(latestOrderDetails);

            // Use FormSubmit AJAX with FormData
            fetch("https://formsubmit.co/ajax/roshansha2005@gmail.com", {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                if (usdtPurchaseForm) {
                    usdtPurchaseForm.reset();
                    if (usdtFeeDisplay) usdtFeeDisplay.textContent = '$0.00';
                }
                if (cryptoPaymentForm) cryptoPaymentForm.reset();

                // Show Premium Success Modal
                const successModal = document.getElementById('order-success-modal');
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                btnConfirmPayment.innerHTML = 'I Have Made The Payment';
            })
            .catch(error => {
                console.error('Error submitting form', error);
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Still show success modal (fallback if email fails but sheets might have succeeded)
                const successModal = document.getElementById('order-success-modal');
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                btnConfirmPayment.innerHTML = 'I Have Made The Payment';
            });
        });
    }

    // Close Success Modal
    const btnCloseSuccess = document.getElementById('btn-close-success');
    const orderSuccessModal = document.getElementById('order-success-modal');
    if (btnCloseSuccess && orderSuccessModal) {
        btnCloseSuccess.addEventListener('click', () => {
            orderSuccessModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    /* =========================================
       FLASH USDT - LIVE INTEL ANIMATIONS
       ========================================= */
    function animateUSDTStats() {
        const nodesEl = document.getElementById('stat-nodes');
        const gasEl = document.getElementById('stat-gas');
        const blockEl = document.getElementById('stat-blocks');

        if (!nodesEl || !gasEl || !blockEl) return;

        // Subtle Random Fluctuations
        setInterval(() => {
            // Nodes fluctuation
            const nodes = parseInt(nodesEl.textContent.replace(',', ''));
            const nodeDiff = Math.floor(Math.random() * 5) - 2;
            nodesEl.textContent = (nodes + nodeDiff).toLocaleString();

            // Gas fluctuation
            const gas = parseInt(gasEl.textContent);
            const gasDiff = Math.floor(Math.random() * 3) - 1;
            const newGas = Math.max(15, Math.min(60, gas + gasDiff));
            gasEl.textContent = `${newGas} Gwei`;

            // Block Height (always increasing)
            const blocks = parseInt(blockEl.textContent.replace(/,/g, ''));
            blockEl.textContent = (blocks + 1).toLocaleString();
        }, 3000);
    }

    function setupLiveFeed() {
        const feed = document.getElementById('usdt-live-feed');
        if (!feed) return;

        const addresses = ['TQLu...Rtrd', '0xb6...4A3F', 'bc1q...0wlh', 'CYJe...NA2Q', 'TWRs...m9Pn', '0x71...e921', 'Tr82...1xPc', 'bc1p...92Lk'];
        const amounts = [500, 1200, 3000, 5000, 10000, 2500, 150, 800];

        setInterval(() => {
            const addr = addresses[Math.floor(Math.random() * addresses.length)];
            const amt = amounts[Math.floor(Math.random() * amounts.length)];

            const item = document.createElement('div');
            item.className = 'feed-item';
            item.innerHTML = `
                <span class="feed-address">${addr}</span>
                <span class="feed-amount">+${amt.toLocaleString()} USDT</span>
            `;

            feed.prepend(item);
            if (feed.children.length > 8) {
                feed.removeChild(feed.lastChild);
            }
        }, 4000);
    }

    animateUSDTStats();
    setupLiveFeed();

    /* =========================================
       ULTRA-PREMIUM IPHONE & WALLET LOGIC
       ========================================= */
    const iphone = document.getElementById('usdt-iphone');
    const usdtSection = document.querySelector('.flash-usdt-section');
    const balanceEl = document.getElementById('iphone-balance');
    const dynamicIsland = document.getElementById('dynamic-island');
    const walletChart = document.getElementById('wallet-chart');
    const latestTxAmt = document.getElementById('latest-tx-amt');

    // 1. Initialize Portfolio Chart
    if (walletChart) {
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${Math.floor(Math.random() * 40) + 20}%`;
            walletChart.appendChild(bar);
        }
    }

    // 2. 3D Parallax Tilt (Refined for Real Asset)
    if (iphone && usdtSection) {
        usdtSection.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 992) return;
            const rect = usdtSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 30;
            const rotateX = (0.5 - y) * 15;
            iphone.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        usdtSection.addEventListener('mouseleave', () => {
            iphone.style.transform = `rotateY(-20deg) rotateX(10deg)`;
        });
    }

    // 3. Sophisticated Balance & Dynamic Island "Flash"
    if (balanceEl && dynamicIsland) {
        setInterval(() => {
            if (Math.random() > 0.75) {
                const currentBalance = parseFloat(balanceEl.textContent.replace(',', ''));
                const flashAmt = Math.floor(Math.random() * 800) + 200;

                // Expand Dynamic Island
                dynamicIsland.classList.add('active');

                // Update Balance with Delay
                setTimeout(() => {
                    balanceEl.style.color = '#10b981';
                    balanceEl.style.transform = 'scale(1.05)';
                    balanceEl.textContent = (currentBalance + flashAmt).toLocaleString(undefined, { minimumFractionDigits: 2 });
                    if (latestTxAmt) latestTxAmt.textContent = `+$${flashAmt.toLocaleString()}`;

                    // Update Chart
                    if (walletChart) {
                        const bars = walletChart.children;
                        const lastBar = bars[bars.length - 1];
                        lastBar.style.height = '80%';
                        setTimeout(() => { lastBar.style.height = '60%'; }, 500);
                    }
                }, 300);

                // Collapse Dynamic Island
                setTimeout(() => {
                    dynamicIsland.classList.remove('active');
                    balanceEl.style.color = '#fff';
                    balanceEl.style.transform = 'scale(1)';
                }, 3000);
            }
        }, 6000);
    }

    // 4. Infinite Beauty: 2-Slide Carousel Logic
    const carousel = document.getElementById('iphone-carousel');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const stakeLog = document.getElementById('stake-log');
    let currentSlide = 0;

    if (carousel && dots.length > 0) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % dots.length;

            // Premium Slide Transition
            const slides = carousel.querySelectorAll('.iphone-slide');
            slides.forEach((slide) => {
                slide.style.transform = `translateX(-${currentSlide * 100}%)`;
            });

            // Dot Animation
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }, 7000); // 7s for better readability
    }

    // High-Fidelity Stake Log Simulation
    if (stakeLog) {
        const logMessages = [
            "> Establishing P2P Link...",
            "> Success: Node ID #99d21",
            "> Synchronizing Ledger...",
            "> Broadcasting 500.00 USDT...",
            "> Waiting for Miner... [1/3]",
            "> Confirmation Received"
        ];
        let logIndex = 0;
        setInterval(() => {
            const line = document.createElement('div');
            line.className = 'v3-log-line';
            line.textContent = logMessages[logIndex % logMessages.length];
            stakeLog.appendChild(line);
            stakeLog.scrollTop = stakeLog.scrollHeight;
            logIndex++;
            if (stakeLog.children.length > 4) stakeLog.removeChild(stakeLog.firstChild);
        }, 2200);
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
                const fee = (balance / 100) * 35;
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
                const fee = (balance / 100) * 35;
                const cardTypeName = previewType ? previewType.textContent : 'Card';

                const region = document.querySelector('input[name="card_region"]:checked')?.value || 'N/A';
                const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked')?.value || 'N/A';
                const buyerEmail = document.getElementById('card-gmail-input')?.value || 'N/A';
                const shipName = document.getElementById('card-shipping-name')?.value || 'N/A';
                const country = document.getElementById('card-country-input')?.value || 'N/A';

                latestOrderDetails = `Service: ${cardTypeName} Order\nBalance: $${balance}\nFee: $${fee.toFixed(2)}\nRegion: ${region}\nDelivery: ${deliveryMethod}\nEmail: ${buyerEmail}\nShip Name: ${shipName}\nCountry: ${country}`;

                // Hide card modal
                cardOrderModal.classList.remove('active');

                // Set the payment modal value to ONLY the processing fee
                document.getElementById('modal-pay-amount').textContent = `$${fee.toFixed(2)}`;

                // Update modal subtitle
                const modalSubtitle = document.getElementById('payment-modal-subtitle');
                if (modalSubtitle) modalSubtitle.textContent = `Pay the processing fee for your ${cardTypeName} order in crypto.`;

                // Show the universal crypto payment modal
                const usdtModal = document.getElementById('usdt-modal');
                if (usdtModal) {
                    usdtModal.classList.add('active');
                }
            }
        });
    }

    /* =========================================
       9. GIFT CARD MODAL LOGIC
       ========================================= */
    const giftCardModal = document.getElementById('gift-card-modal');
    const btnBuyGiftCard = document.getElementById('btn-buy-giftcard');
    const closeGiftModal = document.getElementById('close-gift-modal');
    const cancelGiftModal = document.getElementById('cancel-gift-modal');
    const giftCardForm = document.getElementById('gift-card-form');
    const giftAmountInput = document.getElementById('gift-amount');
    const giftFeeDisplay = document.getElementById('gift-fee');
    const giftBrandGrid = document.getElementById('gift-brand-grid');
    const giftUsdEquivalent = document.getElementById('gift-usd-equivalent');
    const giftCurrencySymbol = document.getElementById('gift-currency-symbol');

    // Currency state: INR default
    const INR_TO_USD_RATE = 84; // 1 USD = 84 INR (approximate)
    let selectedGiftBrand = '';
    let selectedCurrency = 'INR'; // 'INR' or 'USD'

    function openGiftCardModal() {
        if (giftCardModal) {
            selectedGiftBrand = '';
            selectedCurrency = 'INR';
            if (giftCardForm) giftCardForm.reset();
            if (giftFeeDisplay) giftFeeDisplay.textContent = '$0.00';
            if (giftUsdEquivalent) giftUsdEquivalent.textContent = '';
            if (giftCurrencySymbol) giftCurrencySymbol.textContent = '₹';
            document.querySelectorAll('.gift-brand-card').forEach(c => c.classList.remove('selected'));
            // Reset currency buttons
            document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
            const inrBtn = document.getElementById('btn-inr');
            if (inrBtn) inrBtn.classList.add('active');
            giftCardModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    if (btnBuyGiftCard) btnBuyGiftCard.addEventListener('click', openGiftCardModal);

    function closeGiftCardModal() {
        if (giftCardModal) {
            giftCardModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeGiftModal) closeGiftModal.addEventListener('click', closeGiftCardModal);
    if (cancelGiftModal) cancelGiftModal.addEventListener('click', closeGiftCardModal);

    // Close on overlay click
    if (giftCardModal) {
        giftCardModal.addEventListener('click', (e) => {
            if (e.target === giftCardModal) closeGiftCardModal();
        });
    }

    // Currency toggle buttons
    const currencyBtns = document.querySelectorAll('.currency-btn');
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCurrency = btn.getAttribute('data-currency');

            // Update symbol
            if (giftCurrencySymbol) {
                giftCurrencySymbol.textContent = selectedCurrency === 'INR' ? '₹' : '$';
            }
            // Update placeholder
            if (giftAmountInput) {
                giftAmountInput.placeholder = selectedCurrency === 'INR' ? 'e.g. 5000' : 'e.g. 60';
            }
            // Recalculate fee if value exists
            recalcGiftFee();
        });
    });

    // Brand selection
    if (giftBrandGrid) {
        giftBrandGrid.querySelectorAll('.gift-brand-card').forEach(card => {
            card.addEventListener('click', () => {
                giftBrandGrid.querySelectorAll('.gift-brand-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedGiftBrand = card.getAttribute('data-brand');
            });
        });
    }

    function recalcGiftFee() {
        if (!giftAmountInput || !giftFeeDisplay) return;
        const rawAmount = parseFloat(giftAmountInput.value);
        if (!isNaN(rawAmount) && rawAmount > 0) {
            // Convert to USD if INR
            const amountUSD = selectedCurrency === 'INR' ? rawAmount / INR_TO_USD_RATE : rawAmount;
            const fee = (amountUSD / 100) * 35;
            giftFeeDisplay.textContent = `$${fee.toFixed(2)}`;
            // Show USD equivalent if INR selected
            if (giftUsdEquivalent) {
                if (selectedCurrency === 'INR') {
                    giftUsdEquivalent.textContent = `≈ $${amountUSD.toFixed(2)} USD`;
                } else {
                    giftUsdEquivalent.textContent = `≈ ₹${(rawAmount * INR_TO_USD_RATE).toFixed(0)} INR`;
                }
            }
        } else {
            giftFeeDisplay.textContent = '$0.00';
            if (giftUsdEquivalent) giftUsdEquivalent.textContent = '';
        }
    }

    if (giftAmountInput) {
        giftAmountInput.addEventListener('input', recalcGiftFee);
    }

    // Form submit → proceed to crypto payment modal
    if (giftCardForm) {
        giftCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!selectedGiftBrand) {
                alert('Please select a gift card brand first.');
                return;
            }
            const rawAmount = parseFloat(giftAmountInput.value);
            if (!isNaN(rawAmount) && rawAmount > 0) {
                const amountUSD = selectedCurrency === 'INR' ? rawAmount / INR_TO_USD_RATE : rawAmount;
                const fee = (amountUSD / 100) * 35;
                const recipientEmail = document.getElementById('gift-email')?.value || 'N/A';

                latestOrderDetails = `Service: Digital Gift Card\nBrand: ${selectedGiftBrand}\nAmount: ${rawAmount} ${selectedCurrency}\nFee (USD): $${fee.toFixed(2)}\nRecipient Email: ${recipientEmail}`;

                closeGiftCardModal();
                // Show amount in universal payment modal
                const payAmountEl = document.getElementById('modal-pay-amount');
                if (payAmountEl) payAmountEl.textContent = `$${fee.toFixed(2)}`;
                // Update modal subtitle
                const modalSubtitle = document.getElementById('payment-modal-subtitle');
                if (modalSubtitle) modalSubtitle.textContent = `Pay the processing fee for your ${selectedGiftBrand} gift card in crypto.`;
                const usdtModal = document.getElementById('usdt-modal');
                if (usdtModal) {
                    usdtModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }


    /* =========================================
       9B. WHITE CLONE CARD MODAL LOGIC
       ========================================= */
    const cloneCardModal = document.getElementById('clone-card-modal');
    const btnBuyClone = document.getElementById('btn-buy-clone');
    const closeCloneModal = document.getElementById('close-clone-modal');
    const cancelCloneModal = document.getElementById('cancel-clone-modal');
    const cloneCardForm = document.getElementById('clone-card-form');
    const cloneBalanceInput = document.getElementById('clone-balance-input');
    const cloneCalculatedPrice = document.getElementById('clone-calculated-price');
    const clonePreviewBalance = document.getElementById('clone-preview-balance');

    // PRICE RATE: $70 per $200 balance = $0.35 per $1
    const CLONE_RATE = 0.35;
    const CLONE_MIN_BALANCE = 100;

    function openCloneModal() {
        if (cloneCardModal) {
            if (cloneCardForm) cloneCardForm.reset();
            if (cloneCalculatedPrice) cloneCalculatedPrice.textContent = '$0.00';
            if (clonePreviewBalance) clonePreviewBalance.textContent = '—';
            cloneCardModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCloneCardModal() {
        if (cloneCardModal) {
            cloneCardModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (btnBuyClone) btnBuyClone.addEventListener('click', openCloneModal);
    if (closeCloneModal) closeCloneModal.addEventListener('click', closeCloneCardModal);
    if (cancelCloneModal) cancelCloneModal.addEventListener('click', closeCloneCardModal);

    // Close on overlay click
    if (cloneCardModal) {
        cloneCardModal.addEventListener('click', (e) => {
            if (e.target === cloneCardModal) closeCloneCardModal();
        });
    }

    // Live price calculator
    if (cloneBalanceInput) {
        cloneBalanceInput.addEventListener('input', () => {
            const balance = parseFloat(cloneBalanceInput.value);
            if (!isNaN(balance) && balance >= CLONE_MIN_BALANCE) {
                const price = balance * CLONE_RATE;
                if (cloneCalculatedPrice) cloneCalculatedPrice.textContent = `$${price.toFixed(2)}`;
                if (clonePreviewBalance) clonePreviewBalance.textContent = `$${balance.toFixed(2)}`;
            } else {
                if (cloneCalculatedPrice) cloneCalculatedPrice.textContent = '$0.00';
                if (clonePreviewBalance) clonePreviewBalance.textContent = '—';
            }
        });
    }

    // Form submit → open universal crypto payment modal
    if (cloneCardForm) {
        cloneCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const balance = parseFloat(cloneBalanceInput.value);
            if (isNaN(balance) || balance < CLONE_MIN_BALANCE) {
                cloneBalanceInput.style.borderColor = '#ef4444';
                cloneBalanceInput.classList.add('shake-err');
                cloneBalanceInput.addEventListener('animationend', () => {
                    cloneBalanceInput.classList.remove('shake-err');
                }, { once: true });
                setTimeout(() => { cloneBalanceInput.style.borderColor = ''; }, 2000);
                return;
            }
            const price = balance * CLONE_RATE;

            latestOrderDetails = `Service: White Clone Card\nBalance: $${balance}\nPrice: $${price.toFixed(2)}`;

            // Close clone modal
            closeCloneCardModal();

            // Set amount in universal payment modal
            const payAmountEl = document.getElementById('modal-pay-amount');
            if (payAmountEl) payAmountEl.textContent = `$${price.toFixed(2)}`;

            // Update subtitle
            const modalSubtitle = document.getElementById('payment-modal-subtitle');
            if (modalSubtitle) modalSubtitle.textContent = `Pay for your White Clone Card with $${balance.toFixed(0)} balance in crypto.`;

            // Show universal crypto modal
            const usdtModal = document.getElementById('usdt-modal');
            if (usdtModal) {
                usdtModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    /* =========================================
       9C. PREMIUM CARDS MODAL LOGIC
       ========================================= */
    const premiumModal = document.getElementById('premium-card-modal');
    const btnBuyPremium = document.getElementById('btn-buy-premium');
    const closePremiumModal = document.getElementById('close-premium-modal');
    const cancelPremiumModal = document.getElementById('cancel-premium-modal');
    const premiumOrderForm = document.getElementById('premium-order-form');
    const premLimitInput = document.getElementById('prem-limit');
    const premFeeDisplay = document.getElementById('prem-fee');

    // PREMIUM FEE: $299 PER $1,000 OF LIMIT
    const PREMIUM_FEE_PER_1K = 299;

    function openPremiumModal() {
        if (premiumModal) {
            if (premiumOrderForm) premiumOrderForm.reset();
            if (premFeeDisplay) premFeeDisplay.textContent = '$0.00';
            premiumModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closePremiumCardModal() {
        if (premiumModal) {
            premiumModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (btnBuyPremium) btnBuyPremium.addEventListener('click', openPremiumModal);
    if (closePremiumModal) closePremiumModal.addEventListener('click', closePremiumCardModal);
    if (cancelPremiumModal) cancelPremiumModal.addEventListener('click', closePremiumCardModal);

    if (premiumModal) {
        premiumModal.addEventListener('click', (e) => {
            if (e.target === premiumModal) closePremiumCardModal();
        });
    }

    // Dynamic Premium Card Preview Update
    const premBrandSelect = document.getElementById('prem-brand');
    const premPreviewType = document.getElementById('prem-preview-type');
    const premPreviewIcon = document.getElementById('prem-preview-icon');

    if (premBrandSelect && premPreviewType && premPreviewIcon) {
        premBrandSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            premPreviewType.textContent = val.toUpperCase();
            
            let iconClass = 'fa-solid fa-credit-card';
            if (val.includes('Amex')) iconClass = 'fa-brands fa-cc-amex';
            
            premPreviewIcon.className = `${iconClass}`;
            premPreviewIcon.style.color = '#ffd700';
            premPreviewIcon.style.opacity = '0.9';
        });
    }

    // Live Fee Calculator
    if (premLimitInput) {
        premLimitInput.addEventListener('input', () => {
            const limit = parseFloat(premLimitInput.value);
            if (!isNaN(limit) && limit >= 10000) {
                const fee = (limit / 1000) * PREMIUM_FEE_PER_1K;
                if (premFeeDisplay) premFeeDisplay.textContent = `$${fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else {
                if (premFeeDisplay) premFeeDisplay.textContent = '$0.00';
            }
        });
    }

    // Form Subject -> Proceed to Crypto
    if (premiumOrderForm) {
        premiumOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const limit = parseFloat(premLimitInput.value);
            if (isNaN(limit) || limit < 10000) {
                premLimitInput.style.borderColor = '#ef4444';
                setTimeout(() => { premLimitInput.style.borderColor = ''; }, 2000);
                return;
            }

            const fee = (limit / 1000) * PREMIUM_FEE_PER_1K;
            const contact = document.getElementById('prem-contact').value || 'N/A';
            const brand = document.getElementById('prem-brand').value || 'N/A';

            latestOrderDetails = `Service: Premium Tier Card\nBank/Brand: ${brand}\nRequested Limit: $${limit.toLocaleString()}\nFees / Price: $${fee.toLocaleString()}\nContact: ${contact}`;

            closePremiumCardModal();

            // Set amount in universal payment modal
            const payAmountEl = document.getElementById('modal-pay-amount');
            if (payAmountEl) payAmountEl.textContent = `$${fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const modalSubtitle = document.getElementById('payment-modal-subtitle');
            if (modalSubtitle) modalSubtitle.textContent = `Pay the price for your $${limit.toLocaleString()} limit ${brand}.`;

            const usdtModal = document.getElementById('usdt-modal');
            if (usdtModal) {
                usdtModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    /* =========================================
       10. COURSE PURCHASE MODAL — Multi-Step Logic
       ========================================= */

    // --- Crypto Data (reuse same wallets as universal modal) ---
    const courseCryptoData = {
        'btc': {
            label: 'Send Bitcoin To:',
            img: 'btc.jpeg',
            address: 'bc1qf8en7zlwm7t4wxq9y6e4mv0rslq7ray3v2k3wk'
        },
        'sol': {
            label: 'Send Solana To:',
            img: 'solana.jpeg',
            address: 'CYJec2JtKmA9cfa8gNPNTU9JXkLRo4qMMBzwvV5WNA2Q'
        },
        'usdt-trc20': {
            label: 'Send USDT (TRC20) To:',
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

    const coursePurchaseModal = document.getElementById('course-purchase-modal');
    const closeCourseModalBtn = document.getElementById('close-course-modal');
    const cancelCourseModal = document.getElementById('cancel-course-modal');
    const courseBackToDetails = document.getElementById('course-back-to-details');
    const courseStep1 = document.getElementById('course-step-1-content');
    const courseStep2 = document.getElementById('course-step-2-content');
    const csiStep1 = document.getElementById('csi-step-1');
    const csiStep2 = document.getElementById('csi-step-2');
    const csiLine = document.querySelector('.csi-line');
    const coursePurchaseForm = document.getElementById('course-purchase-form');
    const courseCryptoTabs = document.querySelectorAll('.cct-tab');
    const coursePaymentQr = document.getElementById('course-payment-qr');
    const coursePayNetworkLabel = document.getElementById('course-pay-network-label');
    const courseMerchantWallet = document.getElementById('course-merchant-wallet');
    const courseCopyBtn = document.getElementById('course-btn-copy-wallet');
    const courseConfirmPayBtn = document.getElementById('course-btn-confirm-pay');
    const coursePayAmountDisplay = document.getElementById('course-pay-amount-display');
    const courseStudentSummaryEl = document.getElementById('course-summary-text');

    let currentCoursePrice = '$499';

    // Expose global openCourseModal function (called from inline onclick in HTML)
    window.openCourseModal = function (courseName, coursePrice) {
        if (!coursePurchaseModal) return;

        // Store price
        currentCoursePrice = coursePrice || '$499';

        // Update header
        const nameEl = document.getElementById('course-modal-name');
        const priceEl = document.getElementById('course-modal-price');
        const iconEl = document.getElementById('course-modal-icon');

        if (nameEl) nameEl.textContent = courseName || 'Course';
        if (priceEl) priceEl.textContent = currentCoursePrice;

        // Switch icon based on course
        if (iconEl) {
            if (courseName && courseName.toLowerCase().includes('usdt')) {
                iconEl.innerHTML = '<i class="fa-solid fa-coins"></i>';
            } else if (courseName && courseName.toLowerCase().includes('carding')) {
                iconEl.innerHTML = '<i class="fa-solid fa-credit-card"></i>';
            } else if (courseName && courseName.toLowerCase().includes('black')) {
                iconEl.innerHTML = '<i class="fa-solid fa-skull-crossbones"></i>';
            } else {
                iconEl.innerHTML = '<i class="fa-solid fa-bolt-lightning"></i>';
            }
        }

        // Reset to step 1
        goToStep1();

        // Reset form
        if (coursePurchaseForm) coursePurchaseForm.reset();

        // Open modal
        coursePurchaseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function goToStep1() {
        courseStep1.style.display = 'block';
        courseStep2.style.display = 'none';
        csiStep1.classList.add('active');
        csiStep1.classList.remove('completed');
        csiStep2.classList.remove('active');
        if (csiLine) csiLine.classList.remove('filled');
    }

    function goToStep2() {
        // Populate summary badge
        const name = document.getElementById('course-student-name').value.trim();
        const email = document.getElementById('course-gmail').value.trim();
        const contact = document.getElementById('course-contact').value.trim();

        if (courseStudentSummaryEl) {
            courseStudentSummaryEl.textContent = `${name}  •  ${email}  •  ${contact}`;
        }

        // Update pay amount display
        if (coursePayAmountDisplay) coursePayAmountDisplay.textContent = currentCoursePrice;

        // Reset to BTC tab
        courseCryptoTabs.forEach(t => t.classList.remove('active'));
        const btcTab = document.querySelector('.cct-tab[data-cnet="btc"]');
        if (btcTab) btcTab.classList.add('active');
        updateCoursePaymentTab('btc');

        // Step indicator transition
        courseStep1.style.display = 'none';
        courseStep2.style.display = 'block';
        csiStep1.classList.remove('active');
        csiStep1.classList.add('completed');
        // swap step-1 icon to checkmark
        const step1Num = csiStep1.querySelector('.csi-num');
        if (step1Num) step1Num.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.65rem;"></i>';
        csiStep2.classList.add('active');
        if (csiLine) csiLine.classList.add('filled');
    }

    function updateCoursePaymentTab(network) {
        const data = courseCryptoData[network];
        if (!data) return;
        if (coursePaymentQr) coursePaymentQr.src = data.img;
        if (coursePayNetworkLabel) coursePayNetworkLabel.textContent = data.label;
        if (courseMerchantWallet) courseMerchantWallet.value = data.address;
    }

    // Crypto tab switching
    courseCryptoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            courseCryptoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateCoursePaymentTab(tab.getAttribute('data-cnet'));
        });
    });

    // Wallet copy button
    if (courseCopyBtn) {
        courseCopyBtn.addEventListener('click', () => {
            if (!courseMerchantWallet) return;
            navigator.clipboard.writeText(courseMerchantWallet.value).then(() => {
                courseCopyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                courseCopyBtn.style.color = '#10b981';
                courseCopyBtn.style.borderColor = '#10b981';
                setTimeout(() => {
                    courseCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                    courseCopyBtn.style.color = '';
                    courseCopyBtn.style.borderColor = '';
                }, 2000);
            }).catch(() => {
                // Fallback
                courseMerchantWallet.select();
                document.execCommand('copy');
            });
        });
    }

    // Form submission → go to Step 2
    if (coursePurchaseForm) {
        coursePurchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('course-student-name');
            const emailInput = document.getElementById('course-gmail');
            const contactInput = document.getElementById('course-contact');

            let valid = true;

            [nameInput, emailInput, contactInput].forEach(inp => {
                if (inp && !inp.value.trim()) {
                    inp.classList.add('shake-err');
                    inp.style.borderColor = '#ef4444';
                    inp.addEventListener('animationend', () => inp.classList.remove('shake-err'), { once: true });
                    valid = false;
                } else if (inp) {
                    inp.style.borderColor = '';
                }
            });

            // Basic email check
            if (emailInput && emailInput.value.trim() && !emailInput.value.includes('@')) {
                emailInput.classList.add('shake-err');
                emailInput.style.borderColor = '#ef4444';
                emailInput.addEventListener('animationend', () => emailInput.classList.remove('shake-err'), { once: true });
                valid = false;
            }

            if (valid) goToStep2();
        });
    }

    // Back to Details
    if (courseBackToDetails) {
        courseBackToDetails.addEventListener('click', () => {
            courseStep2.style.display = 'none';
            courseStep1.style.display = 'block';
            csiStep2.classList.remove('active');
            csiStep1.classList.remove('completed');
            csiStep1.classList.add('active');
            const step1Num = csiStep1.querySelector('.csi-num');
            if (step1Num) step1Num.innerHTML = '1';
            if (csiLine) csiLine.classList.remove('filled');
        });
    }

    // Confirm payment
    if (courseConfirmPayBtn) {
        courseConfirmPayBtn.addEventListener('click', () => {
            courseConfirmPayBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Confirming...';
            courseConfirmPayBtn.disabled = true;
            setTimeout(() => {
                // Close modal
                coursePurchaseModal.classList.remove('active');
                document.body.style.overflow = '';
                // Reset for next time
                if (coursePurchaseForm) coursePurchaseForm.reset();
                const step1Num = csiStep1.querySelector('.csi-num');
                if (step1Num) step1Num.innerHTML = '1';
                courseConfirmPayBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> I\'ve Made the Payment';
                courseConfirmPayBtn.disabled = false;

                const cName = document.getElementById('course-student-name')?.value || 'N/A';
                const cEmail = document.getElementById('course-gmail')?.value || 'N/A';
                const cContact = document.getElementById('course-contact')?.value || 'N/A';
                const courseTitle = document.getElementById('course-modal-name')?.textContent || 'Course';

                latestOrderDetails = `Service: Course Purchase\nCourse: ${courseTitle}\nName: ${cName}\nEmail: ${cEmail}\nContact: ${cContact}`;

                const subject = "New Course Payment Confirmation";
                const body = `I have completed payment for my course. Here are my details:\n\n${latestOrderDetails}`;

                // Send data to Google Sheets
                sendToGoogleSheets(latestOrderDetails);

                // Use FormSubmit AJAX for silent submission
                fetch("https://formsubmit.co/ajax/roshansha2005@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: subject,
                        Order_Details: body,
                        _template: "box",
                        _captcha: "false"
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        alert('🎉 Payment noted! Your confirmation details have been securely sent to our team.');
                    })
                    .catch(error => {
                        alert("🎉 Payment noted! But there was a slight issue sending the email. Please contact support.");
                    });
            }, 2000);
        });
    }

    // Close modal (X button, cancel button)
    function closeCourseModal() {
        if (coursePurchaseModal) {
            coursePurchaseModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => goToStep1(), 400);
        }
    }

    if (closeCourseModalBtn) closeCourseModalBtn.addEventListener('click', closeCourseModal);
    if (cancelCourseModal) cancelCourseModal.addEventListener('click', closeCourseModal);

    // Close on backdrop click
    if (coursePurchaseModal) {
        coursePurchaseModal.addEventListener('click', (e) => {
            if (e.target === coursePurchaseModal) closeCourseModal();
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
