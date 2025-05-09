// ========================
// 🌐 UTILITÁRIOS GERAIS
// ========================
const R = 6371; // Raio da Terra em km

function toRad(grau) {
  return grau * Math.PI / 180;
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatarNomeCidade(nomeCidade) {
  const partes = nomeCidade.trim().toLowerCase().split('-');
  const cidade = partes[0].trim();
  const uf = partes[1] ? partes[1].trim().toUpperCase() : '';
  const nomeFormatado = cidade
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
  return uf ? `${nomeFormatado} - ${uf}` : nomeFormatado;
}

// ========================
// 📍 MAPA E LOCALIZAÇÃO
// ========================
let mapa;
let marcadorAluno, marcadorPolo, linha;

function mostrarMapa(coordAluno, coordPolo) {
  if (!mapa) {
    mapa = L.map('mapa').setView(coordAluno, 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);
  } else {
    mapa.setView(coordAluno, 7);
    if (marcadorAluno) marcadorAluno.remove();
    if (marcadorPolo) marcadorPolo.remove();
    if (linha) linha.remove();
  }

  marcadorAluno = L.marker(coordAluno).addTo(mapa).bindPopup("Sua cidade");
  marcadorPolo = L.marker(coordPolo).addTo(mapa).bindPopup("Polo mais próximo").openPopup();
  linha = L.polyline([coordAluno, coordPolo], { color: 'blue' }).addTo(mapa);
}

function encontrarPoloMaisProximo(nomeCidade) {
  const cidadeFormatada = formatarNomeCidade(nomeCidade);
  let menorDistancia = Infinity;
  let poloMaisProximo = null;

  if (cidades_brasileiras[cidadeFormatada]) {
    const [latAluno, lonAluno] = cidades_brasileiras[cidadeFormatada];
    for (const [polo, [latPolo, lonPolo]] of Object.entries(polos_Faveni)) {
      const distancia = calcularDistancia(latAluno, lonAluno, latPolo, lonPolo);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        poloMaisProximo = polo;
      }
    }
  }

  return [poloMaisProximo, menorDistancia !== Infinity ? menorDistancia : null];
}

function buscar(cidadeManual = null) {
  const campoCidade = document.getElementById('cidade');
  const resultado = document.getElementById('resultado');
  const cidade = cidadeManual || campoCidade.value.trim();

  if (!cidade) {
    resultado.textContent = 'Por favor, insira uma cidade';
    resultado.style.color = 'red';
    return;
  }

  const [polo, distancia] = encontrarPoloMaisProximo(cidade);

  if (polo && distancia !== null) {
    resultado.textContent = `O polo mais próximo de ${cidade} está em ${polo}, a aproximadamente ${distancia.toFixed(2)} km.`;
    resultado.style.color = 'inherit';

    const coordenadasAluno = cidades_brasileiras[formatarNomeCidade(cidade)];
    const coordenadasPolo = polos_Faveni[polo];
    mostrarMapa(coordenadasAluno, coordenadasPolo);
  } else {
    resultado.textContent = `Nenhum polo encontrado para ${cidade}. Clique em "NÃO ENCONTRADOS" para relatar.`;
    resultado.style.color = 'red';
  }
}

// ========================
// ✉️ FORMULÁRIO WHATSAPP
// ========================
function enviarFormularioContato(e) {
  e.preventDefault();

  const nome = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('message').value.trim();
  const telefone = '+5511969449698';

  const texto = encodeURIComponent(`Olá, eu sou ${nome}. Meu email é ${email}. Mensagem: ${mensagem}`);
  const linkWhatsApp = `https://wa.me/${telefone}?text=${texto}`;
  window.location.href = linkWhatsApp;
}

function configurarEnvioFormulario() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    enviarFormularioContato(e);

    const status = document.createElement('div');
    status.className = 'form-status success';
    status.textContent = 'Mensagem enviada com sucesso!';
    form.appendChild(status);
    form.reset();

    setTimeout(() => status.remove(), 5000);
  });
}

// ========================
// 🌈 ANIMAÇÕES DE SCROLL
// ========================
function inicializarAnimacoesDeScroll() {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
}

// ========================
// 🌀 SCROLL SUAVE
// ========================
document.querySelector('.button-list')?.addEventListener('click', function(e) {
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

      const easeInOut = t => t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;

      function scrollStep(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;
        const eased = easeInOut(Math.min(progress, 1));
        window.scrollTo(0, start + distance * eased);

        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        } else {
          history.replaceState(null, null, `#${targetId}`);
        }
      }

      requestAnimationFrame(scrollStep);
    }
  }
});

// ========================
// 🚀 INICIALIZAÇÃO
// ========================
document.addEventListener('DOMContentLoaded', () => {
  inicializarAnimacoesDeScroll();
  configurarEnvioFormulario();

  const botaoBuscar = document.getElementById('botao-buscar');
  if (botaoBuscar) {
    botaoBuscar.addEventListener('click', () => buscar());
  }

  const datalist = document.getElementById("listaCidades");
  datalist.innerHTML = '';
  Object.keys(cidades_brasileiras).forEach(cidade => {
    const option = document.createElement("option");
    option.value = cidade;
    datalist.appendChild(option);
  });
});

setTimeout(() => {
  mapa.invalidateSize();
}, 500);

mapa.scrollWheelZoom.disable();
