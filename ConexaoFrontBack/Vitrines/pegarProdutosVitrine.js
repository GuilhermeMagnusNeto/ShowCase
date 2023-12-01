document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const exclusiveCode = urlParams.get('ExclusiveCode');

    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Showcase/GetByExclusiveCode/${exclusiveCode}`;
        axios.get(apiUrl)
            .then(function (response) { 
                if (response.status === 200 && response.data.statusCode === 200) {
                    const showcaseId = response.data.data.id;
                    localStorage.setItem("showcaseId", showcaseId);
                    const storeId = response.data.data.storeId;

                    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Store/GetById/${storeId}`;
                    axios.get(apiUrl)
                        .then(function (response) {
                            if (response.status === 200 && response.data.statusCode === 200){
                                const storeName = response.data.data.name;
                                const storeImageURL = response.data.data.urlStoreLogo;
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
                            }
                            else {
                                console.log("Erro:", response.data);
                            }
                        })
                        .catch(function (error) {
                            console.log("Erro na solicitação:", error);
                        });

                        const searchUrl = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${showcaseId}`;
                        axios.get(searchUrl)
                            .then(function (response) {
                                if (response.status === 200 && response.data.statusCode === 200) {
                                    if (response.data.data.showProductValue == true) {
                                        localStorage.setItem("showProductValue", true);
                                    }
                                    else {
                                        localStorage.setItem("showProductValue", false);
                                    }
                                    if (response.data.data.showStoreLogo === true) {
                                        localStorage.setItem("showStoreLogo", true);
                                    }
                                    else {
                                        localStorage.setItem("showStoreLogo", false);
                                    }
                                    const backgroundColor = response.data.data.backgroundColorCode;
                                    if (backgroundColor === null) {
                                        const backgroundColor = "#F0A732";
                                        localStorage.setItem("backgroundColor", backgroundColor);
                                    }
                                    else {
                                        localStorage.setItem("backgroundColor", backgroundColor);
                                    }
                                }
                                else {
                                    const backgroundColor = "#F0A732";
                                    localStorage.setItem("backgroundColor", backgroundColor);
                                }
                                
                                const templateName = response.data.data.templateName;
                                const redirectLink = response.data.data.redirectLink;
                                localStorage.setItem("redirectLink", redirectLink);

                                if(templateName === "Listagem na Vertical"){
                                    const apiUrl2 = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseProduct/GetProductsByShowcaseId/${showcaseId}`;
                                    axios.request(apiUrl2)
                                        .then(async (response) => {
                                            if (response.status === 200 && response.data.statusCode === 200) {
                                                const array = response.data.data;
                                                var arrayIds = [];
                                                for (const item of array) {
                                                    var produtoId = item.storeProductId;
                                                    arrayIds.push(produtoId);
                                                }
                                                var arrayProdutos = [];
                                                for (const id of arrayIds) {
                                                    const apiUrl2 = `https://showcase-api.azurewebsites.net/api/v1/StoreProduct/GetProductById/${id}`;
                                                    try {
                                                        const response = await axios.request(apiUrl2);
                                                        const product = response.data.data;

                                                        // Crie uma cópia do elemento do produto
                                                        const productCard = createProductCard(product);

                                                        // Encontre a div "m-2" na página CriacaoDaVitrine.html
                                                        const m2Div = document.querySelector('.m-2');

                                                        // Insira o produto na div "m-2"
                                                        m2Div.appendChild(productCard);

                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }
                                            } else {
                                                console.log(response.data);
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                }
                                else if(templateName === "Listagem na Horizontal"){
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
                                                for (const id of arrayIds) {
                                                    const apiUrl2 = `https://showcase-api.azurewebsites.net/api/v1/StoreProduct/GetProductById/${id}`;
                                                    try {
                                                        const response = await axios.request(apiUrl2);
                                                        const product = response.data.data;

                                                        // Crie uma cópia do elemento do produto
                                                        const productCard = createProductCard2(product);

                                                        // Encontre a div "m-2" na página CriacaoDaVitrine.html
                                                        const Div = document.querySelector('.row.mx-auto');

                                                        // Insira o produto na div "m-2"
                                                        Div.appendChild(productCard);

                                                        // Guarde os produtos na ordem em que são processados
                                                        arrayProdutos.push(product);
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }
                                            } else {
                                                console.log(response.data);
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                }
                            });

                }
                else {
                    console.log("Erro:", response.data);
                }
            })
            .catch(function (error) {
                console.log("Erro na solicitação:", error);
            });

});

// Função para criar um elemento de produto
function createProductCard(produto) {
    const productCard = document.createElement("div");
    productCard.className = "card mb-2 bg-dark";
    productCard.id = produto.id;

    //MUDAR A COR AQUI
    const backgroundColor = localStorage.getItem("backgroundColor");
    const showProductValue = localStorage.getItem("showProductValue");
    const showStoreLogo = localStorage.getItem("showStoreLogo");
    const redirectLink = localStorage.getItem("redirectLink");

    const cor = `color: ${backgroundColor}; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to left, ${backgroundColor}, black);background-blend-mode: overlay; border-radius: 40px; border-top-right-radius: 80px; border-bottom-right-radius: 200px;`;
    productCard.style = cor;


    if (showProductValue === "true" && showStoreLogo === "true") {
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
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.description}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                    </div>
                </div>
            </div>
        `;
        return productCard;
    }
    else if (showProductValue === "false" && showStoreLogo === "true") {
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-3 p-2">
                    <img src="${produto.urlProductPicture}" class="card-img-top img-fluid" alt="${produto.name}">
                </div>
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.description}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                    </div>
                </div>
            </div>
        `;

        return productCard;
    }
    else if (showProductValue === "true" && showStoreLogo === "false") {
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text mb-3" style="color: ${backgroundColor};">Valor: R$${produto.value} av<br>ou R$${produto.value} em até 12x</h5>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.description}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                    </div>
                </div>
            </div>
        `;

        return productCard;
    }
    else if (showProductValue === "false" && showStoreLogo === "false") {
        productCard.innerHTML = `
            <div class="row g-0 p-3">
                <div class="col-md-8 pt-0 ps-3 mt-3">
                    <div class="card-body py-0">
                        <h2 class="card-title" style="color: white;">${produto.name}</h2>
                        <h5 class="card-text" style="color: white;">Descrição: ${produto.description}</h5>
                    </div>
                    <div class="card-footer d-flex mt-3 justify-content-start" style="color: white; border: none; background: none;">
                        <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                    </div>
                </div>
            </div>
        `;

        return productCard;
    }

}

// Função para criar um elemento de produto
function createProductCard2(produto) {
    const customProductCard = document.createElement("div");
    customProductCard.className = "col-md-4 mb-2";
    customProductCard.id=produto.id;

    //MUDAR A COR AQUI
    const backgroundColor = localStorage.getItem("backgroundColor");
    const showProductValue = localStorage.getItem("showProductValue");
    const showStoreLogo = localStorage.getItem("showStoreLogo");
    const redirectLink = localStorage.getItem("redirectLink");

    if(showProductValue === "true" && showStoreLogo === "true"){
        // Defina o conteúdo do cartão do produto com base nos dados do produto
        customProductCard.innerHTML = `
            <div class="text-decoration-none border mx-1 w-100 p-3" style="color: white; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to top, ${backgroundColor}, black);background-blend-mode: overlay; border-radius: 40px;">
                <div class="d-flex justify-content-center">
                    <img src="${produto.urlProductPicture}" width="150px" class="my-2">
                </div>
                <div class="d-flex flex-column">
                    <h1>${produto.name}</h1>
                    <h5>Valor: R$${produto.value} av<br>ou R$${produto.value} em até 12x</h5>
                    <h6>Descrição: ${produto.description}</h6>
                </div>
                <div class="mt-3 d-flex justify-content-center" style="color: white; border: none; background: none;">
                    <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                </div>
            </div>
        `;

        return customProductCard;
    }
    else if(showProductValue === "false" && showStoreLogo === "true"){
        customProductCard.innerHTML = `
            <div class="text-decoration-none border mx-1 w-100 p-3" style="color: white; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to top, ${backgroundColor}, black);background-blend-mode: overlay; border-radius: 40px;">
                <div class="d-flex justify-content-center">
                    <img src="${produto.urlProductPicture}" width="150px" class="my-2">
                </div>
                <div class="d-flex flex-column">
                    <h1>${produto.name}</h1>
                    <h6>Descrição: ${produto.description}</h6>
                </div>
                <div class="mt-3 d-flex justify-content-center" style="color: white; border: none; background: none;">
                    <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                </div>
            </div>
        `;

        return customProductCard;
    }
    else if(showProductValue === "true" && showStoreLogo === "false"){
        customProductCard.innerHTML = `
            <div class="text-decoration-none border mx-1 w-100 p-3" style="color: white; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to top, ${backgroundColor}, black);background-blend-mode: overlay; border-radius: 40px;">
                <div class="d-flex flex-column">
                    <h1>${produto.name}</h1>
                    <h5>Valor: R$${produto.value} av<br>ou R$${produto.value} em até 12x</h5>
                    <h6>Descrição: ${produto.description}</h6>
                </div>
                <div class="mt-3 d-flex justify-content-center" style="color: white; border: none; background: none;">
                    <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                </div>
            </div>
        `;

        return customProductCard;
    }
    else if(showProductValue === "false" && showStoreLogo === "false"){
        customProductCard.innerHTML = `
            <div class="text-decoration-none border mx-1 w-100 p-3" style="color: white; background: url('../Imagens/backgroundTexture.png') repeat, linear-gradient(to top, ${backgroundColor}, black);background-blend-mode: overlay; border-radius: 40px;">
                <div class="d-flex flex-column">
                    <h1>${produto.name}</h1>
                    <h6>Descrição: ${produto.description}</h6>
                </div>
                <div class="mt-3 d-flex justify-content-center" style="color: white; border: none; background: none;">
                    <a href="${redirectLink}" class="btn btn-primary">Quero Este!</a>
                </div>
            </div>
        `;

        return customProductCard;
    }
}