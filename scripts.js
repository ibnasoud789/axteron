// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect with Dynamic Background
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    }
    lastScroll = currentScroll;
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Hero Section Animations with Stagger
const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });heroTimeline    .fromTo('.hero-title',         { y: 100, opacity: 0, skewY: 7 },        { duration: 1.2, y: 0, opacity: 1, skewY: 0 }    )    .fromTo('.hero-subtitle',        { y: 50, opacity: 0, skewY: 5 },        { duration: 1, y: 0, opacity: 1, skewY: 0 },        '-=0.8'    )    .fromTo('.hero-buttons .cta-btn',        { y: 30, opacity: 0 },        { duration: 0.8, y: 0, opacity: 1, stagger: 0.2 },        '-=0.6'    );

// Floating Animation for Stats
const statsTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.stats-container',
        start: 'top center',
        toggleActions: 'play none none reverse'
    }
});

statsTimeline.from('.stat-item', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'back.out(1.7)'
});

// Stats Counter Animation with Easing
const stats = document.querySelectorAll('.stat-number');
stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    const increment = target / 50;
    let current = 0;

    const updateCount = () => {
        if (current < target) {
            current += increment;
            stat.textContent = Math.ceil(current);
            requestAnimationFrame(updateCount);
        } else {
            stat.textContent = target;
        }
    };

    ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => updateCount(),
        once: true
    });
});

// Team Section Filters with GSAP
const filterButtons = document.querySelectorAll('.filter-btn');
const teamCards = document.querySelectorAll('.team-cards .card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const game = button.getAttribute('data-game');
        
        // Create a timeline for smooth transitions
        const filterTimeline = gsap.timeline();
        
        teamCards.forEach(card => {
            if (game === 'all' || card.getAttribute('data-game') === game) {
                filterTimeline.to(card, {
                    duration: 0.5,
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    ease: 'back.out(1.7)',
                    clearProps: 'all'
                });
                card.style.display = 'block';
            } else {
                filterTimeline.to(card, {
                    duration: 0.5,
                    opacity: 0,
                    scale: 0.8,
                    y: -20,
                    ease: 'back.in(1.7)',
                    onComplete: () => {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
});

// Achievements Timeline Animation
function initAchievementsTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineContents = document.querySelectorAll('.timeline-content');
  const achievementCounter = document.querySelector('.achievement-counter');
  
  // Counter animation
  if (achievementCounter) {
    const counterNumber = achievementCounter.querySelector('.counter-number');
    const targetNumber = parseInt(counterNumber.textContent);
    let currentNumber = 0;
    
    const animateCounter = () => {
      if (currentNumber < targetNumber) {
        currentNumber++;
        counterNumber.textContent = currentNumber;
        requestAnimationFrame(animateCounter);
      }
    };
    
    // Start counter animation when counter is in view
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateCounter, 500);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counterObserver.observe(achievementCounter);
  }

  // Intersection Observer for fade in animation
  const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Add shine effect element
        const shine = document.createElement('div');
        shine.className = 'achievement-shine';
        entry.target.querySelector('.timeline-content').appendChild(shine);
        
        // Animate progress bar
        const progressBar = entry.target.querySelector('.progress-bar');
        if (progressBar) {
          progressBar.style.width = progressBar.parentElement.getAttribute('data-progress') || '0%';
        }
        
        // Create particle effects
        createAchievementParticles(entry.target);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    observer.observe(item);
  });

  // Mouse move effect for each card
  timelineContents.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Update CSS variables for gradient follow
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);

      // Calculate rotation based on mouse position
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 10;
      const rotateY = -((e.clientX - centerX) / (rect.width / 2)) * 10;

      // Apply smooth 3D transforms
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(10px)
        scale(1.02)
      `;

      // Parallax effect for content
      const title = card.querySelector('h3');
      const date = card.querySelector('.date');
      const category = card.querySelector('.achievement-category');
      const progress = card.querySelector('.achievement-progress');

      if (title) title.style.transform = `translateZ(50px)`;
      if (date) date.style.transform = `translateZ(30px)`;
      if (category) category.style.transform = `translateZ(40px)`;
      if (progress) progress.style.transform = `translateZ(20px)`;
    });

    // Reset card on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      
      const elements = card.querySelectorAll('h3, .date, .achievement-category, .achievement-progress');
      elements.forEach(el => el.style.transform = '');
    });
  });
}

// Achievement Particle Effects
function createAchievementParticles(element) {
  const particleCount = 15;
  const colors = ['#ffd700', '#ffb700', '#ffc107', '#ff9800'];
  const content = element.querySelector('.timeline-content');
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'achievement-particle';
    
    // Random particle styling
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    
    // Random particle animation
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = 1 + Math.random() * 2;
    const tx = Math.cos(angle) * 100 * velocity;
    const ty = Math.sin(angle) * 100 * velocity;
    const rotation = Math.random() * 360;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--rotate', `${rotation}deg`);
    
    content.appendChild(particle);
    
    // Remove particle after animation
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}

// Parallax effect for achievements
function initAchievementsParallax() {
  const timelineItems = document.querySelectorAll('.timeline-content');
  
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    timelineItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemX = rect.left + rect.width / 2;
      const itemY = rect.top + rect.height / 2;
      
      const distanceX = (e.clientX - itemX) / 500;
      const distanceY = (e.clientY - itemY) / 500;
      
      gsap.to(item, {
        duration: 0.5,
        x: distanceX * 10,
        y: distanceY * 10,
        rotateX: -distanceY * 5,
        rotateY: distanceX * 5,
        ease: 'power2.out'
      });
    });
  });
}

// News Cards Animation with Hover Effect
const newsCards = document.querySelectorAll('.news-card');

newsCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -10,
            scale: 1.02,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Partner Logos Animation with Infinite Loop
const partnersTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.partners-grid',
        start: 'top center',
        toggleActions: 'play none none reverse'
    },
    repeat: -1,
    yoyo: true
});

partnersTimeline
    .from('.partner-logo', {
        opacity: 0.5,
        y: 20,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out'
    })
    .to('.partner-logo', {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out'
    });

// Contact Section Animations
const contactSection = document.querySelector('.contact-section');
const contactInfo = document.querySelector('.contact-info');
const contactForm = document.querySelector('.contact-form');
const formGroups = document.querySelectorAll('.form-group');

// Simple fade in for contact info
gsap.fromTo(contactInfo, 
    { opacity: 0, y: 20 },
    {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: contactSection,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    }
);

// Simple fade in for contact form
gsap.fromTo(contactForm,
    { opacity: 0, y: 20 },
    {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: contactSection,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    }
);

// Simple form group animations
formGroups.forEach((group, index) => {
    gsap.fromTo(group,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: contactForm,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Social links animation
const socialLinks = document.querySelectorAll('.social-links a');
socialLinks.forEach((link, index) => {
    gsap.from(link, {
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'back.out(1.7)'
    });
});

// Enhanced Form Validation and Submit Handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const button = contactForm.querySelector('button');
    const originalText = button.textContent;
    let isValid = true;
    
    // Validate each field with animation
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!input.value.trim()) {
            isValid = false;
            
            // Shake animation for invalid fields
            gsap.to(group, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.5,
                ease: 'power2.out'
            });
            
            gsap.to(input, {
                borderColor: '#ff3e3e',
                boxShadow: '0 0 15px rgba(255, 62, 62, 0.2)',
                duration: 0.3
            });
        }
    });
    
    if (isValid) {
        // Success animation sequence
        const timeline = gsap.timeline();
        
        timeline
            .to(button, {
                scale: 0.95,
                duration: 0.1
            })
            .to(button, {
                scale: 1,
                duration: 0.2,
                background: 'var(--gradient-primary)',
                ease: 'back.out(1.7)'
            })
            .to(button, {
                width: '60px',
                duration: 0.3,
                ease: 'power2.inOut'
            })
            .to(button, {
                rotation: 360,
                duration: 0.5,
                ease: 'power2.inOut',
                onStart: () => {
                    button.innerHTML = '<i class="fas fa-check"></i>';
                }
            })
            .to(button, {
                width: '100%',
                duration: 0.3,
                delay: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    button.textContent = 'Message Sent!';
                    button.classList.add('success-message');
                }
            });
        
        // Reset form after animation
        setTimeout(() => {
            timeline.reverse().then(() => {
                button.textContent = originalText;
                button.classList.remove('success-message');
                contactForm.reset();
                
                // Reset all inputs to default state
                formGroups.forEach(group => {
                    const input = group.querySelector('input, textarea');
                    gsap.to(input, {
                        borderColor: 'rgba(255, 215, 0, 0.1)',
                        boxShadow: 'none',
                        duration: 0.3
                    });
                });
            });
        }, 3000);
    }
});

// Smooth Scroll with Dynamic Offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = navbar.offsetHeight + 20;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            gsap.to(window, {
                duration: 1,
                scrollTo: targetPosition,
                ease: 'power4.out'
            });
        }
    });
});

// Footer Animations
const footerTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    }
});

footerTimeline
    .from('.footer-logo', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    })
    .from('.footer-logo img', {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.footer-column', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power4.out'
    }, '-=0.5')
    .from('.footer-column ul li', {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.footer-bottom', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.2');

// Footer Logo Hover Animation
const footerLogo = document.querySelector('.footer-logo img');
if (footerLogo) {
    footerLogo.addEventListener('mouseenter', () => {
        gsap.to(footerLogo, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    footerLogo.addEventListener('mouseleave', () => {
        gsap.to(footerLogo, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}

// Footer Links Hover Effect
const footerLinks = document.querySelectorAll('.footer-column ul li');
footerLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const dot = link.querySelector('::before');
        if (dot) {
            gsap.to(dot, {
                scale: 1.5,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });

    link.addEventListener('mouseleave', () => {
        const dot = link.querySelector('::before');
        if (dot) {
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
});

// Particle Animation
class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvas.width) this.x = 0;
    if (this.x < 0) this.x = this.canvas.width;
    if (this.y > this.canvas.height) this.y = 0;
    if (this.y < 0) this.y = this.canvas.height;
  }

  draw() {
    this.ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// Initialize particle animation
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas, ctx));
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Spotlight effect
function initSpotlight() {
  const hero = document.querySelector('.hero-section');
  const spotlight = document.querySelector('.hero-spotlight');
  
  if (!hero || !spotlight) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    spotlight.style.background = `radial-gradient(
      circle at ${x}% ${y}%,
      rgba(255, 215, 0, 0.15) 0%,
      transparent 50%
    )`;
    spotlight.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });
}

// Parallax effect
function initParallax() {
  const hero = document.querySelector('.hero-section');
  const layers = document.querySelectorAll('.hero-parallax-layer');
  
  if (!hero || !layers.length) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    layers.forEach((layer, index) => {
      const depth = (index + 1) * 10;
      const moveX = (x - 0.5) * depth;
      const moveY = (y - 0.5) * depth;
      
      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
}

// News Section Animations
function initNewsAnimations() {
  const newsCards = document.querySelectorAll('.news-card');
  
  // Fade in animation for news cards
  newsCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: index * 0.2,
      ease: 'power3.out'
    });
  });

  // Share button hover effect
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    const options = btn.nextElementSibling;
    
    btn.addEventListener('mouseenter', () => {
      gsap.to(options, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    const shareContainer = btn.parentElement;
    shareContainer.addEventListener('mouseleave', () => {
      gsap.to(options, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: 'power2.in'
      });
    });
  });
}

// Partners Section Animations
function initPartnersAnimations() {
  const partnerCards = document.querySelectorAll('.partner-card');
  const tiers = document.querySelectorAll('.partners-tier');

  // Tier title animation
  tiers.forEach(tier => {
    const title = tier.querySelector('.tier-title');
    gsap.from(title, {
      scrollTrigger: {
        trigger: tier,
        start: 'top center',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Partner cards stagger animation
  partnerCards.forEach((card, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out'
    });

    // Logo animation
    const logo = card.querySelector('.partner-logo');
    tl.from(logo, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // Shine effect animation
    const shine = card.querySelector('::before');
    if (shine) {
      tl.fromTo(shine, 
        { left: '-100%' },
        { left: '100%', duration: 0.8, ease: 'power2.inOut' },
        '-=0.4'
      );
    }
  });

  // Mouse tracking effect for partner cards
  partnerCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = -(x - centerX) / 20;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSpotlight();
  initParallax();
  initAchievementsTimeline();
  initNewsAnimations();
  initPartnersAnimations();
  
  // ... existing code ...
}); 