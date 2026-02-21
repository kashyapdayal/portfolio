// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // Initialize AOS Animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });

    // Initialize Particles.js (Deep Forest theme)
    if (document.getElementById('hero-particles')) {
        particlesJS("hero-particles", {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: "#3dffa0" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 150, color: "#3dffa0", opacity: 0.1, width: 1 },
                move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Typewriter Effect
    const roles = ["Ethical Hacker", "Penetration Tester", "CTF Player", "Security Researcher"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function type() {
        if (!typewriterElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }


    type();

    // Intersection Observer for Animations (Numbers & Progress Bars)
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Counters
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 1500; // ms
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });

                // Animate Progress Bars
                const progressFills = entry.target.querySelectorAll('.progress-fill');
                progressFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width;
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe About and Skills sections
    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');

    if (aboutSection) statsObserver.observe(aboutSection);
    if (skillsSection) statsObserver.observe(skillsSection);

    // ── Section Progress Tracker for Highlights Card ──────────────────────
    const sectionMap = {
        'about': 'hl-nav-about',
        'certifications': 'hl-nav-certs',
        'skills': 'hl-nav-skills',
        'projects': 'hl-nav-projects',
        'ctf': 'hl-nav-ctf',
        'contact': 'hl-nav-contact',
    };

    const sectionTracker = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const navId = sectionMap[entry.target.id];
            if (!navId) return;
            const navItem = document.getElementById(navId);
            if (navItem) {
                if (entry.isIntersecting) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            }
        });
    }, { threshold: 0.15 });

    Object.keys(sectionMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionTracker.observe(el);
    });

});

// ============================================================
// CTF CHALLENGE LOGIC (global scope for inline onclick access)
// ============================================================
const challenges = {
    '001': { flag: 'CTF{s0urc3_c0d3_s3cr3ts}' },
    '002': { flag: 'CTF{b4se_64_master}' },
    '003': { flag: 'CTF{caesar_cipher_win}' },
    '004': { flag: 'CTF{3x1f_m3tadata_h4ck}' },
    '005': { flag: 'CTF{packet_sniffer}' },
};

function updateSolvedCount() {
    const total = Object.keys(challenges).length;
    let solved = 0;
    Object.keys(challenges).forEach(id => {
        if (localStorage.getItem(`ctf_${id}`) === 'solved') solved++;
    });
    const el = document.getElementById('solved-count');
    if (el) el.textContent = solved;
}

function markSolved(id) {
    const card = document.getElementById(`ctf-card-${id}`);
    if (!card) return;
    card.classList.add('solved');
    // Remove existing solved badge if any
    const existing = card.querySelector('.solved-badge');
    if (existing) existing.remove();
    const badge = document.createElement('span');
    badge.className = 'solved-badge';
    badge.textContent = '✓ SOLVED';
    card.appendChild(badge);
    updateSolvedCount();
}

function submitFlag(id) {
    const input = document.getElementById(`flag-${id}`);
    const feedback = document.getElementById(`feedback-${id}`);
    if (!input || !feedback) return;

    const submitted = input.value.trim();
    const correct = challenges[id].flag;

    if (submitted === correct) {
        feedback.textContent = '✓ Correct flag! Well done, hacker.';
        feedback.className = 'ctf-feedback success';
        localStorage.setItem(`ctf_${id}`, 'solved');
        markSolved(id);

        // Confetti burst
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#3dffa0', '#00b894', '#27ae60'] });
        }
    } else {
        feedback.textContent = '✗ Incorrect. Keep trying.';
        feedback.className = 'ctf-feedback error';
        input.style.borderColor = 'var(--alert-red)';
        setTimeout(() => { input.style.borderColor = ''; }, 1000);
    }
}

// Restore solved state from localStorage on load
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(challenges).forEach(id => {
        if (localStorage.getItem(`ctf_${id}`) === 'solved') {
            markSolved(id);
        }
    });
    updateSolvedCount();
});

// ============================================================
// CONTACT FORM — EmailJS Integration
// ============================================================
// Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID
// with actual EmailJS credentials when deploying.
// emailjs.init("YOUR_PUBLIC_KEY");

function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const fb = document.getElementById('form-feedback');
    const btn = form.querySelector('button[type="submit"]');

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // If EmailJS is configured, use it:
    if (typeof emailjs !== 'undefined' && emailjs.sendForm) {
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
            .then(() => {
                fb.textContent = '✓ Message sent! I\'ll be in touch soon.';
                fb.className = 'ctf-feedback success';
                form.reset();
            })
            .catch(() => {
                fb.textContent = '✗ Something went wrong. Try emailing me directly.';
                fb.className = 'ctf-feedback error';
            })
            .finally(() => {
                btn.textContent = 'Send Message →';
                btn.disabled = false;
            });
    } else {
        // Fallback: build mailto link
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
        window.open(`mailto:kashyapdayal@email.com?subject=${subject}&body=${body}`);
        fb.textContent = '✓ Opening your email client...';
        fb.className = 'ctf-feedback success';
        btn.textContent = 'Send Message →';
        btn.disabled = false;
    }
}

// ============================================================
// COMPACT SKILLS  — animate .sb-fill bars on scroll
// ============================================================
(function () {
    const sbObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.sb-fill').forEach(el => {
                    el.style.width = el.dataset.width || '0%';
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.skills-compact-grid').forEach(el => sbObserver.observe(el));
})();

// ============================================================
// MUSIC PLAYER
// Edit the playlist array to add your tracks.
// Drop audio files → assets/music/<name>.mp3
// Drop cover art  → assets/music/<name>.jpg
// ============================================================
const playlist = [
    {
        title: 'Born To Die',
        artist: 'Lana Del Rey',
        src: 'assets/music/Lana Del Rey - Born To Die.flac',
        cover: 'assets/music/born_to_die.jpg',
        lyrics: "Feet don't fail me now\nTake me to the finish line\nOh, my heart it breaks every step that I take\nBut I'm hoping that the gates, they'll tell me that you're mine",
    },
    {
        title: 'Say Yes To Heaven',
        artist: 'Lana Del Rey',
        src: 'assets/music/Lana Del Rey - Say Yes To Heaven.flac',
        cover: 'assets/music/say_yes_to_heaven.jpg',
        lyrics: "If you dance I'll dance\nAnd if you don't I'll dance anyway\nGive peace a chance\nLet the fear you have fall away",
    },
    {
        title: 'Summertime Sadness',
        artist: 'Lana Del Rey',
        src: 'assets/music/Lana Del Rey - Summertime Sadness.flac',
        cover: 'assets/music/summertime_sadness.jpg',
        lyrics: "Kiss me hard before you go\nSummertime sadness\nI just wanted you to know\nThat baby, you the best",
    },
    {
        title: 'Young And Beautiful',
        artist: 'Lana Del Rey',
        src: 'assets/music/Lana Del Rey - Young And Beautiful.flac',
        cover: 'assets/music/young_and_beautiful.jpg',
        lyrics: "Will you still love me when I'm no longer young and beautiful?\nWill you still love me when I've got nothing but my aching soul?",
    },
    {
        title: 'Margaret',
        artist: 'Lana Del Rey, Bleachers',
        src: 'assets/music/Lana Del Rey, Bleachers - Margaret.flac',
        cover: 'assets/music/margaret.jpg',
        lyrics: "When you know, you know\nIt's kind of like the way that it is\nYou don't have to look for it",
    },
];

let mpIdx = 0;
let mpPlaying = false;
let mpPlaybackSpeed = 1.0;
const mpAudio = new Audio();

const speeds = [1.0, 1.25, 1.5, 2.0, 0.5];

function mpLoad(idx) {
    // Stop current playback to prevent overlap
    mpAudio.pause();
    mpAudio.src = '';
    mpAudio.load();

    mpIdx = (idx + playlist.length) % playlist.length;
    const t = playlist[mpIdx];
    mpAudio.src = t.src;
    mpAudio.playbackRate = mpPlaybackSpeed;

    document.getElementById('mp-title').textContent = t.title;
    document.getElementById('mp-artist').textContent = t.artist;

    const art = document.getElementById('mp-art');
    if (art) art.src = t.cover;

    const bg = document.getElementById('mp-bg');
    if (bg) bg.style.backgroundImage = `url('${t.cover}')`;

    const lb = document.getElementById('mp-lyrics-body');
    if (lb) lb.innerText = t.lyrics || 'No lyrics added.';

    document.getElementById('mp-current').textContent = '0:00';
    document.getElementById('mp-duration').textContent = '0:00';
    document.getElementById('mp-progress-fill').style.width = '0%';
    document.getElementById('mp-progress-thumb').style.left = '0%';

    document.querySelectorAll('.mp-track-item').forEach((el, i) => {
        el.classList.toggle('active', i === mpIdx);
    });

    if (mpPlaying) {
        mpAudio.play().catch(e => console.error("Playback error:", e));
    }
}

function mpToggle() {
    if (mpAudio.paused) {
        mpAudio.play().then(() => {
            mpPlaying = true;
            document.getElementById('mp-play-icon').style.display = 'none';
            document.getElementById('mp-pause-icon').style.display = '';
        }).catch(e => {
            console.error("Play error:", e);
            alert("Could not play audio. Check if file exists: " + mpAudio.src);
        });
    } else {
        mpAudio.pause();
        mpPlaying = false;
        document.getElementById('mp-play-icon').style.display = '';
        document.getElementById('mp-pause-icon').style.display = 'none';
    }
}

function mpNext() { mpLoad(mpIdx + 1); }
function mpPrev() { mpLoad(mpIdx - 1); }

function mpToggleSpeed() {
    let curIdx = speeds.indexOf(mpPlaybackSpeed);
    mpPlaybackSpeed = speeds[(curIdx + 1) % speeds.length];
    mpAudio.playbackRate = mpPlaybackSpeed;
    document.getElementById('mp-speed').textContent = mpPlaybackSpeed + 'x';
}

function mpToggleLyrics() {
    document.getElementById('mp-lyrics-panel').classList.toggle('open');
}

function mpFmt(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
}

mpAudio.addEventListener('timeupdate', () => {
    if (!mpAudio.duration) return;
    const currentTime = mpAudio.currentTime;
    const pct = (currentTime / mpAudio.duration) * 100;
    const fill = document.getElementById('mp-progress-fill');
    const thumb = document.getElementById('mp-progress-thumb');
    if (fill) fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
    document.getElementById('mp-current').textContent = mpFmt(currentTime);
    document.getElementById('mp-duration').textContent = mpFmt(mpAudio.duration);
});

const pb = document.getElementById('mp-progress-bar');
if (pb) {
    pb.addEventListener('click', e => {
        const rect = pb.getBoundingClientRect();
        mpAudio.currentTime = ((e.clientX - rect.left) / rect.width) * mpAudio.duration;
    });
}

mpAudio.addEventListener('ended', () => mpNext());

// Debugging
mpAudio.addEventListener('error', (e) => {
    console.error("Audio error event:", e);
    const code = mpAudio.error ? mpAudio.error.code : 'unknown';
    console.error("Error code:", code);
});

function buildTracklist() {
    const list = document.getElementById('mp-tracklist');
    if (!list) return;
    list.innerHTML = ''; // Clear existing
    playlist.forEach((t, i) => {
        const item = document.createElement('div');
        item.className = 'mp-track-item' + (i === 0 ? ' active' : '');
        item.innerHTML = `<span class="mp-track-num">${String(i + 1).padStart(2, '0')}</span>
                          <span class="mp-track-name">${t.title}</span>`;
        item.addEventListener('click', () => mpLoad(i));
        list.appendChild(item);
    });
}

buildTracklist();
if (playlist.length > 0) mpLoad(0);
