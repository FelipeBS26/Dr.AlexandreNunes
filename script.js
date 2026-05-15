document.addEventListener('DOMContentLoaded', () => {
    // Referências do DOM do Quiz
    const steps = document.querySelectorAll('.quiz-step');
    const stepContents = document.querySelectorAll('.quiz-step-content');
    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const quizFooterActions = document.getElementById('quiz-footer-actions');
    
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnEmail = document.getElementById('btn-email');

    // Configurações e Estado
    let currentStep = 1;
    const totalSteps = 4;
    
    // Objeto para armazenar as seleções do paciente
    const userSelections = {
        1: [], // Incomodos (Múltipla escolha)
        2: [], // Pele (Escolha única, mas array para padronizar lógica)
        3: [], // Respiração (Escolha única)
        4: []  // Histórico (Múltipla escolha)
    };

    // --- LÓGICA DE NAVEGAÇÃO DO QUIZ ---
function updateUI() {
    // 1. Atualiza Sidebar Desktop (Fundo Vermelho do Passo Ativo)
    steps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) === currentStep) {
            step.classList.add('active');
        }
    });

    // 2. Atualiza a Barra de Progresso Mobile
    const progressFill = document.getElementById('quiz-progress-fill');
    const stepText = document.getElementById('current-step-text');
    if (progressFill && stepText && currentStep <= totalSteps) {
        // Calcula a porcentagem
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        stepText.textContent = currentStep;
    }

    // 3. Gerencia o slide de animação e o conteúdo ativo
    stepContents.forEach(content => {
        content.classList.remove('active');
        // Reset da animação para que ela aconteça novamente ao voltar/avançar
        content.style.animation = 'none'; 
    });

    // Força o navegador a recalcular a tela (reflow) para a animação reiniciar
    void document.body.offsetWidth;

    if (currentStep <= totalSteps) {
        const activeContent = document.getElementById(`step-${currentStep}`);
        activeContent.classList.add('active');
        // Reaplica a animação
        activeContent.style.animation = 'slideUpFade 0.4s ease forwards';
        quizFooterActions.style.display = 'flex';
    } else {
        // Se passou do último passo, mostra o resultado
        const resultContent = document.getElementById('step-result');
        resultContent.classList.add('active');
        resultContent.style.animation = 'slideUpFade 0.4s ease forwards';
        quizFooterActions.style.display = 'none'; 
        generateShareLinks();
    }

    // 4. Atualiza Botões do Footer do Quiz
    btnPrev.style.display = currentStep > 1 ? 'block' : 'none';
    
    if (currentStep === totalSteps) {
        btnNext.innerHTML = 'GERAR AVALIAÇÃO <i class="fa-solid fa-check"></i>';
    } else {
        btnNext.innerHTML = 'PRÓXIMO <i class="fa-solid fa-arrow-right"></i>';
    }
}

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            currentStep++;
            updateUI();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentStep--;
            updateUI();
        });
    }

    // --- LÓGICA DE SELEÇÃO DOS CARDS ---
    const optionContainers = document.querySelectorAll('.quiz-options');
    
    optionContainers.forEach((container, index) => {
        const stepNumber = index + 1;
        const isMultiSelect = container.classList.contains('multi-select');
        const options = container.querySelectorAll('.quiz-option');

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const value = btn.getAttribute('data-value');

                if (isMultiSelect) {
                    // Múltipla escolha
                    btn.classList.toggle('selected');
                    if (btn.classList.contains('selected')) {
                        userSelections[stepNumber].push(value);
                    } else {
                        userSelections[stepNumber] = userSelections[stepNumber].filter(v => v !== value);
                    }
                } else {
                    // Escolha única
                    options.forEach(opt => opt.classList.remove('selected'));
                    btn.classList.add('selected');
                    userSelections[stepNumber] = [value];
                }
            });
        });
    });

    // --- GERAÇÃO DOS LINKS DE COMPARTILHAMENTO ---
    function generateShareLinks() {
        // Monta o texto formatado com quebras de linha
        let message = "Olá! Gostaria de agendar uma avaliação para Rinoplastia. Fiz o pré-teste no site e este é o meu perfil:\n\n";
        
        message += `*1. O que me incomoda:* ${userSelections[1].length > 0 ? userSelections[1].join(', ') : 'Não especificado'}\n`;
        message += `*2. Minha pele:* ${userSelections[2].length > 0 ? userSelections[2][0] : 'Não especificado'}\n`;
        message += `*3. Respiração:* ${userSelections[3].length > 0 ? userSelections[3][0] : 'Não especificado'}\n`;
        message += `*4. Histórico:* ${userSelections[4].length > 0 ? userSelections[4].join(', ') : 'Nenhum'}\n\n`;
        
        message += "Aguardo o contato para os próximos passos!";

        // Codifica o texto para formato de URL
        const encodedMessage = encodeURIComponent(message);

        // Link WhatsApp (Substitua o número abaixo pelo WhatsApp da clínica)
        const phoneNumber = "5511999999999"; 
        btnWhatsapp.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Link Email
        const emailAddress = "contato@dr-alexandre.com.br";
        const emailSubject = encodeURIComponent("Pré-Avaliação Site - Rinoplastia");
        btnEmail.href = `mailto:${emailAddress}?subject=${emailSubject}&body=${encodedMessage}`;
    }

    // Inicializa a interface
    updateUI();
});

// --- LÓGICA DO HEADER (Scroll e Menu Mobile) ---
const header = document.getElementById('site-header');
const mobileBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
const navLinks = mainNav.querySelectorAll('a');

// 1. Muda a cor do header ao rolar a página
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. Abre/Fecha o menu lateral no Mobile
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mainNav.classList.toggle('menu-open');
        
        // Troca o ícone (de Hambúrguer para 'X')
        const icon = mobileBtn.querySelector('i');
        if (mainNav.classList.contains('menu-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// 3. Fecha o menu mobile automaticamente se o usuário clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('menu-open');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});