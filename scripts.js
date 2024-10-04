const searchForm = document.querySelector(".search_form");
const cardProducts = document.querySelector(".products_info");
const mensageError = document.querySelector(".message_atencion");
const priceChart = document.querySelector(".price-chart")
let myChart = ''
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = event.target[0].value;
  const getProducts = async () => {
    if (inputValue === "" || !inputValue) {
      mensageError.innerHTML = ` <h3> Voce precisa digitar um produto.</h3>`;
      return
    }else{
        mensageError.innerHTML = ""
    }
    try {
        
      const dados = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`
      );
      const response = (await dados.json()).results.slice(0,15);
      getInfoProducts(response);
      updatePriceChart(response);
    } catch (error) {
      console.log("Erro ao buscar os produtos", error);
    }
  };
  getProducts();
});

const getInfoProducts = (response) => {
  cardProducts.innerHTML = response
    .map((element) => {
      return `
        <div class="products_result">
            <img src="${element.thumbnail.replace(
              /\w\.jpg/gi,
              "W.jpg"
            )}" alt="${element.title}">
            <h3>${element.title} </h3>
            <p>${element.price.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })} </p>
             <p> Loja : ${element.seller.nickname} </p>

        </div>

        `;
    })
    .join("");
};

function updatePriceChart(response) {
    const ctx = priceChart.getContext("2d");
    
    if (myChart) {
      myChart.destroy();
    }
  
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: response.map((p) => p.title.substring(0, 20) + "..."),
        datasets: [
          {
            label: "Preço (R$)",
            data: response.map((p) => p.price),
            backgroundColor: "rgba(46, 204, 113, 0.6)",
            borderColor: "rgba(46, 204, 113, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "R$ " + value.toFixed(2);
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Comparação de Preços",
            font: {
              size: 18,
            },
          },
        },
      },
    });
  }