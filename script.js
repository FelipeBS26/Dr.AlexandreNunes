document.addEventListener("DOMContentLoaded", () => {
    // Garante que o plugin está registrado
    gsap.registerPlugin(ScrollTrigger);

    const heroVideo = document.getElementById("hero-video");

    // Agrupamos TODAS as animações da página nesta função
    function initAnimations() {
        console.log("Iniciando animações do GSAP...");

        // ==========================================
        // 1. HERO SCROLL-SCRUBBING
        // ==========================================
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-scrubber",
                start: "top top",
                end: "+=200%", // Isso adiciona espaço no scroll
                scrub: 1,
                pin: true,
            }
        });

        heroTl.to(heroVideo, {
            currentTime: heroVideo.duration || 1,
            duration: 1,
            ease: "none"
        }, 0);

        let moveX = window.innerWidth > 768 ? "20vw" : "0vw"; 
        heroTl.to(".video-scroll-wrapper", {
            x: moveX,
            duration: 1,
            ease: "power2.inOut"
        }, 0);

        heroTl.fromTo(".hero-text-scroll", 
            { opacity: 0, x: -50 }, 
            { opacity: 1, x: 0, duration: 0.5 }, 
            0.2
        );

        // ==========================================
        // 2. ANIMAÇÃO FRAME 2 | CONEXÃO
        // ==========================================
        
        // Título
        gsap.from("#conexao .title-section", {
            scrollTrigger: {
                trigger: "#conexao",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Parágrafos em cascata
        gsap.from("#conexao .cinematic-text p", {
            scrollTrigger: {
                trigger: "#conexao .cinematic-text",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power2.out"
        });

        // Destaque da frase final
        gsap.fromTo("#conexao .text-impact", 
            { color: "var(--color-text-muted)", scale: 0.95 },
            {
                scrollTrigger: {
                    trigger: "#conexao .text-impact",
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                color: "var(--color-text-main)",
                scale: 1,
                duration: 1,
                ease: "power2.out",
                delay: 1.2
            }
        );

        // ==========================================
        // O SEGREDO ESTÁ AQUI: RECALCULAR TUDO
        // ==========================================
        // Como o Hero alterou a altura da página ao "pinar" a tela, 
        // obrigamos o ScrollTrigger a recalcular onde cada seção realmente está agora.
        ScrollTrigger.refresh();
    }

    // Só inicia tudo depois que o vídeo estiver pronto e soubermos sua duração
    if (heroVideo.readyState >= 1) {
        initAnimations();
    } else {
        heroVideo.addEventListener('loadedmetadata', initAnimations);
    }
});