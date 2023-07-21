// GLOBAL VARIABLES

const upperScreen = document.querySelector('.upper-screen');
const lowerScreen = document.querySelector('.lower-screen');

const writeButtons = document.querySelectorAll('.number-btn');
const operationButtons = document.querySelectorAll('.operation-btn');
const equalButton = document.querySelector('.equal-btn')
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

// EVENT LISTENERS

clearButton.addEventListener('click', () => {
    upperScreen.textContent = '';
    lowerScreen.textContent = '';
});

deleteButton.addEventListener('click', () => {
    let number = lowerScreen.textContent;
    lowerScreen.textContent = number.slice(0, number.length - 1);
});

writeButtons.forEach(button => button.addEventListener('click', writeNumber));

operationButtons.forEach(operation => operation.addEventListener('click', writeOperation));

equalButton.addEventListener('click', () => {
    const lower = lowerScreen.textContent;
    const upper = upperScreen.textContent; 
    if (!(lower === '') && !(upper === '') && !upper.includes('=')) {
        const result = calculateResult(lower);
        if (!isFinite(result)) {
            alert('You can\'t divide by 0!')
            return;
        }
        upperScreen.textContent = `${upper} ${lower} =`;
        lowerScreen.textContent = result;
    }
});

document.addEventListener('keydown', (e) => {
    //TODO fer recorrido de dataset de tts botons i si key es igual a  uno cridar a la funcio de ixe boto;
    console.log(e);
})

function writeNumber() {
    let number = lowerScreen.textContent;
    const buttonValue = this.dataset.value;
    if (number === '0' && buttonValue !== '.') {
        number = '';
    }
    // Reset all if last equation solved
    if (upperScreen.textContent.includes('=')) {
        number = '';
        upperScreen.textContent = '';
    }
    //Only writes if it fits on the screen
    if (`${number}`.length < 11) {
        lowerScreen.textContent = number + buttonValue;
    }
}

function writeOperation() {
    let number = lowerScreen.textContent;
    if (number.startsWith('.')) number = '0' + number;
    if(!isWrittenCorrectly(number)) {
        alert('Write the number correctly!');
        return;
    };

    if (upperScreen.textContent === '' || upperScreen.textContent.includes('=')) {
        upperScreen.textContent = `${number} ${this.dataset.value}`;
    } else {
        const result = calculateResult(number);
        if (!isFinite(result)) {
            alert('You can\'t divide by 0!')
            return;
        }
        upperScreen.textContent = `${result} ${this.dataset.value}`;
    }
    
    lowerScreen.textContent = '';
}

function isWrittenCorrectly(number) {
    if (number.endsWith('.')) return false;

    const matches = number.match(/\./g);
    return !(matches && matches.length >= 2);
}

/// OPERATION FUNCTIONS

function calculateResult(lowerScreenNum) {
    const operation = upperScreen.textContent.split(' ');
    const result = operate(operation[0], operation[1], lowerScreenNum);
    const strResult = `${result}`;
    const resultLength = strResult.length;

    //If result does not fit on the screen
    if (resultLength > 11) {
        //Really long results contain exponents [e+21]
        if (strResult.includes('e')) {
            let longResult = strResult;
            const suffix = longResult.slice(longResult.length -4);
            longResult = longResult.slice(0, 8);
            return longResult + suffix;
        }

        if (strResult.includes('.') && strResult.indexOf('.') < 10) {
            return strResult.slice(0, 11);

        } else {
            let reduced = strResult.slice(0, 8);
            let resultTruncate = Math.trunc(result);
            const truncateLength = `${resultTruncate}`.length;
            return `${reduced}e${truncateLength - 8}`;
        }
    }
    return result;
}

function operate(x, operator, y) {
    switch (operator) {
        case '+':
            return add(x, y);

        case '-':
            return substract(x, y);

        case 'x':
            return multiply(x, y);

        case '÷':
            return divide(x, y);
    
        default:
            throw 'ERROR';
    }
}

function add(x, y) {
    return +x + +y;
}

function substract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}