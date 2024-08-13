// Object to keep track of aisle timeouts
let aisleTimeouts = {
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null
};

const defaultColor = '#efefef'; // Default aisle color

function searchItem(kioskId) {
    const query = document.getElementById(`searchBox${kioskId}`).value.toLowerCase();
    let aisle = ''; // Replace with the logic to find the correct aisle

    switch(query) {
        case 'milk': aisle = 'A'; break;
        case 'bread': aisle = 'B'; break;
        case 'eggs': aisle = 'C'; break;
        // Add more items as needed
        default: aisle = '';
    }
    
    const kioskColors = ['#a4eda4', '#fac0d7', '#fcfda2']; // Green, Pink, Yellow
    const kioskColorNames = ['green', 'pink', 'yellow']; // Color names
    const kioskColor = kioskColors[kioskId - 1];
    const kioskColorName = kioskColorNames[kioskId - 1];

    if (aisle) {
        const now = Date.now();
        if (aisleTimeouts[aisle] && now < aisleTimeouts[aisle].endTime) {
            displayWaitMessage(kioskId);
            return;
        }

        // Clear previous timeout if exists
        if (aisleTimeouts[aisle]) {
            clearTimeout(aisleTimeouts[aisle].timeoutId);
        }

        // Highlight aisle
        updateAisleButtons(kioskColor, aisle);
        const resultElement = document.getElementById(`result${kioskId}`);
        resultElement.innerHTML = `
            <br><strong>Aisle: ${aisle}</strong><br><br>
            Please look around for the aisle board highlighted in <strong>${kioskColorName}</strong> to find your product.<br><br>
            Thank you for shopping with us!
        `;
        resultElement.classList.remove('fade-out');
        resultElement.classList.add('fade-in');

        // Clear search box
        document.getElementById(`searchBox${kioskId}`).value = '';

        // Set timeout to reset aisle color
        aisleTimeouts[aisle] = {
            timeoutId: setTimeout(() => {
                resetAisleColors();
                updateAisleButtons(defaultColor, aisle);
                aisleTimeouts[aisle] = null;
            }, 5000), // 5 seconds
            endTime: now + 5000 // Track end time for timeout
        };

        // Start the kiosk reset timer
        startKioskResetTimer(kioskId);
    } else {
        const resultElement = document.getElementById(`result${kioskId}`);
        resultElement.innerHTML = `
            <br>Item "${query}" not found.<br>
            Please contact the nearest staff member for further assistance if needed.
        `;
        resultElement.classList.remove('fade-out');
        resultElement.classList.add('fade-in');

        // Clear search box
        document.getElementById(`searchBox${kioskId}`).value = '';

        // Fade out after 5 seconds
        setTimeout(() => {
            resetKiosk(kioskId);
        }, 5000);
    }
}

function displayWaitMessage(kioskId) {
    const resultElement = document.getElementById(`result${kioskId}`);
    resultElement.innerHTML = '<br><br>Please wait 5 seconds before trying again.';
    resultElement.classList.remove('fade-out');
    resultElement.classList.add('fade-in');
    
    setTimeout(() => {
        resultElement.classList.remove('fade-in');
        resultElement.classList.add('fade-out');
        setTimeout(() => {
            resultElement.innerHTML = '';
        }, 500); // Allow fade-out transition before clearing
    }, 5000); // 5 seconds before fading out
}

function updateAisleButtons(color, aisle) {
    document.getElementById(`aisle${aisle}`).style.backgroundColor = color;
}

function resetAisleColors() {
    const aisles = ['A', 'B', 'C', 'D', 'E', 'F'];
    aisles.forEach(aisle => {
        document.getElementById(`aisle${aisle}`).style.backgroundColor = defaultColor;
    });
}

function startKioskResetTimer(kioskId) {
    setTimeout(() => {
        resetKiosk(kioskId);
    }, 5000); // Reset kiosk display after 5 seconds
}

function resetKiosk(kioskId) {
    const resultElement = document.getElementById(`result${kioskId}`);
    resultElement.classList.remove('fade-in');
    resultElement.classList.add('fade-out');
    setTimeout(() => {
        resultElement.innerHTML = '';
    }, 500); // Allow fade-out transition before clearing
}

// Optional: Function to reset the entire kiosk system (if needed)
function resetAllKiosks() {
    resetAisleColors();
    for (let i = 1; i <= 3; i++) {
        resetKiosk(i);
    }
}
