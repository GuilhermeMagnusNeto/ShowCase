document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    // Verifica se há um userId válido
    if (userId) {
        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Store/GetAllStoresByUserId/${userId}`;

                // Faz a solicitação para obter os detalhes da loja
                axios.get(apiUrl)
                    .then((response) => {
                        if (response.status === 200 && response.data.statusCode === 200) {
                            // PEGAR AQUI O storeId para criar uma nova vitrine
                            const storeId = response.data.data[0].id;
                            const storeName = response.data.data[0].name;

                            const lojaTronicElement = document.querySelector('.d-flex.justify-content-center.mb-0.mt-3');

                            if (lojaTronicElement) {
                                lojaTronicElement.textContent = storeName;
                            }


                            const searchUrl = `https://showcase-api.azurewebsites.net/api/v1/StoreProduct/GetAllProductsByStoreId/${storeId}`;

                            // Fazer uma solicitação ao banco de dados para obter a lista de produtos
                            axios.get(searchUrl)
                            .then(function (response) {
                                const produtos = response.data.data; //Lista de Produtos
                                const produtosLista = document.getElementById("produtosLista");

                                //Iterar sobre os produtos e criar elementos <li> para cada um
                                produtos.forEach(function (produto) {
                                    const li = document.createElement("li");
                                    li.innerHTML = `<p class="dropdown-item" id="${produto.id}">${produto.name}</p>`;
                                    produtosLista.appendChild(li);

                                    // Adicione um evento de clique para cada produto
                                    li.addEventListener("click", function () {
                                        // Crie uma cópia do elemento do produto
                                        const productCard = createProductCard(produto);

                                        // Encontre a div "m-2" na página CriacaoDaVitrine.html
                                        const m2Div = document.querySelector('.m-2');

                                        // Insira o produto na div "m-2"
                                        m2Div.appendChild(productCard);
                                    });
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        }
                        else {
                            console.log("Erro para pegar storeId:", response.data);
                        }
                    });    
    } else {
        console.log("UserId não encontrado na URL.");
    }

    if (userId) {
        const apiUrl2 = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetAllTemplates`;

            // Faz a solicitação para obter os modelos das vitrines
            axios.get(apiUrl2)
                .then((response) => {
                    if (response.status === 200 && response.data.statusCode === 200) {
                        const vitrines = response.data.data; //Lista de vitrines
                            const modeloVitrine = document.getElementById("modelosVitrines");
                            var contagem = 1;
                            //Iterar sobre os vitrine e criar elementos <li> para cada um
                            vitrines.forEach(function (vitrine) {
                                if (contagem === 1) {
                                    const link = document.createElement("a");
                                    link.id = vitrine.id;
                                    link.innerHTML = `<i class="bi bi-window-stack" style="color: #F0A732; font-size: xx-large;"></i>`;
                                    modeloVitrine.appendChild(link);
                                    contagem++;

                                    // Adicione um ouvinte de evento de clique a esta tag <a>
                                    link.addEventListener("click", function (event) {
                                        event.preventDefault(); // Impede que o link redirecione imediatamente
                                        //ADICIONAR CÓDIGO DE EDIÇÃO DE ESTILO AQUI
                                        const urlParams = new URLSearchParams(window.location.search);
                                        const id = urlParams.get("id");
                                        const novaURL = `./CriacaoDaVitrine.html?id=${id}`;
                                        window.location.href = novaURL;
                                    });
                                } else if (contagem === 2) {
                                    const link = document.createElement("a");
                                    link.id = vitrine.id;
                                    link.innerHTML = `<i class="bi bi-window-stack mx-3" style="color: #F0A732; font-size: xx-large;"></i>`;
                                    modeloVitrine.appendChild(link);
                                    contagem++;

                                    // Adicione um ouvinte de evento de clique a esta tag <a>
                                    link.addEventListener("click", function (event) {
                                        event.preventDefault(); // Impede que o link redirecione imediatamente
                                        //ADICIONAR CÓDIGO DE EDIÇÃO DE ESTILO AQUI
                                        const urlParams = new URLSearchParams(window.location.search);
                                        const id = urlParams.get("id");
                                        const novaURL = `./CriacaoDaVitrine2.html?id=${id}`;
                                        window.location.href = novaURL;
                                    });
                                }
                            });
                    }
                    else {
                        console.log("Erro para pegar storeId:", response.data);
                    }
                });    
    } else {
        console.log("UserId não encontrado na URL.");
    }
});

// Função para criar um elemento de produto
function createProductCard(produto) {
    const productCard = document.createElement("div");
    productCard.className = "card mb-2 bg-dark";
    productCard.id=produto.id;
    productCard.style = "color: aqua; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to left, rgb(0, 81, 156), black);background-blend-mode: overlay; border-radius: 40px; border-top-right-radius: 80px; border-bottom-right-radius: 200px;";

    // Defina o conteúdo do cartão do produto com base nos dados do produto
    productCard.innerHTML = `
        <div class="row g-0 p-3">
            <div class="col-md-3 p-2">
                <img src="${produto.imageUrl}" class="card-img-top img-fluid" alt="${produto.name}">
            </div>
            <div class="col-md-8 pt-0 ps-3 mt-3">
                <div class="card-body py-0">
                    <h2 class="card-title" style="color: white;">${produto.name}</h2>
                    <h5 class="card-text mb-3" style="color: deepskyblue;">Valor: R$:${produto.value} av<br>ou R$:${produto.value} em até 12x</h5>
                    <h5 class="card-text" style="color: white;">Descrição: ${produto.sku}</h5>
                </div>
                <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                    <a href="#" class="btn btn-primary">Quero Este!</a>
                    <button class="btn btn-danger ms-5 btn-excluir" data-produto-id="${produto.id}">Excluir</button>
                </div>
            </div>
        </div>
    `;

    return productCard;
}

// Adicione um ouvinte de evento para os botões de exclusão
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-excluir")) {
        const produtoId = event.target.getAttribute("data-produto-id");
        excluirProduto(produtoId);
    }
});

function excluirProduto(produtoId) {
    console.log(`Excluir produto com ID: ${produtoId}`);
    
    // COLOCAR CODIGO PARA REMOVER PRODUTO DA VITRINE AQUI.
    const produtoElement = document.getElementById(produtoId);
    if (produtoElement) {
        produtoElement.remove();
    } else {
    }
}
