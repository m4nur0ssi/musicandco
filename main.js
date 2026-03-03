document.addEventListener('DOMContentLoaded', () => {

    // 1. PRELOADER
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }

        // Trigger hero animations
        document.querySelectorAll('#hero .reveal-text, #hero .fade-in, #hero .reveal-up').forEach((el, index) => {
            setTimeout(() => el.classList.add('active'), index * 200 + 300);
        });
    }, 1500);

    // 2. CUSTOM CURSOR
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = mouseX, cursorY = mouseY;

        // Mouse move tracking
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Fast follow for the small dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smooth follow for the larger circle
        const loop = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursorFollower.style.left = `${cursorX}px`;
            cursorFollower.style.top = `${cursorY}px`;
            requestAnimationFrame(loop);
        };
        loop();

        // Hover effect for links & magnetic items
        const hoverElements = document.querySelectorAll('a, button, .magnetic, .explore-btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover-active'));
        });
    }

    // 3. MAGNETIC BUTTONS (2026 UX Trend)
    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', e => {
            const position = magnet.getBoundingClientRect();
            const strength = magnet.getAttribute('data-strength') || 20;
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            magnet.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`;
        });

        magnet.addEventListener('mouseleave', () => {
            magnet.style.transform = 'translate(0px, 0px)';
            // Smooth return
            magnet.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => magnet.style.transition = '', 500);
        });
    });

    // 4. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. 3D TILT EFFECT ON CARDS
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            // Calculate rotation max 15deg
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => card.style.transition = '', 800);
        });
    });

    // 6. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal-up, .reveal-text, .fade-in, .reveal-left, .reveal-center, .reveal-right');
    elementsToReveal.forEach(el => revealObserver.observe(el));

    // 6b. HERO TITLE SCROLL REVEAL (L'EXCELLENCE puis MUSICALE)
    const heroWordObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Rendre le wrapper visible
                entry.target.classList.add('visible');
                // Rendre le h1 intérieur visible
                const h1 = entry.target.querySelector('h1');
                if (h1) h1.classList.add('visible');
                // Paragraphes aussi
                heroWordObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-reveal-word').forEach(el => heroWordObserver.observe(el));

    // Smooth Scroll anchoring
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 7. REDEMPTION GENERATIVE VIDEO ENGINE
    const canvas = document.getElementById('redemption-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isPlaying = false;
        let startTime = 0;
        let animFrameId = null;

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(devicePixelRatio, devicePixelRatio);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = (timestamp) => {
            if (!isPlaying) return;

            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const w = canvas.width / devicePixelRatio;
            const h = canvas.height / devicePixelRatio;
            const time = elapsed / 1000;

            // Background
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            const centerY = h / 2;
            const staffGap = 25;
            const staffTop = centerY - staffGap * 2;

            // Portée musicale
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = staffTop + i * staffGap;
                ctx.beginPath();
                ctx.moveTo(50, y);
                ctx.lineTo(w - 50, y);
                ctx.stroke();
            }

            // Clé de sol
            ctx.font = '70px serif';
            ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
            ctx.fillText('𝄞', 60, centerY + 25);
            ctx.shadowBlur = 0;

            // MUSIC & CO centré
            ctx.textAlign = 'center';
            ctx.font = '700 48px Syncopate, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
            ctx.shadowBlur = 25;
            ctx.shadowColor = 'rgba(255,255,255,0.3)';
            ctx.fillText('MUSIC & CO', w / 2, h - 50);
            ctx.shadowBlur = 0;

            // Notes dérivantes + lettres
            const notes = ['♩', '♪', '♫', '♬'];
            const brandText = 'MUSIC & CO';
            const seed = 42;
            const speed = 38;
            const spacing = 115;

            for (let i = 0; i < 20; i++) {
                let xPos = (i * spacing) - (time * speed);
                const totalWidth = 20 * spacing;
                xPos = ((xPos % totalWidth) + totalWidth) % totalWidth;

                if (xPos > 50 && xPos < w - 50) {
                    const lineIndex = Math.floor(Math.abs(Math.sin(i + seed)) * 5);
                    const y = staffTop + lineIndex * staffGap;
                    const opacity = Math.sin(time * 2 + i) * 0.25 + 0.65;

                    ctx.textAlign = 'center';
                    ctx.font = '38px serif';
                    ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
                    ctx.shadowBlur = 10 * opacity;
                    ctx.shadowColor = 'rgba(0,240,255,0.6)';
                    ctx.fillText(notes[i % notes.length], xPos, y + 10);

                    const letter = brandText[i % brandText.length];
                    if (letter.trim() !== '') {
                        ctx.font = '700 13px Syncopate, sans-serif';
                        ctx.fillStyle = `rgba(255,255,255,${opacity * 0.7})`;
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = 'rgba(255,255,255,0.3)';
                        ctx.fillText(letter, xPos, y + 32);
                    }
                    ctx.shadowBlur = 0;
                }
            }

            animFrameId = requestAnimationFrame(draw);
        };

        // IntersectionObserver : lance en scroll, boucle, s'arrête hors vue
        const engineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isPlaying) {
                        isPlaying = true;
                        startTime = 0;
                        animFrameId = requestAnimationFrame(draw);
                    }
                } else {
                    isPlaying = false;
                    if (animFrameId) cancelAnimationFrame(animFrameId);
                }
            });
        }, { threshold: 0.1 });

        engineObserver.observe(canvas);
    }

    // 8. PIANO SCROLL TRANSITION
    const pianoSection = document.getElementById('piano-transition');
    if (pianoSection) {
        const leftHalf = pianoSection.querySelector('.piano-half.left .keys-container');
        const rightHalf = pianoSection.querySelector('.piano-half.right .keys-container');
        const overlay = pianoSection.querySelector('.transition-overlay');

        // Pattern du vrai piano : C D E F G A B
        // has-black = touche noire à droite (sauf E et B)
        const blackKeyPattern = [true, true, false, true, true, true, false];

        const createKeys = (container, count) => {
            for (let i = 0; i < count; i++) {
                const key = document.createElement('div');
                key.className = 'piano-key';
                if (blackKeyPattern[i % 7]) {
                    key.classList.add('has-black');
                }
                container.appendChild(key);
            }
        };

        createKeys(leftHalf, 14);
        createKeys(rightHalf, 14);

        window.addEventListener('scroll', () => {
            const rect = pianoSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            if (rect.top <= 0 && rect.bottom >= viewHeight) {
                const totalScroll = pianoSection.offsetHeight - viewHeight;
                const progress = Math.min(Math.max(Math.abs(rect.top) / totalScroll, 0), 1);

                const leftPart = pianoSection.querySelector('.piano-half.left');
                const rightPart = pianoSection.querySelector('.piano-half.right');
                const revealLogo = pianoSection.querySelector('.piano-reveal-logo');

                // Ouverture des panneaux
                leftPart.style.transform = `translateX(${-progress * 100}%)`;
                rightPart.style.transform = `translateX(${progress * 100}%)`;

                // Disparition de l'overlay "OUVREZ LES PORTES"
                overlay.style.opacity = 1 - (progress * 2);
                overlay.style.transform = `translate(-50%, -50%) scale(${1 + progress * 0.5})`;
                overlay.style.pointerEvents = progress > 0.4 ? 'none' : 'auto';

                // Apparition du logo M&CO à partir de 40% d'ouverture
                if (revealLogo) {
                    const logoProgress = Math.max(0, (progress - 0.4) / 0.6);
                    revealLogo.style.opacity = logoProgress;
                }
            }
        });
    }

    // 9. INSTRUMENT TABLET SLIDER
    const slider = document.querySelector('.instruments-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.instr-slide');
        let currentSlide = 0;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        // Auto slide every 4 seconds
        setInterval(nextSlide, 4000);
    }

    // 10. NAV ACTIVE HIGHLIGHT (BLUE SQUARE)
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = ['instruments-experience', 'tarifs', 'contact-section'].map(id => document.getElementById(id));

    const navObserverOptions = {
        threshold: 0.4,
        rootMargin: "-20% 0px -20% 0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    link.classList.toggle('active', href === id);
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        if (section) navObserver.observe(section);
    });

    // ── STATS COUNTER (count-up au scroll) ──────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const duration = 1800;
                const start = performance.now();
                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(ease * target);
                    if (progress < 1) requestAnimationFrame(animate);
                    else el.textContent = target;
                };
                requestAnimationFrame(animate);
                countObserver.unobserve(el);
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => countObserver.observe(el));
    }

    // ── FAQ ACCORDION ────────────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            // Ferme tous
            document.querySelectorAll('.faq-item.open').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ── FORMULAIRE CONTACT (simulation envoi) ────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('f-name').value.trim();
            const email = document.getElementById('f-email').value.trim();
            if (!name || !email) {
                document.getElementById('f-name').focus();
                return;
            }
            // Simulation envoi
            const btn = contactForm.querySelector('.form-submit');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';
            setTimeout(() => {
                btn.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    formSuccess.style.animation = 'fadeIn 0.4s ease';
                }
                contactForm.reset();
            }, 1200);
        });
    }

    // ── LECTEUR AUDIO (Web Audio API — ambiance musicale générée) ─────────
    const audioPlayer = document.getElementById('audio-player');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const audioProgress = document.getElementById('audio-progress');

    // Affiche le player après 3s
    setTimeout(() => {
        if (audioPlayer) audioPlayer.classList.add('visible');
    }, 3000);

    let audioCtx = null;
    let isAudioPlaying = false;
    let audioNodes = [];
    let progressInterval = null;
    let audioStart = 0;

    const NOTE_FREQS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

    function playAmbience() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.5);
        masterGain.connect(audioCtx.destination);

        // Pad sonore
        NOTE_FREQS.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq / 2, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08 + Math.random() * 0.04, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(audioCtx.currentTime + i * 0.3);
            audioNodes.push(osc, gain);
        });

        audioStart = audioCtx.currentTime;
        const totalDur = 30;
        progressInterval = setInterval(() => {
            const elapsed = audioCtx.currentTime - audioStart;
            const pct = Math.min((elapsed / totalDur) * 100, 100);
            if (audioProgress) audioProgress.style.width = pct + '%';
            if (pct >= 100) restartAmbience();
        }, 200);
    }

    function stopAmbience() {
        if (!audioCtx) return;
        audioNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) { } });
        audioNodes = [];
        clearInterval(progressInterval);
        audioCtx.close();
        audioCtx = null;
        if (audioProgress) audioProgress.style.width = '0%';
    }

    function restartAmbience() {
        stopAmbience();
        if (isAudioPlaying) playAmbience();
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            isAudioPlaying = !isAudioPlaying;
            if (isAudioPlaying) {
                playAmbience();
                if (audioIcon) { audioIcon.className = 'fa-solid fa-pause'; }
            } else {
                stopAmbience();
                if (audioIcon) { audioIcon.className = 'fa-solid fa-play'; }
            }
        });
    }

    // ── PIANO INTERACTIF AU CLAVIER ───────────────────────────────────────
    const KEY_NOTE_MAP = {
        'a': 261.63, 'z': 293.66, 'e': 329.63, 'r': 349.23,
        't': 392.00, 'y': 440.00, 'u': 493.88, 'i': 523.25,
        'q': 220.00, 's': 246.94, 'd': 277.18, 'f': 311.13,
    };

    const activeKeys = {};
    document.addEventListener('keydown', (e) => {
        const freq = KEY_NOTE_MAP[e.key.toLowerCase()];
        if (!freq || activeKeys[e.key]) return;

        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);

        activeKeys[e.key] = true;

        // Ripple visuel sur la touche correspondante
        const keys = document.querySelectorAll('.piano-key');
        const idx = Object.keys(KEY_NOTE_MAP).indexOf(e.key.toLowerCase());
        if (idx >= 0 && keys[idx]) {
            keys[idx].style.filter = 'brightness(0.6)';
            setTimeout(() => { keys[idx].style.filter = ''; }, 150);
        }
    });

    document.addEventListener('keyup', (e) => {
        delete activeKeys[e.key];
    });

});

