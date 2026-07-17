script_js = '''// ============================================
// NAJOTI ZAMONA - Main JavaScript
// ============================================

// Global State
const state = {
    isPlaying: false,
    currentTrack: 0,
    volume: 0.7,
    isMinimized: false,
    userInteracted: false,
    currentSlide: 0,
    totalSlides: 3,
    animationSpeed: 1,
    particleCount: 1000,
    theme: 'dark'
};

// Demo Playlist
const playlist = [
    { title: 'Cyberpunk Dreams', artist: 'Najoti Zamona', duration: '3:45', src: 'music/track1.mp3' },
    { title: 'Neon Nights', artist: 'Najoti Zamona', duration: '4:12', src: 'music/track2.mp3' },
    { title: 'Digital Horizon', artist: 'Najoti Zamona', duration: '3:28', src: 'music/track3.mp3' },
    { title: 'Future Bass', artist: 'Najoti Zamona', duration: '3:56', src: 'music/track4.mp3' },
    { title: 'Glass City', artist: 'Najoti Zamona', duration: '4:30', src: 'music/track5.mp3' }
];

// Audio Context for equalizer
let audioContext = null;
let analyser = null;
let dataArray = null;
let source = null;
let audioElement = null;

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 800);
        }
        initApp();
    }, 2200);
});

// ============================================
// INITIALIZATION
// ============================================
function initApp() {
    initLenis();
    initGSAP();
    initThreeJS();
    initCursor();
    initClock();
    initWeather();
    initMusicPlayer();
    initSlider();
    initScrollEffects();
    initTypingEffect();
    initCounters();
    initTiltCards();
    showNotification('Welcome to Najoti Zamona!', 'Experience the future of digital design.', 'info');
    setTimeout(() => showAnnouncement(), 3000);
}

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
}

// ============================================
// GSAP ANIMATIONS
// ============================================
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Navigation scroll effect
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '#navbar' }
    });

    // Hero animations
    gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1.2, delay: 0.5, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-typing', { opacity: 0, y: 20, duration: 0.8, delay: 1.1, ease: 'power3.out' });
    gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 1, delay: 1.4, ease: 'power3.out' });
    gsap.from('.scroll-indicator', { opacity: 0, duration: 1, delay: 2, ease: 'power3.out' });

    // Section reveal animations
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.about-grid, .features-grid, .gallery-grid, .video-container, .faq-container, .contact-grid, .slider-container');

        if (header) {
            gsap.from(header, {
                scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
            });
        }
        if (content) {
            gsap.from(content.children, {
                scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
                opacity: 0, y: 50, stagger: 0.1, duration: 0.8, ease: 'power3.out'
            });
        }
    });

    // Parallax effect for floating cards
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.float-card');
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        cards.forEach((card, i) => {
            const speed = (i + 1) * 0.5;
            gsap.to(card, { x: x * speed, y: y * speed, duration: 1, ease: 'power2.out' });
        });
    });
}

// ============================================
// THREE.JS 3D BACKGROUND
// ============================================
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Particles
    const particleCount = state.particleCount;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color(0x00f0ff),
        new THREE.Color(0xbf00ff),
        new THREE.Color(0xff00aa),
        new THREE.Color(0x00ffff)
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating spheres
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const spheres = [];
    for (let i = 0; i < 8; i++) {
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: colorPalette[i % colorPalette.length],
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        sphere.userData = {
            speedX: (Math.random() - 0.5) * 0.01,
            speedY: (Math.random() - 0.5) * 0.01,
            speedZ: (Math.random() - 0.5) * 0.01,
            originalPos: sphere.position.clone()
        };
        scene.add(sphere);
        spheres.push(sphere);
    }

    camera.position.z = 15;

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001 * state.animationSpeed;

        // Rotate particles
        particles.rotation.y += 0.0005 * state.animationSpeed;
        particles.rotation.x += 0.0002 * state.animationSpeed;

        // Update particle positions with wave effect
        const posArray = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            posArray[i3 + 1] += Math.sin(time * 2 + i * 0.1) * 0.002;
        }
        geometry.attributes.position.needsUpdate = true;

        // Animate spheres
        spheres.forEach(sphere => {
            sphere.rotation.x += sphere.userData.speedX * state.animationSpeed;
            sphere.rotation.y += sphere.userData.speedY * state.animationSpeed;
            sphere.rotation.z += sphere.userData.speedZ * state.animationSpeed;
            sphere.position.y = sphere.userData.originalPos.y + Math.sin(time * 3 + sphere.position.x) * 2;
        });

        // Camera movement based on mouse
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        followerX += (cursorX - followerX) * 0.15;
        followerY += (cursorY - followerY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .gallery-item, .faq-question, .slider-nav, .music-btn, .music-play-btn, .music-nav-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// ============================================
// CLOCK WIDGET
// ============================================
function initClock() {
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const clockTime = document.getElementById('clockTime');
        const clockDate = document.getElementById('clockDate');
        if (clockTime) clockTime.textContent = timeStr;
        if (clockDate) clockDate.textContent = dateStr;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================
// WEATHER WIDGET
// ============================================
function initWeather() {
    if (!navigator.geolocation) {
        document.getElementById('weatherDesc').textContent = 'Location unavailable';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(lat, lon);
        },
        () => {
            // Fallback: Dushanbe, Tajikistan
            fetchWeather(38.5598, 68.7870);
        }
    );
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
        const data = await response.json();

        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const weatherMap = {
            0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Depositing Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
            55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
            71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 95: 'Thunderstorm'
        };
        const desc = weatherMap[code] || 'Unknown';

        const iconMap = {
            0: 'fa-sun', 1: 'fa-cloud-sun', 2: 'fa-cloud-sun', 3: 'fa-cloud',
            45: 'fa-smog', 48: 'fa-smog', 51: 'fa-cloud-rain', 53: 'fa-cloud-rain',
            55: 'fa-cloud-showers-heavy', 61: 'fa-cloud-rain', 63: 'fa-cloud-rain',
            65: 'fa-cloud-showers-heavy', 71: 'fa-snowflake', 73: 'fa-snowflake',
            75: 'fa-snowflake', 95: 'fa-bolt'
        };
        const iconClass = iconMap[code] || 'fa-cloud';

        document.getElementById('weatherTemp').textContent = temp + 'C';
        document.getElementById('weatherDesc').textContent = desc;
        document.getElementById('weatherIcon').innerHTML = `<i class="fas ${iconClass}"></i>`;
    } catch (e) {
        document.getElementById('weatherDesc').textContent = 'Weather unavailable';
    }
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
    const textElement = document.getElementById('typingText');
    if (!textElement) return;

    const phrases = [
        'Innovation Meets Art',
        'Future is Now',
        'Digital Excellence',
        'Beyond Imagination'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        const cursor = '<span class="cursor-blink">|</span>';

        if (isDeleting) {
            textElement.innerHTML = currentPhrase.substring(0, charIndex - 1) + cursor;
            charIndex--;
        } else {
            textElement.innerHTML = currentPhrase.substring(0, charIndex + 1) + cursor;
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

// ============================================
// ANIMATED COUNTERS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easeProgress * target);
            counter.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => requestAnimationFrame(updateCounter),
            once: true
        });
    });
}

// ============================================
// 3D TILT CARDS
// ============================================
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        const inner = card.querySelector('.tilt-card-inner');
        if (!inner) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ============================================
// MUSIC PLAYER
// ============================================
function initMusicPlayer() {
    audioElement = new Audio();
    audioElement.crossOrigin = 'anonymous';
    audioElement.volume = state.volume;

    // Build equalizer bars
    const eqContainer = document.getElementById('equalizer');
    if (eqContainer) {
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'eq-bar';
            bar.style.height = '4px';
            eqContainer.appendChild(bar);
        }
    }

    // Build playlist
    const playlistContainer = document.getElementById('musicPlaylist');
    if (playlistContainer) {
        playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item' + (index === 0 ? ' active' : '');
            item.innerHTML = `<span class="pl-number">${index + 1}</span><span class="pl-title">${track.title}</span><span class="pl-duration">${track.duration}</span>`;
            item.onclick = () => loadTrack(index);
            playlistContainer.appendChild(item);
        });
    }

    // Load first track info
    updateTrackInfo(0);

    // Audio events
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', nextTrack);
    audioElement.addEventListener('loadedmetadata', () => {
        document.getElementById('totalTime').textContent = formatTime(audioElement.duration);
    });

    // Equalizer animation
    animateEqualizer();
}

function loadTrack(index) {
    state.currentTrack = index;
    updateTrackInfo(index);

    // Update playlist active state
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Note: In production, actual audio files would be loaded here
    // For demo, we simulate the audio behavior
    if (state.isPlaying) {
        // Would load and play actual audio file
    }
}

function updateTrackInfo(index) {
    const track = playlist[index];
    const trackName = document.getElementById('musicTrackName');
    const artist = document.getElementById('musicArtist');
    if (trackName) trackName.textContent = track.title;
    if (artist) artist.textContent = track.artist;
}

function togglePlay() {
    state.userInteracted = true;
    const playBtn = document.getElementById('playBtn');
    const icon = playBtn.querySelector('i');

    if (state.isPlaying) {
        state.isPlaying = false;
        icon.className = 'fas fa-play';
        if (audioElement) audioElement.pause();
        showNotification('Music Paused', 'Playback paused', 'info');
    } else {
        state.isPlaying = true;
        icon.className = 'fas fa-pause';
        // In production: audioElement.play();
        showNotification('Now Playing', playlist[state.currentTrack].title, 'info');
    }
}

function nextTrack() {
    state.currentTrack = (state.currentTrack + 1) % playlist.length;
    loadTrack(state.currentTrack);
    if (state.isPlaying) {
        showNotification('Next Track', playlist[state.currentTrack].title, 'info');
    }
}

function prevTrack() {
    state.currentTrack = (state.currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(state.currentTrack);
    if (state.isPlaying) {
        showNotification('Previous Track', playlist[state.currentTrack].title, 'info');
    }
}

function updateProgress() {
    if (!audioElement || !audioElement.duration) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    const fill = document.getElementById('progressFill');
    const currentTime = document.getElementById('currentTime');
    if (fill) fill.style.width = progress + '%';
    if (currentTime) currentTime.textContent = formatTime(audioElement.currentTime);
}

function seekMusic(e) {
    const bar = document.getElementById('progressBar');
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioElement && audioElement.duration) {
        audioElement.currentTime = percent * audioElement.duration;
    }
}

function setVolume(value) {
    state.volume = value / 100;
    if (audioElement) audioElement.volume = state.volume;
    const icon = document.getElementById('volumeIcon');
    if (icon) {
        if (value == 0) icon.className = 'fas fa-volume-mute';
        else if (value < 50) icon.className = 'fas fa-volume-down';
        else icon.className = 'fas fa-volume-up';
    }
}

function toggleMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    state.isMinimized = !state.isMinimized;
    player.classList.toggle('minimized', state.isMinimized);
}

function togglePlaylist() {
    const playlist = document.getElementById('musicPlaylist');
    if (playlist) playlist.style.display = playlist.style.display === 'none' ? 'block' : 'none';
}

function animateEqualizer() {
    const bars = document.querySelectorAll('.eq-bar');
    function update() {
        if (state.isPlaying) {
            bars.forEach(bar => {
                const height = Math.random() * 25 + 4;
                bar.style.height = height + 'px';
            });
        } else {
            bars.forEach(bar => { bar.style.height = '4px'; });
        }
        requestAnimationFrame(update);
    }
    update();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ============================================
// IMAGE SLIDER
// ============================================
function initSlider() {
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;

    for (let i = 0; i < state.totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    // Auto slide
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function goToSlide(index) {
    state.currentSlide = index;
    const wrapper = document.getElementById('sliderWrapper');
    const dots = document.querySelectorAll('.slider-dot');
    if (wrapper) wrapper.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function nextSlide() {
    goToSlide((state.currentSlide + 1) % state.totalSlides);
}

function prevSlide() {
    goToSlide((state.currentSlide - 1 + state.totalSlides) % state.totalSlides);
}

// ============================================
// LIGHTBOX
// ============================================
function openLightbox(element) {
    const img = element.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ============================================
// VIDEO PLAYER
// ============================================
function toggleVideo() {
    const video = document.getElementById('heroVideo');
    const overlay = document.getElementById('videoOverlay');
    const icon = document.getElementById('playIcon');
    if (!video) return;

    if (video.paused) {
        video.play();
        overlay.classList.add('hidden');
        icon.className = 'fas fa-pause';
    } else {
        video.pause();
        overlay.classList.remove('hidden');
        icon.className = 'fas fa-play';
    }
}

// ============================================
// FAQ ACCORDION
// ============================================
function toggleFaq(element) {
    const item = element.parentElement;
    const wasActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));

    // Toggle current
    if (!wasActive) {
        item.classList.add('active');
    }
}

// ============================================
// CONTACT FORM
// ============================================
function handleContactSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const name = formData.get('name');

    // Simulate form submission
    showNotification('Message Sent!', `Thank you ${name}, we will get back to you soon.`, 'success');
    form.reset();
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-icon ${type}">
            <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation' : 'fa-info'}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;

    container.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// ANNOUNCEMENT BAR
// ============================================
function showAnnouncement() {
    const bar = document.getElementById('announcementBar');
    if (bar) bar.classList.add('show');
}

function closeAnnouncement() {
    const bar = document.getElementById('announcementBar');
    if (bar) bar.classList.remove('show');
}

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('active');
}

// ============================================
// SCROLL TO TOP
// ============================================
function scrollToTop() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide scroll to top button
function initScrollEffects() {
    const scrollTop = document.getElementById('scrollTop');
    if (!scrollTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
}

// ============================================
// SOUND EFFECTS
// ============================================
function playSound(type) {
    // Create simple oscillator sounds
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
        case 'hover':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.02;
            oscillator.type = 'sine';
            break;
        case 'click':
            oscillator.frequency.value = 1200;
            gainNode.gain.value = 0.05;
            oscillator.type = 'square';
            break;
        case 'success':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.05;
            oscillator.type = 'sine';
            break;
    }

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
}

// Add sound effects to buttons
function initSoundEffects() {
    const buttons = document.querySelectorAll('button, .btn, a');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => playSound('hover'));
        btn.addEventListener('click', () => playSound('click'));
    });
}

// ============================================
// VISITOR COUNTER (Local Storage)
// ============================================
function initVisitorCounter() {
    let visits = parseInt(localStorage.getItem('najoti_visits') || '0');
    visits++;
    localStorage.setItem('najoti_visits', visits.toString());
    return visits;
}

// ============================================
// THEME MANAGEMENT
// ============================================
function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('najoti_theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Load saved theme
const savedTheme = localStorage.getItem('najoti_theme');
if (savedTheme) setTheme(savedTheme);

// ============================================
// ANIMATION SPEED
// ============================================
function setAnimationSpeed(speed) {
    state.animationSpeed = speed;
}

// ============================================
// PARTICLE SETTINGS
// ============================================
function setParticleCount(count) {
    state.particleCount = count;
}

// ============================================
// PAGE VISIBILITY API (pause animations when tab hidden)
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        state.animationSpeed = 0;
    } else {
        state.animationSpeed = 1;
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Space: Play/Pause music
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
    }
    // Arrow Right: Next track
    if (e.code === 'ArrowRight' && e.ctrlKey) {
        nextTrack();
    }
    // Arrow Left: Previous track
    if (e.code === 'ArrowLeft' && e.ctrlKey) {
        prevTrack();
    }
});

// ============================================
// SWIPE SUPPORT FOR MOBILE
// ============================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
let frameCount = 0;
let lastTime = performance.now();

function checkFPS() {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        // Log FPS for debugging (can be shown in admin panel)
        window.currentFPS = fps;
    }
    requestAnimationFrame(checkFPS);
}
checkFPS();

// ============================================
// PWA SERVICE WORKER REGISTRATION
// ============================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('assets/sw.js').catch(() => {
        // Service worker registration failed (expected in file:// protocol)
    });
}

// ============================================
// EXPORT FUNCTIONS FOR ADMIN PANEL
// ============================================
window.NajotiZamona = {
    state,
    playlist,
    showNotification,
    setTheme,
    toggleTheme,
    setAnimationSpeed,
    setParticleCount,
    getVisitorCount: () => parseInt(localStorage.getItem('najoti_visits') || '0'),
    getFPS: () => window.currentFPS || 60,
    updateAnnouncement: (text) => {
        const el = document.getElementById('announcementText');
        if (el) el.textContent = text;
    },
    updateTitle: (title) => { document.title = title; },
    updateLogo: (src) => {
        const logo = document.querySelector('.nav-logo');
        if (logo) logo.textContent = src;
    },
    updateBackground: (src) => {
        const bg = document.querySelector('.gradient-bg');
        if (bg) bg.style.backgroundImage = `url(${src})`;
    },
    addGalleryImage: (src, title, category) => {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = () => openLightbox(item);
        item.innerHTML = `<img src="${src}" alt="${title}"><div class="gallery-overlay"><div class="gallery-title">${title}</div><div class="gallery-category">${category}</div></div>`;
        grid.appendChild(item);
    },
    removeGalleryImage: (index) => {
        const items = document.querySelectorAll('.gallery-item');
        if (items[index]) items[index].remove();
    }
};

console.log('%c Najoti Zamona ', 'background: linear-gradient(135deg, #00f0ff, #bf00ff); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%c Premium Futuristic Experience ', 'color: #00f0ff; font-size: 14px;');
'''

with open('/mnt/agents/output/najoti-zamona/script.js', 'w', encoding='utf-8') as f:
    f.write(script_js)

print("script.js written successfully")
print(f"Length: {len(script_js)} characters")
