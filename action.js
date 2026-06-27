const expressionElement = document.getElementById('expression');
const outputElement = document.getElementById('output');
const buttons = document.querySelectorAll('.button');

let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForNextValue = false;

function updateDisplay() {
  outputElement.textContent = currentValue;
  expressionElement.textContent = previousValue && operator ? `${previousValue} ${operator}` : '';
}

function resetCalculator() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  waitingForNextValue = false;
  updateDisplay();
}

function inputDigit(digit) {
  if (waitingForNextValue) {
    currentValue = digit;
    waitingForNextValue = false;
  } else {
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }
}

function inputDecimal() {
  if (waitingForNextValue) {
    currentValue = '0.';
    waitingForNextValue = false;
    return;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
}

function toggleSign() {
  if (currentValue === '0' || currentValue === 'Error') return;
  currentValue = currentValue.startsWith('-') ? currentValue.slice(1) : `-${currentValue}`;
}

function percentValue() {
  if (currentValue === 'Error') return;
  currentValue = String(parseFloat(currentValue) / 100);
}

function calculate(first, second, op) {
  const num1 = parseFloat(first);
  const num2 = parseFloat(second);

  if (Number.isNaN(num1) || Number.isNaN(num2)) return '0';

  if (op === '+') return String(num1 + num2);
  if (op === '-') return String(num1 - num2);
  if (op === '×') return String(num1 * num2);
  if (op === '÷') {
    if (num2 === 0) return 'Error';
    return String(num1 / num2);
  }
  return '0';
}

function handleOperator(nextOperator) {
  if (currentValue === 'Error') {
    return;
  }

  const inputValue = currentValue;

  if (operator && waitingForNextValue) {
    operator = nextOperator;
    updateDisplay();
    return;
  }

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    currentValue = result;
    previousValue = result === 'Error' ? null : result;
  }

  waitingForNextValue = true;
  operator = nextOperator;
  updateDisplay();
}

function handleEquals() {
  if (!operator || previousValue === null || waitingForNextValue) {
    return;
  }

  const result = calculate(previousValue, currentValue, operator);
  currentValue = result;
  previousValue = result === 'Error' ? null : result;
  operator = null;
  waitingForNextValue = true;
  updateDisplay();
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');
    const value = button.getAttribute('data-value');

    switch (action) {
      case 'number':
        inputDigit(value);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'clear':
        resetCalculator();
        break;
      case 'plus-minus':
        toggleSign();
        break;
      case 'percent':
        percentValue();
        break;
      case 'operator':
        handleOperator(value);
        break;
      case 'equals':
        handleEquals();
        break;
    }

    updateDisplay();
  });
});

resetCalculator();
