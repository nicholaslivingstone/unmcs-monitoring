
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

function setupPage(header, tabContent, hosts) {

    // Create a pill and tab pane for each group
    Object.keys(hosts).forEach(function (groupName) {
        header.appendChild(createPill(groupName));
        tabContent.appendChild(createTabPane(groupName)); 
    });
}

function createPill(groupName){
   const node = document.createElement('li');
        node.className = "nav-item";
        const buttonElement = document.createElement('button');
        buttonElement.className = "nav-link";
        buttonElement.id = "pills-" + groupName + '-tab';
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
 * Creates a tab pane for a zabbix group and generates relevant cards. 
 * @param groupName
 * @returns {HTMLDivElement}
 */
function createTabPane(groupName){
   let tabPane = document.createElement('div');
   tabPane.className = 'tab-pane fade show';
   tabPane.id = 'pills-' + groupName; 
   tabPane.setAttribute('role', 'tabpanel');
   tabPane.setAttribute('aria-labeledby', 'pills-' + groupName + '-tab');
   let row = document.createElement('div');
   row.className = 'row';
   tabPane.appendChild(row);
   
   createCard(row, 6, 'B146', 'CPU utilization', 'CPU Utilization');

   return tabPane;
}

/**
 * Creates a bootstrap card containing the heatmap of a given zabbix item of a group.
 * @param parent Parent div of where the card should be placed
 * @param gridWidth Width of the heatmap grid
 * @param groupName Group to display
 * @param itemName  Name of the zabbix item to show
 * @param cardTitle Title to show on the card
 */
function createCard(parent, gridWidth, groupName, itemName, cardTitle) {

    // Create the components of the card
    // Card container
    let cardContainer = document.createElement('div');
    cardContainer.className = "col-12 col-md-6";
    parent.appendChild(cardContainer); // add the created card to parent

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

/**
 * Resizes all heatmaps on the page
 */
function resizeHeatmaps() {
    document.querySelectorAll('[id^="heatmap-"]').forEach(
        element => Plotly.relayout(element, {autosize: true}));
}