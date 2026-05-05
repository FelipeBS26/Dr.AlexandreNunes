document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ANIMAÇÃO DA HERO SECTION (Intro Cinematográfica)
    // ==========================================
    
    // Criamos uma Timeline do GSAP. 
    // O gsap.timeline() permite encadear animações facilmente.
    const heroTl = gsap.timeline({ 
        defaults: { ease: "power4.out" } // ease Rockstar: começa rápido e desacelera suavemente
    });

    // Estado inicial: Escondemos os elementos antes da animação começar
    gsap.set(".title-monumental", { y: 50, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });
    gsap.set(".subtitle-hero", { y: 20, opacity: 0 });
    gsap.set(".btn-solid", { y: 20, opacity: 0 });
    gsap.set(".support-list li", { x: -20, opacity: 0 });
    gsap.set(".navbar", { y: -50, opacity: 0 });

    // Sequência de entrada
    heroTl
        // 1. Revela a Navbar descendo
        .to(".navbar", {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2 // Um pequeno respiro antes de começar
        })
        // 2. O Título Monumental surge de baixo para cima revelando-se (Clip-path faz o efeito máscara)
        .to(".title-monumental", {
            y: 0,
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.5
        }, "-=0.5") // O "-=0.5" faz essa animação começar meio segundo ANTES da navbar terminar
        // 3. Subtítulo sobe suavemente
        .to(".subtitle-hero", {
            y: 0,
            opacity: 1,
            duration: 1
        }, "-=1")
        // 4. O Botão (CTA) aparece
        .to(".btn-solid", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.8")
        // 5. Os itens da lista de apoio entram um por um (Stagger)
        .to(".support-list li", {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15 // Cria o efeito de cascata entre os itens da lista
        }, "-=0.6");

    // ==========================================
    // EFEITOS EXTRAS (Para polimento)
    // ==========================================
    
    // Efeito de escurecer a Navbar ao scrollar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
});