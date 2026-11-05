const selectMarca = document.getElementById('marca');
const selectModelo = document.getElementById('modelo');
const selectAno = document.getElementById('ano');
const loading = document.getElementById('loading');
const resultado = document.getElementById('resultado');

// 2. Funções auxiliares para controlar o elemento de processamento (Loading)
function mostrarLoading() {
    loading.classList.remove('oculto');
}

function esconderLoading() {
    loading.classList.add('oculto');
}
async function carregarMarcas() {
    try {
        mostrarLoading(); // Mostra o loading antes de disparar a requisição

        // Faz a requisição HTTP GET para a BrasilAPI
        const resposta = await fetch('https://brasilapi.com.br/api/fipe/marcas/v1/carros');

        // Converte a resposta em formato JSON
        const marcas = await resposta.json();

        // Limpa opções anteriores e deixa a opção padrão
        selectMarca.innerHTML = '<option value="">Selecione uma marca...</option>';

        // Percorre cada marca da lista e cria uma tag <option> dentro do <select>
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.valor; // Código que a FIPE usa (ex: "21")
            option.textContent = marca.nome; // Nome visível para o usuário (ex: "Fiat")
            selectMarca.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar marcas:', erro);
        alert('Erro ao carregar as marcas. Verifique sua conexão.');
    } finally {
        esconderLoading(); // O loading SEMPRE é escondido ao terminar, com sucesso ou erro!
    }
}
carregarMarcas();

async function carregarModelos(codigoMarca) {
    try {
        mostrarLoading();

        const resposta = await fetch(`https://brasilapi.com.br/api/fipe/veiculos/v1/carros/${codigoMarca}`);
        const modelos = await resposta.json();

        // Habilita o select e adiciona a opção inicial
        selectModelo.disabled = false;
        selectModelo.innerHTML = '<option value="">Selecione um modelo...</option>';

        // Preenche as opções de modelos
        modelos.forEach(item => {
            const option = document.createElement('option');
            option.value = item.valor;       // Código do modelo (ex: "5585")
            option.textContent = item.modelo; // Nome do modelo (ex: "AMAROK...")
            selectModelo.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar modelos:', erro);
        alert('Erro ao buscar os modelos desta marca.');
    } finally {
        esconderLoading();
    }
}

// 6. Ouvinte de evento: quando o usuário troca a marca selecionada
selectMarca.addEventListener('change', () => {
    const codigoMarca = selectMarca.value;

    // Limpa e reseta os selects dependentes
    selectModelo.innerHTML = '<option value="">Selecione o modelo...</option>';
    selectModelo.disabled = true;
    selectAno.innerHTML = '<option value="">Selecione o ano...</option>';
    selectAno.disabled = true;
    resultado.classList.add('oculto'); // Esconde resultado anterior, se houver

    // Se o usuário selecionou uma marca real, busca os modelos
    if (codigoMarca) {
        carregarModelos(codigoMarca);
    }
});
async function carregarAnos(codigoMarca, codigoModelo) {
    try {
        mostrarLoading();

        const resposta = await fetch(`https://brasilapi.com.br/api/fipe/anos/v1/carros/${codigoMarca}/${codigoModelo}`);
        const anos = await resposta.json();

        selectAno.disabled = false;
        selectAno.innerHTML = '<option value="">Selecione o ano...</option>';

        anos.forEach(item => {
            const option = document.createElement('option');
            option.value = item.valor;       // Código do ano (ex: "2011-3")
            option.textContent = item.nome;  // Nome legível (ex: "2011 Diesel")
            selectAno.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar anos:', erro);
        alert('Erro ao buscar os anos deste modelo.');
    } finally {
        esconderLoading();
    }
}

// 8. Ouvinte de evento: quando o usuário troca o modelo selecionado
selectModelo.addEventListener('change', () => {
    const codigoMarca = selectMarca.value;
    const codigoModelo = selectModelo.value;

    selectAno.innerHTML = '<option value="">Selecione o ano...</option>';
    selectAno.disabled = true;
    resultado.classList.add('oculto');

    if (codigoModelo) {
        carregarAnos(codigoMarca, codigoModelo);
    }
});
// 9. Função que busca os detalhes e o preço FIPE
async function carregarPreco(codigoMarca, codigoModelo, codigoAno) {
    try {
        mostrarLoading();
        resultado.classList.add('oculto'); // Oculta resultado anterior enquanto busca novo

        const resposta = await
            fetch(`https://brasilapi.com.br/api/fipe/detalhes/v1/carros/${codigoMarca}/${codigoModelo}/${codigoAno}`);
        const dados = await resposta.json();

        // Monta o cartão com os dados recebidos da API
        resultado.innerHTML = `
          <h2>${dados.modelo}</h2>
          <p><strong>Marca:</strong> ${dados.marca}</p>
          <p><strong>Ano Modelo:</strong> ${dados.anoModelo}</p>
          <p><strong>Combustível:</strong> ${dados.combustivel}</p>
          <p><strong>Código FIPE:</strong> ${dados.codigoFipe}</p>
          <p><strong>Mês de Referência:</strong> ${dados.mesReferencia}</p>
          <h3 style="color: #2e7d32; font-size: 1.5rem; margin-top: 10px;">
            Valor: ${dados.valor}
          </h3>
        `;

        // Torna a caixa de resultado visível
        resultado.classList.remove('oculto');

    } catch (erro) {
        console.error('Erro ao consultar preço:', erro);
        alert('Erro ao consultar o valor deste veículo.');
    } finally {
        esconderLoading();
    }
}

// 10. Ouvinte de evento: quando o usuário escolhe o ano/versão
selectAno.addEventListener('change', () => {
    const codigoMarca = selectMarca.value;
    const codigoModelo = selectModelo.value;
    const codigoAno = selectAno.value;

    if (codigoAno) {
        carregarPreco(codigoMarca, codigoModelo, codigoAno);
    } else {
        resultado.classList.add('oculto');
    }
});