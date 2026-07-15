document.addEventListener('DOMContentLoaded', () => {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const mainCard = document.getElementById('main-card');
    const heroImg = document.getElementById('cat-hero-img');
    const questionText = document.getElementById('main-question');
    const subtitleText = document.getElementById('main-subtitle');
    const buttonsContainer = document.querySelector('.buttons-container');
    const celebrationContainer = document.getElementById('celebration-container');

    let hasMoved = false;

    // Runaway function for "No" button
    function runaway(event) {
        if (!hasMoved) {
            // First time it's hovered, change to fixed position at current spot first
            const rect = btnNo.getBoundingClientRect();
            
            // Append to body to bypass the card's transform/backdrop-filter containment context
            document.body.appendChild(btnNo);
            
            btnNo.style.position = 'fixed';
            btnNo.style.left = `${rect.left}px`;
            btnNo.style.top = `${rect.top}px`;
            btnNo.style.margin = '0';
            
            // Temporarily disable transition so it doesn't animate from auto to its first coords
            const originalTransition = window.getComputedStyle(btnNo).transition;
            btnNo.style.transition = 'none';
            
            // Force browser layout reflow
            btnNo.offsetHeight;
            
            hasMoved = true;
            
            // Restore transition in the next tick
            setTimeout(() => {
                btnNo.style.transition = '';
            }, 50);
        }

        const buttonWidth = btnNo.offsetWidth;
        const buttonHeight = btnNo.offsetHeight;

        // Viewport dimensions
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Safe margins
        const margin = 30;

        // Get current cursor coordinates if available
        let cursorX = event.clientX;
        let cursorY = event.clientY;

        // If it's a touch event
        if (event.touches && event.touches.length > 0) {
            cursorX = event.touches[0].clientX;
            cursorY = event.touches[0].clientY;
        }

        let newLeft, newTop;
        let attempts = 0;
        const minDistance = 150; // Keep at least 150px away from cursor

        do {
            newLeft = Math.random() * (vw - buttonWidth - margin * 2) + margin;
            newTop = Math.random() * (vh - buttonHeight - margin * 2) + margin;
            attempts++;
            
            // Calculate distance to cursor if cursor coordinates exist
            if (cursorX !== undefined && cursorY !== undefined) {
                const dx = newLeft + buttonWidth / 2 - cursorX;
                const dy = newTop + buttonHeight / 2 - cursorY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > minDistance) break;
            } else {
                break;
            }
        } while (attempts < 20);

        btnNo.style.left = `${newLeft}px`;
        btnNo.style.top = `${newTop}px`;
    }

    // Attach runaway triggers
    btnNo.addEventListener('mouseover', runaway);
    btnNo.addEventListener('mouseenter', runaway);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click triggering on mobile immediately
        runaway(e);
    });

    // List of cat dancing images and animation styles
    const catImages = [
        'assets/cat_dance_1.png',
        'assets/cat_dance_2.png',
        'assets/cat_dance_3.png'
    ];

    const danceClasses = [
        'dance-bob',
        'dance-spin',
        'dance-bounce',
        'dance-shake'
    ];

    const meowTexts = [
        'Meo meo! 🐾',
        'Ngoào ~ 🐱',
        'Purr purr... 💞',
        'Yêu Sen nhất! 🥰',
        'Mew! 🌟',
        'Ngoaooo! 🎉'
    ];

    // Create heart particle
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        heart.innerHTML = '❤️';
        
        const startX = Math.random() * window.innerWidth;
        heart.style.left = `${startX}px`;
        
        const drift = (Math.random() - 0.5) * 200; // Left-right drift
        const scale = 0.5 + Math.random() * 1.5;
        const rotation = (Math.random() - 0.5) * 90;
        
        heart.style.setProperty('--drift', `${drift}px`);
        heart.style.setProperty('--scale', scale);
        heart.style.setProperty('--rotation', `${rotation}deg`);
        
        // Randomize float speed
        const duration = 2 + Math.random() * 3;
        heart.style.animationDuration = `${duration}s`;
        
        celebrationContainer.appendChild(heart);
        
        // Clean up
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Create confetti particle
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-particle');
        
        // Random color
        const colors = ['#ff758f', '#ff8fa3', '#ffb3c1', '#f0e6ff', '#b3c5ff', '#ffecd2', '#c1f0ff'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = `${startX}px`;
        
        const drift = (Math.random() - 0.5) * 300;
        confetti.style.setProperty('--drift', `${drift}px`);
        
        // Randomize shape (square vs circle)
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        const size = 5 + Math.random() * 10;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        const duration = 3 + Math.random() * 3;
        confetti.style.animationDuration = `${duration}s`;
        
        celebrationContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }

    // Spawn a dancing cat
    function spawnDancingCat() {
        const cat = document.createElement('div');
        cat.classList.add('dancing-cat');
        
        const img = document.createElement('img');
        img.src = catImages[Math.floor(Math.random() * catImages.length)];
        
        const size = 80 + Math.random() * 80; // 80px to 160px
        img.style.width = `${size}px`;
        img.style.height = 'auto';
        img.style.borderRadius = '16px';
        
        cat.appendChild(img);
        
        // Add random animation class
        const danceClass = danceClasses[Math.floor(Math.random() * danceClasses.length)];
        cat.classList.add(danceClass);
        
        // Random duration and delay
        const duration = 1 + Math.random() * 2;
        cat.style.animationDuration = `${duration}s`;
        cat.style.animationDelay = `${Math.random() * 0.5}s`;
        
        // Random viewport position (avoiding the central card area ideally, but anywhere is fine for full chaos!)
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        const posX = Math.random() * (vw - size);
        const posY = Math.random() * (vh - size);
        
        cat.style.left = `${posX}px`;
        cat.style.top = `${posY}px`;
        
        // Interactivity: clicking a cat shows a meow bubble and makes it bounce!
        cat.addEventListener('click', (e) => {
            showMeowBubble(e.clientX, e.clientY);
            
            // Extra rotation bounce
            cat.style.transform = 'scale(1.3) rotate(15deg)';
            setTimeout(() => {
                cat.style.transform = '';
            }, 300);
        });
        
        celebrationContainer.appendChild(cat);
    }

    // Show a floating meow speech bubble
    function showMeowBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.style.position = 'fixed';
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y - 30}px`;
        bubble.style.background = 'white';
        bubble.style.color = '#ff4d6d';
        bubble.style.padding = '6px 12px';
        bubble.style.borderRadius = '20px';
        bubble.style.fontSize = '0.9rem';
        bubble.style.fontWeight = 'bold';
        bubble.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '100';
        bubble.style.transform = 'translate(-50%, -50%) scale(0)';
        bubble.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        bubble.innerText = meowTexts[Math.floor(Math.random() * meowTexts.length)];
        document.body.appendChild(bubble);
        
        // Trigger show animation
        setTimeout(() => {
            bubble.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Float up and disappear
        setTimeout(() => {
            bubble.style.transform = 'translate(-50%, -80px) scale(0)';
            bubble.style.opacity = '0';
            setTimeout(() => bubble.remove(), 300);
        }, 1500);
    }

    // Handle YES button click
    btnYes.addEventListener('click', () => {
        // Change UI state to celebrating
        mainCard.classList.add('celebrating');
        heroImg.src = 'assets/cat_dance_1.png';
        questionText.innerHTML = 'Mình biết ngay mà! 🥰';
        subtitleText.innerHTML = 'Cảm ơn bạn đã yêu thương loài mèo! 💖';
        
        // Hide button container
        buttonsContainer.style.opacity = '0';
        setTimeout(() => {
            buttonsContainer.style.display = 'none';
        }, 300);
        
        // Hide the escaping button in case it is still around
        btnNo.style.display = 'none';

        // Trigger heavy burst of hearts and confetti
        for (let i = 0; i < 40; i++) {
            setTimeout(createHeart, Math.random() * 800);
            setTimeout(createConfetti, Math.random() * 800);
        }

        // Spawn dancing cats
        const catCount = 12;
        for (let i = 0; i < catCount; i++) {
            setTimeout(spawnDancingCat, i * 150);
        }

        // Continuous light spawning in background
        setInterval(createHeart, 300);
        setInterval(createConfetti, 400);
        
        // Occasionally spawn extra dancing cats to keep the energy high
        setInterval(() => {
            const currentCats = document.querySelectorAll('.dancing-cat');
            if (currentCats.length < 20) {
                spawnDancingCat();
            }
        }, 3000);
    });
});
