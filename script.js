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
        form.addEventListener('submit', function(event) {

            
            /*event.preventDefault(); // Impede o envio padrão do formulário
            console.log(event);
            let nome = document.getElementById('nomeform').value;
            let email = document.getElementById('emailform').value;
            let telefone = document.getElementById('telefoneform').value;
            let mensagem = document.getElementById('mensagemform').value;
            
            console.log(nome);
            console.log(email);
            console.log(telefone);
            console.log(mensagem);

            fetch("https://formsubmit.co/evandroschafer@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nome,
                    email: email,
                    telefone: telefone,
                    message: mensagem
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log("Formulário enviado com sucesso!");
                    

                }
                else{
                    alert("Erro ao enviar o formulário.");
                }
            });*/

            // Após o envio (FormSubmit faz o POST), mostramos a mensagem de sucesso
            setTimeout(() => {
                form.style.display = 'none';
                successMessage.style.display = 'block';
            }, 800);

        });
    }

});

const observerOptions = {
    threshold: 0.15 // Dispara quando 15% do card estiver visível
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Opcional: parar de observar após mostrar
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .card-destaque, .sobre-grid').forEach(el => {
    observer.observe(el);
});