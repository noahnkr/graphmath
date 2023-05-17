import MathExpression from "../calc/expression.js";
import { functions, addFunction, drawFunctions, render } from "./grapher.js";

const functionColors = {
    red: {
        function: '#E57373',
        focus: '#FFEBEE'
    },
    magenta: {
        function: '#F06292',
        focus: '#FCE4EC'
    },
    purple: {
        function: '#BA68C8',
        focus: '#F3E5F5'
    },
    darkblue: {
        function: '#7986CB',
        focus: '#E8EAF6'
    },
    lightblue: {
        function: '#4FC3F7',
        focus: '#E1F5FE'
    },
    cyan: {
        function: '#F9FBE7',
        focus: '#F9FBE7'
    },
    teal: {
        function: '#009688',
        focus: '#E0F2F1'
    },
    green: {
        function: '#E1F5FE',
        focus: '#E8F5E9'
    },
    lime: {
        function: '#DCE775',
        focus: '#F9FBE7'
    },
    yellow: {
        function: '#F9FBE7',
        focus: '#FFFDE7'
    },
    amber: {
        function: '#F9FBE7',
        focus: '#F9FBE7'
    },
    orange: {
        function: '#F9FBE7',
        focus: '#F9FBE7'
    },
    bluegrey: {
        function: '#90A4AE',
        focus: '#ECEFF1'
    }
}

const addInputButton = document.getElementById('add-input-button');
addInputButton.addEventListener('click', () => { addInput() });

export function updateInputValues() {
    for (var i in functions) {
        var value = document.getElementById('function-input-' + i).value;
        functions[i].expression = value;

        if (value === '') {
            document.getElementById('function-symbol-' + i).src = '';
        } else {
            document.getElementById('function-symbol-' + i).src = '../assets/function.png';
        }

        try {
            MathExpression.evaluate(value);
        } catch(err) {
            if (value !=- '') {
                document.getElementById('function-symbol-' + i).src = '../assets/caution.png';
            }
        }
    }

    drawFunctions();
    render();
}

export function addInput() {
    const index = functions.length;

    var values = Object.values(functionColors);
    var rand = Math.floor(Math.random() * values.length);
    const color = values[rand];

    addFunction('', color.function);

    var functionContainer = document.createElement('div');
    functionContainer.className = 'function-container';
    functionContainer.id = 'function-container-' + index;

    var functionSymbol = document.createElement('img');
    functionSymbol.className = 'function-symbol';
    functionSymbol.id = 'function-symbol-' + index;
    functionSymbol.src = '';

    var functionLabel = document.createElement('div');
    functionLabel.className = 'function-label';

    
    functionLabel.appendChild(functionSymbol);

    var functionInput = document.createElement('input');
    functionInput.className = 'function-input';
    functionInput.id = 'function-input-' + index;
    functionInput.value = functions[index].expression;
    functionInput.oninput = updateInputValues;

    functionInput.addEventListener('focus', () => {
        
        functionContainer.style.backgroundColor = color.focus;
    });
    functionInput.addEventListener('blur', () => {
        functionContainer.style.backgroundColor =  '#ddd';
    })

    
    functionContainer.appendChild(functionLabel);
    functionContainer.appendChild(functionInput);

    var container = document.getElementById('functions');
    container.appendChild(functionContainer);
}

