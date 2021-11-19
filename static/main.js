

function renderHeatmap(element, gridWidth, groupName, itemName) {

    const groupData = hosts[groupName];
    const gridHeight = Math.ceil(groupData.length / gridWidth);

    let i, zValues = [];
    const item_data = groupData.map((h) => h[itemName])
    for (i = 0; i < gridHeight; i++) {
        zValues.push(item_data.splice(0, gridWidth));
    }

    const colorscaleValue = [
        ['0.0', '#08a400'],
        ['0.2', '#ffd500'],
        ['1', '#ff0000']
    ];

    const data = [{
        z: zValues,
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: false,
        hoverongaps: false,
        zmin: 0.0,
        zmax: 100
    }];

    const layout = {
        //title: groupName + ' CPU Utilization',
        annotations: [],
        autosize: true,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 20,
            pad: 20
        },
        xaxis: {
            'range': [-0.5, gridWidth - 0.5],
            'showgrid': false,
            'zeroline': false,
            'visible': false
        },
        yaxis: {
            'range': [-0.5, gridHeight - 0.5],
            'showgrid': false,
            'zeroline': false,
            'visible': false
        }
    };


    for (i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {

            let ann_text = "";

            if (j * gridWidth + i < groupData.length) {
                ann_text = "<b>" + groupData[j * gridWidth + i].name + "</b><br>" + groupData[j * gridWidth + i][itemName] + "%";
            }

            const result = {
                x: i,
                y: j,
                text: ann_text,
                font: {
                    family: 'Arial',
                    size: 12,
                    color: 'white'
                },

                showarrow: false,

            };
            layout.annotations.push(result);
        }
    }

    Plotly.newPlot(element, data, layout, {staticPlot: true, responsive: true});
}

function fillHeader(id, hosts) {

    <!-- Load sidebar with groups -->
    let dropDown = document.getElementById(id);
    Object.keys(hosts).forEach(function (groupName, index) {
        
        let node = createPill(groupName);
        dropDown.appendChild(node);
    });
}

function createPill(groupName){
   const node = document.createElement('li');
        node.className = "nav-item";
        const buttonElement = document.createElement('button');
        buttonElement.className = "nav-link";
        buttonElement.id = "pills-".concat(groupName);
        buttonElement.setAttribute("data-bs-toggle", "pill");
        buttonElement.setAttribute("data-bs-target", "#pills-".concat(groupName));
        buttonElement.type = "button";
        buttonElement.setAttribute("role", "tab");
        buttonElement.setAttribute("aria-controls", "pills-".concat(groupName));
        buttonElement.setAttribute("aria-selected", "false");
        const linkText = document.createTextNode(groupName);
        buttonElement.appendChild(linkText);
        node.appendChild(buttonElement);

        return node;
}

/**
 * Creates a bootstrap card containing the heatmap of a given zabbix item of a group.
 * @param parentID Parent ID of where the card should be placed
 * @param gridWidth Width of the heatmap grid
 * @param groupName Group to display
 * @param itemName  Name of the zabbix item to show
 * @param cardTitle Title to show on the card
 */
function createCard(parentID, gridWidth, groupName, itemName, cardTitle) {

    // Create the components of the card
    // Card container
    let cardContainer = document.createElement('div');
    cardContainer.className = "col-12 col-md-6";
    document.getElementById(parentID).appendChild(cardContainer); // add the created card to parent

    // Card
    let card = document.createElement('div');
    card.className = "card shadow-lg";
    cardContainer.appendChild(card);

    // Card body
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";
    card.appendChild(cardBody);

    // Card title
    let cardTitleElement = document.createElement('h5');
    cardTitleElement.className = "card-title text-center";
    cardTitleElement.appendChild(document.createTextNode(cardTitle)); // Set the text of the title
    cardBody.appendChild(cardTitleElement);

    // Heatmap
    let heatmap = document.createElement('div');
    heatmap.id = 'heatmap-' + groupName + '-' + itemName;
    cardBody.appendChild(heatmap);
    renderHeatmap(heatmap, gridWidth, groupName, itemName);
}