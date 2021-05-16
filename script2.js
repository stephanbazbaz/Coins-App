let coinlistArray = [];
let favorites = [];
const maxFavs = 4;
let sixthFav;
const chartMainContainer = document.getElementById('chartContainer')
const main_Coin_Container = document.getElementById('curencyCards')
const ifSearchNotFound = document.getElementById('serachNotFound')
const sreachWarper = document.getElementById('searchForm')
const spinnerMainPage = document.getElementById('mainSpinner')
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

//Fetch data from api on create card coins
async function coins() {
    chartMainContainer.style.display = ('none');
    main_Coin_Container.style.display = 'flex'
    ifSearchNotFound.style.display = 'none'
    main_Coin_Container.innerHTML = "";
    sreachWarper.style.display = 'block';
    spinnerMainPage.style.display = ('block');

    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
        spinnerMainPage.style.display = ('none');
        const allCoins = await res.json();

        // Create Cards 
        for (let i = 0; i < 100; i++) {
            let ifChecked = null;
            const symbol = allCoins[i].symbol
            const id = allCoins[i].id;
            const newCurency = document.createElement('div');
            const carDiv = document.createElement('div');
            const cardheader = document.createElement('h5');
            const cardName = document.createElement('p');
            const infoBtn = document.createElement('button');

            if (favorites.includes(symbol)) {
                ifChecked = 'checked'
            }
            //Create toggle button on card 

            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'toggleWarp';
            const toggleLabel = document.createElement('label');
            toggleLabel.setAttribute('class', 'switch');
            toggleLabel.setAttribute('id', id);
            const toggleBtn = document.createElement('input')
            toggleBtn.type = 'checkbox';
            toggleBtn.setAttribute(ifChecked, ifChecked);
            const toggleSpan = document.createElement('span');
            toggleSpan.className = 'slider round';
            toggleBtn.addEventListener('change', (ev) => switchChange(symbol));


            newCurency.className = 'cardCurancy card col-3 demoObject';
            newCurency.id = symbol;
            carDiv.id = `carDiv${id}`;
            carDiv.className = 'card-body form-check form-switch';
            infoBtn.className = 'btn btn-dark';
            cardheader.innerText = `${symbol}`;
            cardName.innerText = `${allCoins[i].name}`;
            infoBtn.innerText = 'More info';
            infoBtn.addEventListener('click', () => moreInfo(id));
            newCurency.appendChild(carDiv);
            carDiv.appendChild(cardheader);

            carDiv.appendChild(toggleDiv);
            toggleDiv.appendChild(toggleLabel);
            toggleLabel.appendChild(toggleBtn);
            toggleLabel.appendChild(toggleSpan);

            carDiv.appendChild(cardName);
            carDiv.appendChild(infoBtn);
            toggleSpiner(carDiv, id);
            main_Coin_Container.append(newCurency);

            coinlistArray.push(symbol)
        }
    }
    catch (err) {
        console.log(err);
    }
}
coins()

// Create More Info Section and save to local storage 
async function moreInfo(id) {
    const show = document.getElementById(`collapseId${id}`)
    document.getElementById('spinner-' + id).style.display = 'block'
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(id))
    if (!dataFromLocalStorage || new Date().getTime() - dataFromLocalStorage.createdDate > 60000) {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
        document.getElementById('spinner-' + id).style.display = 'none'
        const data = await res.json()
        let coinObj = {
            id: data.id,
            createdDate: new Date().getTime(),
            ils: data.market_data.current_price.ils,
            usd: data.market_data.current_price.usd,
            eur: data.market_data.current_price.eur,
            img: data.image.small
        }
        console.log(coinObj);
        localStorage.setItem(id, JSON.stringify(coinObj))
        draw(coinObj)

    }
    else if (show) {
        show.remove()
        document.getElementById('spinner-' + id).style.display = 'none'
    }

    else {
        document.getElementById('spinner-' + id).style.display = 'none'
        draw(dataFromLocalStorage)
    }

}

//Draw the data fetched to collapse item of More Info
function draw(data) {
    const infoCollapse = document.createElement('div');
    infoCollapse.className = 'collapser'
    infoCollapse.id = `collapseId${data.id}`
    const target = document.getElementById(`carDiv${data.id}`)
    const imgInfo = document.createElement('img')
    imgInfo.setAttribute('class', 'imageCoin')
    const dollarInfo = document.createElement('p')
    const euroInfo = document.createElement('p')
    const nisInfo = document.createElement('p')
    imgInfo.setAttribute("src", data.img);
    dollarInfo.innerText = 'Price In Dollar - ' + ' ' + data.usd + '$'
    euroInfo.innerText = 'Price In Euro - ' + ' ' + data.eur + '€'
    nisInfo.innerText = 'Price In Nis - ' + ' ' + data.ils + '₪'
    infoCollapse.appendChild(imgInfo)
    infoCollapse.appendChild(dollarInfo);
    infoCollapse.appendChild(euroInfo);
    infoCollapse.appendChild(nisInfo);
    target.appendChild(infoCollapse);
}

//Create spinner on More Info
function toggleSpiner(element, id) {
    const loderDiv = document.createElement("div")
    loderDiv.setAttribute("class", "spinner-border inofSpin")
    loderDiv.setAttribute("id", 'spinner-' + id)
    loderDiv.setAttribute("role", "status");
    loderDiv.style.display = 'none';
    element.appendChild(loderDiv);
}

//Adds items to Modal on toggle
function switchChange(symbol) {
    const includesFav = favorites.includes(symbol);
    if (includesFav) {
        favorites.splice(favorites.indexOf(symbol), 1)
    }
    else if (favorites.length > maxFavs) {
        sixthFav = symbol;
        addItem()
        document.getElementById('favorits-modal').style.display = 'block';
    }
    else {
        favorites.push(symbol)
    }
    console.log(favorites);
}

//Repleace sixth Favorite 
function replaceFavoriteCoin(id) {
    favorites.splice(favorites.indexOf(id), 1, sixthFav)
    closeModal()
    console.log(favorites);
}

//Search Function and validations
searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value;
    const inputValidMsg = document.createElement('p')
    inputValidMsg.innerText =
    `Sorry we didn't find any results for '${inputValue}'.

     Check the spelling, or try a different search.`

    for (let i = 0; i < coinlistArray.length; i++) {
        if (coinlistArray[i] == inputValue) {
            $('#curencyCards').children().hide()
            $(`#${coinlistArray[i]}`).show()
            document.getElementById('search-input').value = '';
        }
        else if (!coinlistArray.includes(inputValue)) {
            document.getElementById('search-input').value = '';
            ifSearchNotFound.innerHTML = "";
            main_Coin_Container.style.display = 'none'
            ifSearchNotFound.style.display = 'block'
            ifSearchNotFound.append(inputValidMsg)

        }
        else if (coinlistArray.includes(inputValue)) {
            ifSearchNotFound.style.display = 'none'
            main_Coin_Container.style.display = 'flex'
        }
    }
});

//Creates and draw favorite Modal Window
function addItem() {
    document.getElementById('favorits-list').innerHTML = "";
    for (let i = 0; i < favorites.length; i++) {
        const coinid = favorites[i]

        const doc = document.getElementById('favorits-list');
        const warpFavCoin = document.createElement('div');
        const modalData = document.createElement('div');
        modalData.className = ('favoritItem');


        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'modalbtn';
        const toggleLabel = document.createElement('label');
        toggleLabel.setAttribute('class', 'switch');
        toggleLabel.setAttribute('id', coinid);
        const toggleBtn = document.createElement('input');
        toggleBtn.setAttribute('checked', 'checked');
        toggleBtn.type = 'checkbox';
        const toggleSpan = document.createElement('span');
        toggleSpan.className = 'slider round';
        toggleBtn.addEventListener('change', () => replaceFavoriteCoin(coinid));


        modalData.id = (`favorite${coinid}`);
        modalData.innerText = `${coinid}`;
        warpFavCoin.append(modalData);
        modalData.append(toggleDiv);
        toggleDiv.appendChild(toggleLabel);
        toggleLabel.appendChild(toggleBtn);
        toggleLabel.appendChild(toggleSpan);
        doc.appendChild(warpFavCoin);
    }
}

// Close Modal Window without changes
function closeModal() {
    document.getElementById('favorits-modal').style.display = 'none'
    main_Coin_Container.innerHTML = "";
    coins()
}

//About Page Show 
async function about() {
    ifSearchNotFound.style.display = 'none'
    chartMainContainer.style.display = ('none');
    main_Coin_Container.innerHTML = '';
    main_Coin_Container.style.display = 'flex'
    sreachWarper.style.display = 'none';
    spinnerMainPage.style.display = ('block');
    const res = await fetch('about.html');
    spinnerMainPage.style.display = ('none');
    const aboutData = await res.text();
    main_Coin_Container.innerHTML = aboutData
}

//Live reports on canvas 
function liveReports(favorites) {
    ifSearchNotFound.style.display = 'none';
    main_Coin_Container.innerHTML = '';
    sreachWarper.style.display = 'none';
    spinnerMainPage.style.display = ('block');
    chartMainContainer.style.display = ('block');
    try {
        let dataprice = [];
        console.log(dataprice);

        var dataPoints1 = [];
        var dataPoints2 = [];
        var dataPoints3 = [];
        var dataPoints4 = [];
        var dataPoints5 = [];

        var chart = new CanvasJS.Chart("chartContainer", {
            zoomEnabled: true,
            title: {
                text: "Share Value of Favorites Companies"
            },
            axisX: {
                title: "chart updates every 2 secs"
            },
            axisY: {
                prefix: "$"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 22,
                fontColor: "dimGrey",
                itemclick: toggleDataSeries
            },
            data: []
        });
        function add() {
            let datapointers = [
                dataPoints1,
                dataPoints2,
                dataPoints3,
                dataPoints4,
                dataPoints5
            ];
            for (let i = 0; favorites.length; i++) {
                if (chart.options.data.length >= favorites.length)
                    break
                let objData = {
                    type: "line",
                    xValueType: "dateTime",
                    yValueFormatString: "$####.00",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: `${favorites[i]}`,
                    dataPoints: datapointers[i]
                }
                chart.options.data.push(objData)
            }

        }

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }

        var updateInterval = 2000;
        var time = new Date;

        async function updateChart(count) {
            const res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${favorites[0]},${favorites[1]},${favorites[2]},${favorites[3]},${favorites[4]}&tsyms=USD`)
            spinnerMainPage.style.display = ('none');
            const dataRports = await res.json();
            for (const j of Object.values(dataRports)) {
                dataprice.push(j.USD)
            }
            count = count || 1;
            var deltaY1, deltaY2, deltaY3, deltaY4, deltaY5;
            for (var i = 0; i < count; i++) {
                time.setTime(time.getTime() + updateInterval);
                deltaY1 = dataprice[0];
                deltaY2 = dataprice[1];
                deltaY3 = dataprice[2];
                deltaY4 = dataprice[3];
                deltaY5 = dataprice[4];

                dataPoints1.push({
                    x: time.getTime(),
                    y: deltaY1
                });
                dataPoints2.push({
                    x: time.getTime(),
                    y: deltaY2
                });
                dataPoints3.push({
                    x: time.getTime(),
                    y: deltaY3
                });
                dataPoints4.push({
                    x: time.getTime(),
                    y: deltaY4
                });
                dataPoints5.push({
                    x: time.getTime(),
                    y: deltaY5
                });
            }
            add()
            // updating legend text with  updated with y Value 
            for (let z = 0; z < favorites.length; z++) {
                this['deltaY' + z] = dataprice[z];

                chart.options.data[z].legendText = `${favorites[z]} $` + this['deltaY' + z];
                chart.options.data[z].name = favorites[z];

            }
            chart.render();
        }
        // generates first set of dataPoints 
        updateChart(100);
        setInterval(function () { updateChart() }, updateInterval);

    }
    catch (err) {
        console.log(err);
    }

}



