document.addEventListener("DOMContentLoaded", function () {
    // Pegar userId da URL
    const userId = localStorage.getItem("userId");

    if (userId) {
        const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Store/GetAllStoresByUserId/${userId}`;
        axios.get(apiUrl)
            .then(function (response) {
                if (response.status === 200 && response.data.statusCode === 200) {
                    const storeId = response.data.data[0].id;

                    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Showcase/GetAllShowcasesByStoreId/${storeId}`;
                    axios.get(apiUrl)
                        .then(function (response) {
                            const vitrines = response.data.data; // Lista de vitrines

                            const vitrinesContainer = document.getElementById("vitrinesContainer");

                            // Iterar sobre as vitrines e criar a estrutura HTML para cada uma
                            vitrines.forEach(function (vitrine) {
                                // Crie a estrutura da vitrine
                                const colDiv = document.createElement("div");
                                colDiv.className = "col-md-2";
                                colDiv.id = vitrine.id;

                                const cardDiv = document.createElement("div");
                                cardDiv.className = "card mb-4";

                                const imgElement = document.createElement("img");
                                imgElement.className = "card-img-top";
                                imgElement.alt = "Logo Showcase";
                                imgElement.style.height = "225px";
                                imgElement.style.width = "100%";
                                imgElement.style.display = "block";
                                imgElement.src = "https://i.ibb.co/kh7hbb5/showcase-high-resolution-logo-transparent.png";

                                const cardBodyDiv = document.createElement("div");
                                cardBodyDiv.className = "card-body p-1";

                                const h5 = document.createElement("h5");
                                h5.textContent = vitrine.name;

                                const dFlexDiv = document.createElement("div");
                                dFlexDiv.className = "d-flex justify-content-around align-items-center";

                                const editarIcon = document.createElement("i");
                                editarIcon.className = "bi bi-pencil-square bi-2x";
                                editarIcon.style.fontSize = "x-large";

                                const excluirIcon = document.createElement("i");
                                excluirIcon.className = "bi bi-trash3 bi-2x";
                                excluirIcon.style.fontSize = "x-large";

                                excluirIcon.addEventListener("click", function () {
                                    // Ao clicar no ícone da lixeira, chame a função para excluir a vitrine
                                    excluirVitrine(vitrine.id);
                                });

                                // Adicione o evento de clique ao ícone de edição
                                editarIcon.addEventListener("click", function () {
                                    const urlIdTemplates = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetAllTemplates`;
                                    axios.get(urlIdTemplates)
                                    .then(function (response){
                                        const templatesLista = response.data.data; // Lista de templates
                                        templatesLista.forEach(function(template){

                                            const templateIdVitrine = `https://showcase-api.azurewebsites.net/api/v1/ShowcaseStyle/GetStyleByShowcaseId/${vitrine.id}`;
                                            axios.get(templateIdVitrine)
                                            .then(function (response){
                                                const templateName = response.data.data.templateName;
                                                if(templateName === "Listagem na Vertical"){
                                                    localStorage.setItem("showcaseId", vitrine.id);
                                                    const nextPage = `../../Paginas/CriacaoDaVitrine.html`;
                                                    window.location.href = nextPage;
                                                }
                                                else if(templateName === "Listagem na Horizontal"){
                                                    localStorage.setItem("showcaseId", vitrine.id);
                                                    const nextPage = `../../Paginas/CriacaoDaVitrine2.html`;
                                                    window.location.href = nextPage;
                                                }
                                            })
                                        })
                                    })
                                });

                                // Adicione os elementos ao DOM na hierarquia correta
                                dFlexDiv.appendChild(editarIcon);
                                dFlexDiv.appendChild(excluirIcon);

                                cardBodyDiv.appendChild(h5);
                                cardBodyDiv.appendChild(dFlexDiv);

                                cardDiv.appendChild(imgElement);
                                cardDiv.appendChild(cardBodyDiv);

                                colDiv.appendChild(cardDiv);

                                // Adicione a coluna da vitrine ao container de vitrines
                                vitrinesContainer.appendChild(colDiv);
                            });
                    })
                    .catch(function (error) {
                        console.log("Erro na solicitação:", error);
                    });
                } else {
                    console.log("Erro para pegar vitrines:", response.data);
                }
            })
            .catch(function (error) {
                console.log("Erro na solicitação:", error);
            });
    } else {
        console.log("UserId não encontrado na URL.");
    }
});

function excluirVitrine(vitrineId) {
    const apiUrl = `https://showcase-api.azurewebsites.net/api/v1/Showcase/${vitrineId}`;

    axios.delete(apiUrl)
        .then(function (response) {
            if (response.status === 200 && response.data.statusCode === 200) {
                const vitrineDiv = document.getElementById(vitrineId); // Use vitrineId aqui

                if (vitrineDiv) {
                    vitrineDiv.remove();
                }

                console.log("Vitrine excluída com sucesso.");
            } else {
                const vitrineDiv = document.getElementById(vitrineId); // Use vitrineId aqui

                if (vitrineDiv) {
                    vitrineDiv.remove();
                }
                console.log("Erro ao excluir a vitrine:", response.data);
            }
        })
        .catch(function (error) {
            console.log("Erro na solicitação:", error);
        });
}