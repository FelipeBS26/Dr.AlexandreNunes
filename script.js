document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. LÓGICA DO HEADER E MENU HAMBÚRGUER
       ========================================================================== */
    const header = document.getElementById('site-header');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    // 1.1 Header Scroll (Fundo transparente para sólido)
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 1.2 Abertura e Fechamento do Menu Mobile
    if (mobileBtn && mainNav) {
        const navLinks = mainNav.querySelectorAll('a');

        mobileBtn.addEventListener('click', () => {
            // Alterna a classe que abre o menu
            mainNav.classList.toggle('menu-open');
            
            // Alterna o ícone de hambúrguer para "X"
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // 1.3 Fecha o menu automaticamente ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('menu-open');
                
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    } else {
        console.warn("Aviso: Botão do menu mobile ou navegação principal não encontrados.");
    }


    /* ==========================================================================
       2. LÓGICA DO QUIZ DE PRÉ-AVALIAÇÃO
       ========================================================================== */
    const btnNext = document.getElementById('btn-next-step');
    
    // Só inicializa a lógica do quiz se o botão existir na página
    if (btnNext) {
        const steps = document.querySelectorAll('.quiz-step');
        const stepContents = document.querySelectorAll('.quiz-step-content');
        const btnPrev = document.getElementById('btn-prev-step');
        const quizFooterActions = document.getElementById('quiz-footer-actions');
        
        const btnWhatsapp = document.getElementById('btn-whatsapp');
        const btnEmail = document.getElementById('btn-email'); // Caso use botão de email também

        let currentStep = 1;
        const totalSteps = 4;
        
        // Objeto para armazenar as respostas
        const userSelections = {
            1: [], // Incômodos (Múltipla escolha)
            2: [], // Pele (Escolha única)
            3: [], // Respiração (Escolha única)
            4: []  // Histórico (Múltipla escolha)
        };

        // 2.1 Função para atualizar a tela do Quiz
        function updateUI() {
            // Atualiza barra lateral (Desktop)
            steps.forEach(step => {
                step.classList.remove('active');
                if (parseInt(step.getAttribute('data-step')) === currentStep) {
                    step.classList.add('active');
                }
            });

            // Atualiza barra de progresso (Mobile)
            const progressFill = document.getElementById('quiz-progress-fill');
            const stepText = document.getElementById('current-step-text');
            if (progressFill && stepText && currentStep <= totalSteps) {
                const percentage = (currentStep / totalSteps) * 100;
                progressFill.style.width = `${percentage}%`;
                stepText.textContent = currentStep;
            }

            // Esconde todas as abas e reseta animação
            stepContents.forEach(content => {
                content.classList.remove('active');
                content.style.animation = 'none'; 
            });

            // Força reflow para reiniciar animação CSS
            void document.body.offsetWidth;

            // Mostra o passo atual ou o resultado final
            if (currentStep <= totalSteps) {
                const activeContent = document.getElementById(`step-${currentStep}`);
                if (activeContent) {
                    activeContent.classList.add('active');
                    activeContent.style.animation = 'slideUpFade 0.4s ease forwards';
                }
                if (quizFooterActions) quizFooterActions.style.display = 'flex';
            } else {
                const resultContent = document.getElementById('step-result');
                if (resultContent) {
                    resultContent.classList.add('active');
                    resultContent.style.animation = 'slideUpFade 0.4s ease forwards';
                }
                if (quizFooterActions) quizFooterActions.style.display = 'none'; 
                generateShareLinks();
            }

            // Atualiza estado dos botões Voltar/Próximo
            if (btnPrev) {
                btnPrev.style.display = currentStep > 1 ? 'block' : 'none';
            }
            
            if (currentStep === totalSteps) {
                btnNext.innerHTML = 'GERAR AVALIAÇÃO <i class="fa-solid fa-check"></i>';
            } else {
                btnNext.innerHTML = 'PRÓXIMO <i class="fa-solid fa-arrow-right"></i>';
            }
        }

        // 2.2 Eventos de clique para avançar e voltar
        btnNext.addEventListener('click', () => {
            currentStep++;
            updateUI();
        });

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                currentStep--;
                updateUI();
            });
        }

        // 2.3 Lógica de seleção das opções (Cards)
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
                        btn.classList.toggle('selected');
                        if (btn.classList.contains('selected')) {
                            userSelections[stepNumber].push(value);
                        } else {
                            userSelections[stepNumber] = userSelections[stepNumber].filter(v => v !== value);
                        }
                    } else {
                        options.forEach(opt => opt.classList.remove('selected'));
                        btn.classList.add('selected');
                        userSelections[stepNumber] = [value];
                    }
                });
            });
        });

        // 2.4 Geração dos Links (WhatsApp e Email)
        function generateShareLinks() {
            let message = "Olá! Gostaria de agendar uma avaliação para Rinoplastia. Fiz o pré-teste no site e este é o meu perfil:\n\n";
            
            message += `*1. O que me incomoda:* ${userSelections[1].length > 0 ? userSelections[1].join(', ') : 'Não especificado'}\n`;
            message += `*2. Minha pele:* ${userSelections[2].length > 0 ? userSelections[2][0] : 'Não especificado'}\n`;
            message += `*3. Respiração:* ${userSelections[3].length > 0 ? userSelections[3][0] : 'Não especificado'}\n`;
            message += `*4. Histórico:* ${userSelections[4].length > 0 ? userSelections[4].join(', ') : 'Nenhum'}\n\n`;
            
            message += "Aguardo o contato para os próximos passos!";

            const encodedMessage = encodeURIComponent(message);

            if (btnWhatsapp) {
                // Substitua pelo número real
                const phoneNumber = "5511999999999"; 
                btnWhatsapp.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            }

            if (btnEmail) {
                // Opcional: Se houver botão de e-mail na interface
                const emailAddress = "contato@dr-alexandre.com.br";
                const emailSubject = encodeURIComponent("Pré-Avaliação Site - Rinoplastia");
                btnEmail.href = `mailto:${emailAddress}?subject=${emailSubject}&body=${encodedMessage}`;
            }
        }

        // Inicializa a interface pela primeira vez
        updateUI();
    }
});