// Navbar scroll (Muda a cor de fundo ao rolar a página)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Fade-up observer (Controla a animação dos elementos surgindo na tela)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Accordion (Abre e fecha as dúvidas frequentes)
function toggleObjestion(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.objection-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Radio select (Estiliza as caixas de seleção de motivos na etapa 2 do formulário)
function selectRadio(el, group) {
  document.querySelectorAll(`input[name="${group}"]`).forEach(r => {
    r.parentElement.classList.remove('selected');
  });
  el.classList.add('selected');
}

// Wizard (Controla a navegação entre as 3 etapas do formulário)
let currentStep = 1;
function nextStep(n) {
  document.getElementById(`step-${currentStep}`).classList.remove('visible');
  document.getElementById(`ws-${currentStep}`).classList.remove('active');
  currentStep = n;
  document.getElementById(`step-${currentStep}`).classList.add('visible');
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`ws-${i}`).classList.toggle('active', i <= currentStep);
  }
}

// Submit Form (Valida campos e exibe a mensagem de sucesso)
function submitForm() {
  const nome = document.getElementById('f-nome').value.trim();
  const tel = document.getElementById('f-tel').value.trim();
  
  if (!nome || !tel) {
    alert('Por favor, preencha ao menos seu nome e WhatsApp.');
    nextStep(1); // Volta para a primeira etapa caso falte o nome ou telefone
    return;
  }
  
  document.getElementById('form-content').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}

// Phone mask (Formata automaticamente o número do WhatsApp enquanto o usuário digita)
const telInput = document.getElementById('f-tel');
if (telInput) {
  telInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    this.value = v;
  });
}