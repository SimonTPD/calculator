const DIGIT_KEYS = ['0', '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '.'];
const OPERATOR_KEYS = ['+', '-', '*', 'x', '/', '^', 'v'];

const calcScreen = document.querySelector('div.calc-screen p');

const clearButton = document.querySelector('button#clear-button');
const equalButton = document.querySelector('button#equal-button');
const undoButton = document.querySelector('button#undo-button');
const digitButtons = document.querySelectorAll('button.digit-button');
const operatorButtons = document.querySelectorAll('button.operator');

let pageBody = document.querySelector('body');

let operands = ['', ''];
let operator = '';


clearButton.addEventListener('click', clearCalc);

digitButtons.forEach(
    button => button.addEventListener('click', processDigit)
    );


operatorButtons.forEach(
    button => button.addEventListener('click', processOperator)
    );

equalButton.addEventListener('click', processEqual);

undoButton.addEventListener('click', processUndo);

pageBody,addEventListener('keypress', processKey);

//Backspace only fires on keydown event, not keypress
pageBody.addEventListener('keydown', processBackspaceKey);
/******************************************************/
/********************Functions*************************/
/******************************************************/

/******************Event callbacks*********************/

function clearCalc(){
    clearScreen();
    setOperand(0, '');
    setOperand(1, '');
    setOperator('');
}

function processDigit(e){
    const digitPressed = e.target.textContent;
    let operandChanged;

    if (checkIfOperatorEmpty()) operandChanged = appendToOperand(0, digitPressed);
    else operandChanged = appendToOperand(1, digitPressed);  

    if (operandChanged) appendScreen(digitPressed);    
}

function processOperator(e){
    const operatorPressed = e.target.textContent;
    
    if (checkIfOperandEmpty(0)) {
        console.log('Enter number first!');
        return undefined;
    }
    else if (checkIfOperandEmpty(1)) {
        if (!checkIfOperatorEmpty()) {
            clearScreen();
            writeScreen(operands[0]);
        }
        if (operatorPressed === '√'){
            setOperator('√');
            const resultOfCurrentExpression = calculateExpression();
            setOperand(0, resultOfCurrentExpression);
            setOperator('');
            clearScreen();
            writeScreen(resultOfCurrentExpression);           
        }
        else{
            setOperator(operatorPressed);
            appendScreen(operator);
        }
    }
    else {
        const resultOfCurrentExpression = calculateExpression();
        setOperand(0, resultOfCurrentExpression);
        setOperand(1, '')
        if (operatorPressed === '√'){
            setOperator('√');
            const resultOfSquareRoot = calculateExpression();
            setOperand(0, resultOfSquareRoot);
            setOperator('');
            clearScreen();
            writeScreen(resultOfSquareRoot);                   
        }
        else{
            clearScreen();
            writeScreen(resultOfCurrentExpression);
            setOperator(operatorPressed);
            appendScreen(operator);        
        }
    }
}

function processEqual(){
    if (checkIfValidExpression()){
        const resultOfCurrentExpression = calculateExpression();
        setOperand(0, resultOfCurrentExpression);
        setOperand(1, '')
        setOperator('');
        clearScreen();
        writeScreen(resultOfCurrentExpression);
    }
    else console.log('Enter operation first!');
}

function processUndo(){
    if(!checkIfOperandEmpty(1)){
        setOperand(1, getOperand(1).substring(0, getOperand(1).length - 1));
    }
    else if(!checkIfOperatorEmpty()){
        setOperator('');
    }
    else if(!checkIfOperandEmpty(0)){
        setOperand(0, getOperand(0).substring(0, getOperand(0).length - 1));        
    }
    else{
        console.log('Nothing to erase!');
        return undefined;
    }
    clearScreen();
    writeScreen(getOperand(0).concat(getOperator()).concat(getOperand(1)));
}

function processKey(e){
    const keyPressed = e.key;

    if(DIGIT_KEYS.findIndex(el => el === keyPressed) > -1){
        processDigitKeyboard(keyPressed);
    }
    else if(OPERATOR_KEYS.findIndex(el => el === keyPressed) > -1){
        processOperatorKeyboard(keyPressed);
    }
    else if(keyPressed === '='){
        processEqual();
    }
    else if(keyPressed === 'c'){
        clearCalc();
    }
    else{
        console.log('Invalid key!');
    }
}

function processBackspaceKey(e){
    const keyPressed = e.key;

    if(keyPressed === 'Backspace'){
        processUndo();
    }
}

/***********Screen functions*******************/
function getScreen(){
    return calcScreen.textContent;
}

function writeScreen(str){
    calcScreen.textContent = str;
}

function appendScreen(str){
    writeScreen(getScreen().concat(str));
}

function clearScreen(){
    writeScreen('');
}

/***************Other********************/
function checkIfOperandEmpty(operandNumber){
    return operands[operandNumber] === '';
}

function setOperand(operandNumber, value){
    operands[operandNumber] = value;
}

function getOperand(operandNumber){
    return operands[operandNumber];
}

function appendToOperand(operandNumber, value){
    let operandChanged;

    if (isDecimalPoint(value) && 
        checkIfOperandHasDecimalPoint(getOperand(operandNumber))){
        console.log('Operand already has a decimal point!');
        operandChanged = false;
    }
    else{
        setOperand(operandNumber, getOperand(operandNumber) + value);
        operandChanged = true;  
    }

    return operandChanged;
}

function checkIfOperatorEmpty(){
    return operator === '';
}

function setOperator(newOperator){
    operator = newOperator;
}

function getOperator(){
    return operator;
}

function isDecimalPoint(value){
    return value === '.';
}

function checkIfOperandHasDecimalPoint(operand){
    return operand.includes('.');
}

function checkIfValidExpression(){
    if (getOperator() === '√'){
        if (!checkIfOperandEmpty(0)) return true;
        else return false;
    }
    else{
        if (!checkIfOperandEmpty(0) && !checkIfOperandEmpty(1)) return true;
        else return false;        
    }
}

function calculateExpression(){
    let result;

    switch (getOperator()){
        case '+':
            result = add();
            break;
        case '-':
            result = subtract();
            break;    
        case 'x':
            result = multiply();
            break;
        case '/':
            result = divide();
            break;
        case '^':
            result = power();
            break;
        case '√':
            result = squareRoot();             
    }
    
    return result;
}

function add(){
    let a = parseFloat(operands[0]);
    let b = parseFloat(operands[1]);
    let result = a + b;
    return result.toString();
}

function subtract(){
    let a = parseFloat(operands[0]);
    let b = parseFloat(operands[1]);
    let result = a - b;
    return result.toString();
}

function multiply(){
    let a = parseFloat(operands[0]);
    let b = parseFloat(operands[1]);
    let result = a * b;
    return result.toString();
}

function divide(){
    let a = parseFloat(operands[0]);
    let b = parseFloat(operands[1]);
    let result
    if(b === 0){
        result = a;
        console.log('Cannot divide by 0, cancelling operation.');
    }
    else{
        result = a / b;
    }
    return result.toString();
}

function power(){
    let a = parseFloat(operands[0]);
    let b = parseFloat(operands[1]);
    let result = a ** b;
    return result.toString();
}

function squareRoot(){
    let a = parseFloat(operands[0]);
    let result = a ** 0.5;
    return result.toString();
}

function processDigitKeyboard(digitPressed){
    let operandChanged;

    if (checkIfOperatorEmpty()) operandChanged = appendToOperand(0, digitPressed);
    else operandChanged = appendToOperand(1, digitPressed);  

    if (operandChanged) appendScreen(digitPressed);    
    
}

function processOperatorKeyboard(operatorPressed){
    if (operatorPressed === '*') operatorPressed = 'x';
    else if(operatorPressed === 'v') operatorPressed = '√';

    if (checkIfOperandEmpty(0)) {
        console.log('Enter number first!');
        return undefined;
    }
    else if (checkIfOperandEmpty(1)) {
        if (!checkIfOperatorEmpty()) {
            clearScreen();
            writeScreen(operands[0]);
        }
        if (operatorPressed === '√'){
            setOperator('√');
            const resultOfCurrentExpression = calculateExpression();
            setOperand(0, resultOfCurrentExpression);
            setOperator('');
            clearScreen();
            writeScreen(resultOfCurrentExpression);           
        }
        else{
            setOperator(operatorPressed);
            appendScreen(operator);
        }
    }
    else {
        const resultOfCurrentExpression = calculateExpression();
        setOperand(0, resultOfCurrentExpression);
        setOperand(1, '')
        if (operatorPressed === '√'){
            setOperator('√');
            const resultOfSquareRoot = calculateExpression();
            setOperand(0, resultOfSquareRoot);
            setOperator('');
            clearScreen();
            writeScreen(resultOfSquareRoot);                   
        }
        else{
            clearScreen();
            writeScreen(resultOfCurrentExpression);
            setOperator(operatorPressed);
            appendScreen(operator);        
        }
    }
}