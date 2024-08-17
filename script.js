document.addEventListener('DOMContentLoaded', function() {
    // Função para verificar a posição das seções
    function revealOnScroll() {
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const revealPoint = 150;

            if (sectionTop < windowHeight - revealPoint) {
                section.classList.add('active');
            }
        });
    }

    // Verifica a rolagem inicial
    revealOnScroll();

    // Adiciona o evento de rolagem
    window.addEventListener('scroll', revealOnScroll);
});

// Envio do formulário para WhatsApp
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    if (name && email && message) {
        let whatsappNumber = '+5511969449698'; // Substitua pelo número do WhatsApp no formato internacional
        let encodedMessage = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`);
        let whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank'); // Abre o link em uma nova aba ou janela
        this.reset(); // Limpa o formulário após o envio
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
