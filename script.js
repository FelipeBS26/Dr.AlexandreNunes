document.addEventListener("DOMContentLoaded", () => {
    // Garante que o plugin está registrado
    gsap.registerPlugin(ScrollTrigger);

    const heroVideo = document.getElementById("hero-video");

    // Função que cria a animação (isolada para podermos chamar no momento certo)
    function initHeroAnimation() {
        console.log("Vídeo carregado. Duração:", heroVideo.duration); // Para debug no console (F12)

        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-scrubber",
                start: "top top",
                end: "+=200%", // Prende a tela por 2 "alturas" de scroll
                scrub: 1, // Suavidade de 1 segundo (evita engasgos)
                pin: true,
                // markers: true, // DESCOMENTE ESTA LINHA SE QUISER VER AS LINHAS GUIA DO GSAP NA TELA
            }
        });

        // A. Avança os frames do vídeo
        heroTl.to(heroVideo, {
            currentTime: heroVideo.duration || 1, // Fallback se a duração não for lida
            duration: 1,
            ease: "none"
        }, 0);

        // B. Move o vídeo levemente para a direita
        let moveX = window.innerWidth > 768 ? "20vw" : "0vw"; 
        heroTl.to(".video-scroll-wrapper", {
            x: moveX,
            duration: 1,
            ease: "power2.inOut"
        }, 0);

        // C. Revela o texto
        heroTl.fromTo(".hero-text-scroll", 
            { opacity: 0, x: -50 }, 
            { opacity: 1, x: 0, duration: 0.5 }, 
            0.2 // Começa quando o scroll está em 20%
        );
    }

    // VERIFICAÇÃO À PROVA DE BALAS: O vídeo já tem os metadados?
    if (heroVideo.readyState >= 1) {
        // Se já carregou (está no cache), inicia a animação na hora
        initHeroAnimation();
    } else {
        // Se não carregou, espera o evento disparar
        heroVideo.addEventListener('loadedmetadata', initHeroAnimation);
    }
});