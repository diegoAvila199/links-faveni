document.querySelector('.button-list').addEventListener('click', function(e) {
        if (e.target.tagName === "A" && e.target.classList.contains('button')) {
            e.preventDefault();
        
            const targetId = e.target.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const start = window.scrollY;
                const end = targetSection.offsetTop;
                const distance = end - start;
                const duration = 800;
                let startTime = null;

                function scrollStep(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const progress = currentTime - startTime;
                    const progressPercentage = Math.min(progress / duration, 1);
                    const easeInOut = progressPercentage < 0.5 ? 2 * progressPercentage * progressPercentage: -1 + (4 - 2 * progressPercentage) * progressPercentage;
                    
                     window.scrollTo({
                     top: start + distance * easeInOut,
                    behavior: 'auto'
                    });
                
                    if (progress < duration) {
                    requestAnimationFrame(scrollStep);
                    } else {
                    history.replaceState(null, null, `#${targetId}`);
                    }
                }

                requestAnimationFrame(scrollStep);
            }
                 
     }
        
    });

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const name = encodeURIComponent(document.getElementById('name').value);
        const email = encodeURIComponent(document.getElementById('email').value);
        const message = encodeURIComponent(document.getElementById('message').value);
    
        const phoneNumber = '+5511969449698';
        const whatsappMessage = `Olá, eu sou ${name}. Meu email é ${email}. Mensagem: ${message}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    
        window.location.href = whatsappUrl;
    });
