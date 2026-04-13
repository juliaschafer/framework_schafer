// =============================================
// SCRIPT.JS - Schäfer Soluções para o Agronegócio
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // ==================== MENU MOBILE ====================
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== FORMULÁRIO DE CONTATO ====================
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (form && successMessage) {
        form.addEventListener('submit', function() {
            // Após o envio (FormSubmit faz o POST), mostramos a mensagem de sucesso
            setTimeout(() => {
                form.style.display = 'none';
                successMessage.style.display = 'block';
            }, 800);
        });
    }

});