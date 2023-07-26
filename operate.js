// GLOBAL VARIABLES
const numberValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
const operationValues = ['+', '-', '*', '/', '='];

const upperScreen = document.querySelector('.upper-screen');
const lowerScreen = document.querySelector('.lower-screen');

const writeButtons = document.querySelectorAll('.number-btn');
const operationButtons = document.querySelectorAll('.operation-btn');
const equalButton = document.querySelector('.equal-btn')
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

// EVENT LISTENERS

clearButton.addEventListener('click', () => {
    clearScreen();
});

deleteButton.addEventListener('click', () => {
    deleteDigit();
});

writeButtons.forEach(button => button.addEventListener('click', (e) => {
    writeNumber(e.target.dataset.value);
}));

operationButtons.forEach(operation => operation.addEventListener('click', (e) => {
    writeOperation(e.target.dataset.value);
}));

equalButton.addEventListener('click', () => {
    writeEquality();
});

document.addEventListener('keydown', (e) => {

    if (numberValues.includes(e.key)) {
        writeNumber(e.key);

    } else if (operationValues.includes(e.key)) {
        if (e.key === '=' ) writeEquality();
        else {
            e.key === '/' ? writeOperation('÷') : 
            e.key === '*' ? writeOperation('x') :
            writeOperation(e.key);
        }
    } 
    else if (e.key === 'Backspace') deleteDigit();
    else if (e.key.toLowerCase() === 'c') clearScreen();
});

function clearScreen() {
    upperScreen.textContent = '';
    lowerScreen.textContent = '';
}

function deleteDigit() {
    let number = lowerScreen.textContent;
    lowerScreen.textContent = number.slice(0, number.length - 1);
}

function writeNumber(buttonValue) {
    let lowerScreenNum = lowerScreen.textContent;

    if (lowerScreenNum === '0' && buttonValue !== '.') {
        lowerScreenNum = '';
    }
    // Reset all if last equation solved
    if (upperScreen.textContent.includes('=')) {
        lowerScreenNum = '';
        upperScreen.textContent = '';
    }
    //Only writes if it fits on the screen
    if (`${lowerScreenNum}`.length < 11) {
        lowerScreen.textContent = lowerScreenNum + buttonValue;
    }
}

function writeOperation(buttonValue) {
    let lowerScreenNum = lowerScreen.textContent;
    if (lowerScreenNum.startsWith('.')) lowerScreenNum = '0' + lowerScreenNum;
    if(!isWrittenCorrectly(lowerScreenNum)) {
        alert('Write the number correctly!');
        return;
    }

    if (upperScreen.textContent === '' || upperScreen.textContent.includes('=')) {
        upperScreen.textContent = `${lowerScreenNum} ${buttonValue}`;
    } else {
        const result = calculateResult(lowerScreenNum);
        if (!isFinite(result)) {
            alert('You can\'t divide by 0!')
            return;
        }
        upperScreen.textContent = `${result} ${buttonValue}`;
    }
    
    lowerScreen.textContent = '';
}

function writeEquality() {
    const lower = lowerScreen.textContent;
    const upper = upperScreen.textContent;
    if(!isWrittenCorrectly(lower)) {
        alert('Write the number correctly!');
        return;
    }
    if (!(lower === '') && !(upper === '') && !upper.includes('=')) {
        const result = calculateResult(lower);
        if (!isFinite(result)) {
            alert('You can\'t divide by 0!')
            return;
        }
        upperScreen.textContent = `${upper} ${lower} =`;
        lowerScreen.textContent = result;
    }
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
            throw 'Operator ERROR';
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