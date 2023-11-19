document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("userId");
    //carrrega lista de produtos
    if (userId) {
        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Store/GetAllStoresByUserId/${userId}`;

        // Faz a solicitação para obter os detalhes da loja
        axios.get(apiUrl)
            .then((response) => {
                if (response.status === 200 && response.data.statusCode === 200) {
                    const storeId = response.data.data[0].id;
                    const storeName = response.data.data[0].name;
                    const storeImageURL = response.data.data[0].urlStoreLogo;
                    console.log(response.data.data);
                    const lojaTronicElements = document.querySelector('.col-md-4.d-flex.flex-column.justify-content-center');

                    const imagemElement = document.createElement("img");
                    imagemElement.src = storeImageURL; // Defina o link da imagem
                    imagemElement.className = "img-fluid";
                    imagemElement.alt = "Logo Loja";
                    lojaTronicElements.appendChild(imagemElement);

                    const h3Element = document.createElement("h3");
                    h3Element.className = "d-flex justify-content-center mb-0 mt-3";
                    h3Element.textContent = storeName;
                    lojaTronicElements.appendChild(h3Element);

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
                                    vincularProduto(produto);

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
        console.log("UserId não encontrado");
    }

    //cria botões de modelos da vitrine
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
                            link.className = "me-3"
                            link.innerHTML = `<i class="bi bi-window-stack" style="color: #F0A732; font-size: xx-large;"></i>`;
                            modeloVitrine.appendChild(link);
                            contagem++;
                            // Adicione um ouvinte de evento de clique a esta tag <a>
                            link.addEventListener("click", function (event) {
                                event.preventDefault(); // Impede que o link redirecione imediatamente

                                const showcaseId = localStorage.getItem("showcaseId");
                                const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;
                                    axios.request(apiUrl)
                                        .then(async (response) => {
                                            if (response.status === 200 && response.data.statusCode === 200) {
                                                const id = response.data.data.id;
                                                const templateId = vitrines[0].id;
                                                const backgroundColorCode = response.data.data.backgroundColorCode;
                                                const showProductValue = response.data.data.showProductValue;
                                                const showStoreLogo = response.data.data.showStoreLogo;
                                                const redirectLink = response.data.data.redirectLink;

                                                const postData = {
                                                    showcaseStyleId: id,
                                                    templateId: templateId,
                                                    backgroundColor: backgroundColorCode,
                                                    showProductValue: Boolean(showProductValue),
                                                    showStoreLogo: Boolean(showStoreLogo),
                                                    redirectLink: redirectLink,
                                                };
                                            
                                                let data = JSON.stringify({
                                                    "showcaseStyleId": postData.showcaseStyleId,
                                                    "templateId": postData.templateId,
                                                    "backgroundColorCode": postData.backgroundColor,
                                                    "showProductValue": postData.showProductValue,
                                                    "showStoreLogo": postData.showStoreLogo,
                                                    "redirectLink": postData.redirectLink
                                                });
                                            
                                                let config = {
                                                    method: 'put',
                                                    maxBodyLength: Infinity,
                                                    url: 'https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': ''
                                                    },
                                                    data: data
                                                };
                                            
                                                axios.request(config)
                                                    .then((response) => {
                                                        const novaURL = `./CriacaoDaVitrine.html`;
                                                        window.location.href = novaURL;
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    });

                                            }
                                            else{
                                                console.log(response.data);
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                            });
                        } else if (contagem === 2) {
                            const link = document.createElement("a");
                            link.id = vitrine.id;
                            link.className = "me-3"
                            link.innerHTML = `<i class="bi bi-window-stack" style="color: #F0A732; font-size: xx-large;"></i>`;
                            modeloVitrine.appendChild(link);
                            contagem++;
                            // Adicione um ouvinte de evento de clique a esta tag <a>
                            link.addEventListener("click", function (event) {
                                event.preventDefault(); // Impede que o link redirecione imediatamente

                                const showcaseId = localStorage.getItem("showcaseId");
                                const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;
                                    axios.request(apiUrl)
                                        .then(async (response) => {
                                            if (response.status === 200 && response.data.statusCode === 200) {
                                                const id = response.data.data.id;
                                                const templateId = vitrines[1].id;
                                                const backgroundColorCode = response.data.data.backgroundColorCode;
                                                const showProductValue = response.data.data.showProductValue;
                                                const showStoreLogo = response.data.data.showStoreLogo;
                                                const redirectLink = response.data.data.redirectLink;

                                                const postData = {
                                                    showcaseStyleId: id,
                                                    templateId: templateId,
                                                    backgroundColor: backgroundColorCode,
                                                    showProductValue: Boolean(showProductValue),
                                                    showStoreLogo: Boolean(showStoreLogo),
                                                    redirectLink: redirectLink,
                                                };
                                            
                                                let data = JSON.stringify({
                                                    "showcaseStyleId": postData.showcaseStyleId,
                                                    "templateId": postData.templateId,
                                                    "backgroundColorCode": postData.backgroundColor,
                                                    "showProductValue": postData.showProductValue,
                                                    "showStoreLogo": postData.showStoreLogo,
                                                    "redirectLink": postData.redirectLink
                                                });
                                            
                                                let config = {
                                                    method: 'put',
                                                    maxBodyLength: Infinity,
                                                    url: 'https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': ''
                                                    },
                                                    data: data
                                                };
                                            
                                                axios.request(config)
                                                    .then((response) => {
                                                        const novaURL = `./CriacaoDaVitrine2.html`;
                                                        window.location.href = novaURL;
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    });

                                            }
                                            else{
                                                console.log(response.data);
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                            });
                        }
                    });
                }
                else {
                    console.log("Erro para pegar storeId:", response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        
        const showcaseId = localStorage.getItem("showcaseId");
        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;

        axios.get(apiUrl)
            .then((response) => {
                if (response.status === 200 && response.data.statusCode === 200) {
                    const backgroundColor = response.data.data.backgroundColorCode;

                    //ADICIONAR COR
                    var botaoCor = document.querySelector('#colorPicker');
                    botaoCor.value = backgroundColor;

                    //Adiciona botões de valor, imagem e alterar estilo
                    const showStoreLogo = response.data.data.showStoreLogo;
                    const showProductValue = response.data.data.showProductValue;

                    const modeloBotoes = document.getElementById("modeloBotoes");

                    console.log(modeloBotoes);
                    if(showProductValue === true){
                        const link = document.createElement("div");
                        link.className = "form-check form-switch me-4";
                        link.innerHTML = `<input class="form-check-input" type="checkbox" id="checkbox1" checked>
                        <label class="form-check-label" for="checkbox1" style="color: #F0A732;">Valor</label>`;
                        modeloBotoes.appendChild(link);
                    }
                    else{
                        const link = document.createElement("div");
                        link.className = "form-check form-switch me-4";
                        link.innerHTML = `<input class="form-check-input" type="checkbox" id="checkbox1">
                        <label class="form-check-label" for="checkbox1" style="color: #F0A732;">Valor</label>`;
                        modeloBotoes.appendChild(link);
                    }
                    if(showStoreLogo === true){
                        const link = document.createElement("div");
                        link.className = "form-check form-switch me-4";
                        link.innerHTML = `<input class="form-check-input" type="checkbox" id="checkbox2" checked>
                        <label class="form-check-label" for="checkbox2" style="color: #F0A732;">Imagem</label>`;
                        modeloBotoes.appendChild(link);
                    }
                    else{
                        const link = document.createElement("div");
                        link.className = "form-check form-switch me-4";
                        link.innerHTML = `<input class="form-check-input" type="checkbox" id="checkbox2">
                        <label class="form-check-label" for="checkbox2" style="color: #F0A732;">Imagem</label>`;
                        modeloBotoes.appendChild(link);
                    }

                    const link = document.createElement("button");
                    link.id = "alterarEstilo";
                    link.className = "btn btn-warning send-styles";
                    link.innerHTML = `Alterar estilo`;
                    modeloBotoes.appendChild(link);

                    link.addEventListener("click", function (event) {
                        console.log("teste");

                        const showcaseId = localStorage.getItem("showcaseId");
                        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;
                            axios.request(apiUrl)
                                .then(async (response) => {
                                    const id = response.data.data.id;
                                    const templateId = response.data.data.templateId;
                                    const checkbox1 = document.getElementById("checkbox1");
                                    const checkbox2 = document.getElementById("checkbox2");
                                    const backgroundColorCode = colorPicker.value;
                                    const showProductValue = checkbox1.checked;
                                    const showStoreLogo = checkbox2.checked;
                                    let redirectLink = response.data.data.redirectLink;

                                    if(response.data.data.redirectLink === null){
                                        redirectLink = "";
                                    }

                                    const postData = {
                                        showcaseStyleId: id,
                                        templateId: templateId,
                                        backgroundColor: backgroundColorCode,
                                        showProductValue: Boolean(showProductValue),
                                        showStoreLogo: Boolean(showStoreLogo),
                                        redirectLink: redirectLink,
                                    };
                                
                                    let data = JSON.stringify({
                                        "showcaseStyleId": postData.showcaseStyleId,
                                        "templateId": postData.templateId,
                                        "backgroundColorCode": postData.backgroundColor,
                                        "showProductValue": postData.showProductValue,
                                        "showStoreLogo": postData.showStoreLogo,
                                        "redirectLink": postData.redirectLink
                                    });
                                
                                    let config = {
                                        method: 'put',
                                        maxBodyLength: Infinity,
                                        url: 'https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': ''
                                        },
                                        data: data
                                    };
                                
                                    axios.request(config)
                                        .then((response) => {
                                            console.log("ESTILO ALTERADO COM SUCESSO!");
                                            location.reload();
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                    });

                }
                else {
                    console.log("Erro para pegar Showcase Style:", response.data);
                }


            })
            .catch(function (error) {
                console.log(error);
            });

    } else {
        console.log("UserId não encontrado");
    }

    //Carregar produtos da vitrine
    if (userId) {
        const showcaseId = localStorage.getItem("showcaseId");
        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseProduct/GetProductsByShowcaseId/${showcaseId}`;
        axios.request(apiUrl)
            .then(async (response) => {
                if (response.status === 200 && response.data.statusCode === 200) {
                    const array = response.data.data;
                    var arrayIds = [];
                    for (const item of array) {
                        var produtoId = item.storeProductId;
                        arrayIds.push(produtoId);
                    }
                    var arrayProdutos = [];


                    const showcaseId = localStorage.getItem("showcaseId");

                    const searchUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;
                    let showProductValue, showStoreLogo, backgroundColor, redirectLink;
                    axios.get(searchUrl)
                        .then(async function (response) {
                            if (response.status === 200 && response.data.statusCode === 200) {
                                if (response.data.data.showProductValue == true) {
                                    showProductValue = true;
                                }
                                else {
                                    showProductValue = false;
                                }
                                if (response.data.data.showStoreLogo === true) {
                                    showStoreLogo = true;
                                }
                                else {
                                    showStoreLogo = false;
                                }
                                backgroundColor = response.data.data.backgroundColorCode;
                                if (backgroundColor === null) {
                                    backgroundColor = "#F0A732";
                                }
                            }
                            else {
                                console.log("Erro: ", response.data);
                            }
                            redirectLink = response.data.data.redirectLink;



    
                            for (const id of arrayIds) {
                                const apiUrl2 = `https://showcase-api.azurewebsites.net/api/v1/StoreProduct/GetProductById/${id}`;
                                try {
                                    const response = await axios.request(apiUrl2);
                                    const product = response.data.data;
        
                                    // Crie uma cópia do elemento do produto
                                    const productCard = createProductCard(product, backgroundColor, showProductValue, showStoreLogo, redirectLink);
        
                                    // Encontre a div "m-2" na página CriacaoDaVitrine.html
                                    const m2Div = document.querySelector('.m-2');
        
                                    // Insira o produto na div "m-2"
                                    m2Div.appendChild(productCard);
        
                                    // Guarde os produtos na ordem em que são processados
                                    arrayProdutos.push(product);
                                } catch (error) {
                                    console.log(error);
                                }
                            }


                            
                        });
                } else {
                    console.log(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    else {
        console.log("UserId não encontrado");
    }

    //Carrega link da vitrine
    if(userId){
        const showcaseId = localStorage.getItem("showcaseId");
        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Showcase/GetById/${showcaseId}`;
        axios.request(apiUrl)
            .then(async (response) => {
                if (response.status === 200 && response.data.statusCode === 200) {
                    const uniqueLink = response.data.data.uniqueLink;
                    const lojaTronicElements = document.querySelector('.d-flex.justify-content-center.mb-2');
                    lojaTronicElements.textContent = `Link da sua vitrine para divulgação: ${uniqueLink}`
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    else{
        console.log("UserId não encontrado")
    }
});

//Adicionar produto na vitrine
function vincularProduto(produto) {
    const showcaseId = localStorage.getItem("showcaseId");
    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseProduct/GetProductsByShowcaseId/${showcaseId}`;
    axios.request(apiUrl)
        .then(async (response) => {
            if (response.status === 200 && response.data.statusCode === 200) {
                const array = [];
                for(const ids of response.data.data){
                    array.push(ids.storeProductId);
                }
                array.push(produto.id);

                // Armazena o array no localStorage após serializá-lo para JSON
                localStorage.setItem("array", JSON.stringify(array));

                const Data = {
                    showcaseId: showcaseId,
                    productIds: array // Usa o array atualizado
                };

                let data = JSON.stringify(Data);

                let config = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: 'https://showcase-api.azurewebsites.net/api/v1/ShowcaseProduct',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ''
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        console.log("Produto adicionado!");
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Função para criar um elemento de produto
function createProductCard(produto, backgroundColor, showProductValue, showStoreLogo, redirectLink) {
    const productCard = document.createElement("div");
    productCard.className = "card mb-2 bg-dark";
    productCard.id = produto.id;

    const cor = `color: ${backgroundColor}; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to left, ${backgroundColor}, black);background-blend-mode: overlay; border-radius: 40px; border-top-right-radius: 80px; border-bottom-right-radius: 200px;`;
    productCard.style = cor;

    if (showProductValue === true && showStoreLogo === true) {
        // Defina o conteúdo do cartão do produto com base nos dados do produto
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-3 p-2">
                    <img src="${produto.urlProductPicture}" class="card-img-top img-fluid" alt="${produto.name}">
                </div>
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text mb-3" style="color: ${backgroundColor};">Valor: R$${produto.value} av<br>ou R$${produto.value} em até 12x</h5>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.sku}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                        <button class="btn btn-danger ms-5 btn-excluir" data-produto-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `;
        return productCard;
    }
    else if (showProductValue === false && showStoreLogo === true) {
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-3 p-2">
                    <img src="${produto.urlProductPicture}" class="card-img-top img-fluid" alt="${produto.name}">
                </div>
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.sku}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                        <button class="btn btn-danger ms-5 btn-excluir" data-produto-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        return productCard;
    }
    else if (showProductValue === true && showStoreLogo === false) {
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text mb-3" style="color: ${backgroundColor};">Valor: R$${produto.value} av<br>ou R$${produto.value} em até 12x</h5>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.sku}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                        <button class="btn btn-danger ms-5 btn-excluir" data-produto-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        return productCard;
    }
    else if (showProductValue === false && showStoreLogo === false) {
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.sku}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                        <button class="btn btn-danger ms-5 btn-excluir" data-produto-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        return productCard;
    }

}

// Adicione um ouvinte de evento para os botões de exclusão
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-excluir")) {
        const produtoId = event.target.getAttribute("data-produto-id");
        excluirProduto(produtoId);
    }
});

function excluirProduto(produtoId) {
    const showcaseId = localStorage.getItem("showcaseId");
    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseProduct/GetProductsByShowcaseId/${showcaseId}`;
    axios.request(apiUrl)
        .then(async (response) => {
            if (response.status === 200 && response.data.statusCode === 200) {
                const array = [];
                for(const ids of response.data.data){
                    array.push(ids.storeProductId);
                }
                var contador = 0;

                for (let i = 0; i < array.length; i++) {
                    if (array[i] === produtoId) {
                        array.splice(i, 1); // Remove o elemento encontrado
                        break;
                    } else {
                        console.log("Nenhum produto encontrado!");
                    }
                }
                const Data = {
                    showcaseId: showcaseId,
                    productIds: array// Usa o array atualizado
                };

                let data = JSON.stringify(Data);

                let config = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: 'https://showcase-api.azurewebsites.net/api/v1/ShowcaseProduct',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ''
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        const produtoElement = document.getElementById(produtoId);
                        if (produtoElement) {
                            produtoElement.remove();
                        } else {
                            console.log("Erro ao retirar produto da pagina");
                        } // Correção no nome do método
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
}

//Altera Link
const alterarLink = document.querySelector(".send-link");

alterarLink.addEventListener("click", function(){
    const showcaseId = localStorage.getItem("showcaseId");
    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;
        axios.request(apiUrl)
            .then(async (response) => {
                if (response.status === 200 && response.data.statusCode === 200) {

                    const id = response.data.data.id;
                    const templateId = response.data.data.templateId;
                    const backgroundColorCode = response.data.data.backgroundColorCode;
                    const showProductValue = response.data.data.showProductValue;
                    const showStoreLogo = response.data.data.showStoreLogo;
                    const novoLink = document.getElementById("linkBotao");
                    let redirectLink = novoLink.value;

                    if(response.data.data.redirectLink === null){
                        redirectLink = "";
                    }

                    const postData = {
                        showcaseStyleId: id,
                        templateId: templateId,
                        backgroundColor: backgroundColorCode,
                        showProductValue: Boolean(showProductValue),
                        showStoreLogo: Boolean(showStoreLogo),
                        redirectLink: redirectLink,
                    };
                
                    let data = JSON.stringify({
                        "showcaseStyleId": postData.showcaseStyleId,
                        "templateId": postData.templateId,
                        "backgroundColorCode": postData.backgroundColor,
                        "showProductValue": postData.showProductValue,
                        "showStoreLogo": postData.showStoreLogo,
                        "redirectLink": postData.redirectLink
                    });
                
                    let config = {
                        method: 'put',
                        maxBodyLength: Infinity,
                        url: 'https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ''
                        },
                        data: data
                    };
                
                    axios.request(config)
                        .then((response) => {
                            console.log("LINK ALTERADO COM SUCESSO!");
                            location.reload();
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                }
                else{
                    console.log(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
})