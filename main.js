const screenOperator = document.querySelector('.screen-operator')
const screenValue = document.querySelector('.screen-value')

let screenOperatorText = ''
let screenValueText = '0'

let buffer1 = '' // Store first number
let buffer2 = '' // Store second number
let operator = ''; // Store operator
let activeBuffer = '' // Store what currently render in the user screen

let flagState = 0;
let usedDot = false;

function add(a,b) {
    return parseFloat(a) + parseFloat(b);
}

function subtract(a,b) {
    return parseFloat(a) - parseFloat(b);
}

function multiply(a,b) {
    return parseFloat(a) * parseFloat(b);
}

function divide(a,b) {
    return parseFloat(a) / parseFloat(b);
}


function clearBuffer() {
    activeBuffer = '0'
    buffer1 = ''
    buffer2 = ''
}

function isOperator(key) {
    const operators = ['+', '-', '*', '/'];
    return operators.includes(key);
}

function isNumber(key) {
    return /\d/.test(key);
}

function isDeletion(key) {
    const operators = ['C','<-'];
    return operators.includes(key);
}

function renderDisplay() {
    const SPACE = ' ';
    if (buffer1 !== '') {
        if (buffer2 === '') {
            screenOperatorText = buffer1 + SPACE + operator
        } else {
            screenOperatorText = buffer1 + SPACE + operator + SPACE + buffer2 + ' ='
        }
    } else {
        screenOperatorText = ''
    }
    screenValueText = activeBuffer

    screenValue.textContent = screenValueText
    screenOperator.textContent = screenOperatorText
}

function operate() {
    let result;
    switch (operator) {
        case '+':
            result = add(buffer1, buffer2);
            break;
        case '-':
            result = subtract(buffer1, buffer2);
            break;
        case '*':
            result = multiply(buffer1, buffer2);
            break;
        case '/':
            result = divide(buffer1, buffer2);
            break;
    }
    activeBuffer = result
}

function makeCalculation() {
    buffer2 = activeBuffer;
    operate();
}

function registerCommand(button) {
    if (isOperator(button)) {
        operator = button;
        if (buffer1 !== '') {
            if (buffer2 !== '') // make a new calculation after previous calculation
            {
                buffer1 = activeBuffer
                buffer2 = ''
            } else {
                if (flagState === 1) {
                    makeCalculation();
                    buffer1 = activeBuffer;
                    buffer2 = ''
                } else {
                    // do nothing
                }
            }
        } else {
            buffer1 = activeBuffer;
            buffer2 = ''
        }
        flagState = 0;
        usedDot = false;
    } else if (isNumber(button) || button === '.') {
        if (button === '0' && (activeBuffer === '0' || activeBuffer === '')) {
            return;
        }
        if (flagState === 0) // initial state, change the buffer when user click the number
        {
            activeBuffer = '';
            flagState = 1;
        }
        if (button === '.') {
            if (usedDot) {
                return;
            } else {
            usedDot = true;
            }
        }
        activeBuffer += button;
    } else if (isDeletion(button)) {
        switch (button) {
            case '<-':
                if (buffer2 !== ''){
                    return;
                }
                if (activeBuffer[activeBuffer.length - 1] === '.') {
                    usedDot = false;
                }
                activeBuffer = activeBuffer.slice(0,activeBuffer.length - 1);
                if (activeBuffer === '') {
                    activeBuffer = '0';
                    flagState = 0;
                }
                break;
            case 'C':
                usedDot = false;
                clearBuffer()
                flagState = 0
                break;
        }
    } else if (button === '=') {
        if (buffer1 === '')
        {
            return;
        }
        makeCalculation();
        flagState = 0
    }
    renderDisplay();
    console.log(`buffer1 = ${buffer1},\nbuffer2 =${buffer2}\n,activeBuffer = ${activeBuffer}\n,flagState = ${flagState}`)
}

const buttons = document.querySelectorAll('button')

buttons.forEach((element) => {
    element.onclick = () => {
        registerCommand(element.textContent);
    }
})