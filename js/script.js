$(document).ready(function () {
  const display = $('#display');
  let expression = '';
  let memory = '';
  let angleMode = 'DEG';
  const history = [];

  const buttons = [
    '7', '8', '9', '/', 
    '4', '5', '6', '*', 
    '1', '2', '3', '-', 
    '0', '.', '=', '+',
    '(', ')', '^', '√',
    'sin', 'cos', 'tan', 'log',
    'ln', 'π', 'e', '!',
    'C', 'DEL'
  ];

  let buttonHTML = '';
  buttons.forEach(value => {
    buttonHTML += `
      <div class="col-3">
        <button class="btn btn-secondary w-100 fs-5" data-value="${value}">${value}</button>
      </div>`;
  });
  $('.row.g-2').html(buttonHTML);

  $('button[data-value]').on('click', function () {
    const val = $(this).data('value');

    if (val === '=') {
      try {
        let input = expression
          .replace(/π/g, 'pi')
          .replace(/e/g, 'e')
          .replace(/√/g, 'sqrt')
          .replace(/log/g, 'log10')
          .replace(/ln/g, 'log')
          .replace(/([0-9])\s*!/g, 'factorial($1)');
    
        if (angleMode === 'DEG') {
          input = input.replace(/sin\(([^)]+)\)/g, (_, g1) => `sin((${g1}) * pi / 180)`);
          input = input.replace(/cos\(([^)]+)\)/g, (_, g1) => `cos((${g1}) * pi / 180)`);
          input = input.replace(/tan\(([^)]+)\)/g, (_, g1) => `tan((${g1}) * pi / 180)`);
        }
    
        let result = math.evaluate(input);
        Swal.fire('Resultado', `🧮 ${expression} = <b>${result}</b>`, 'success');
        history.push(`${expression} = ${result}`);
        updateHistory();
        expression = result.toString();
        display.val(expression);
      } catch (error) {
        Swal.fire('Error', 'Expresión inválida', 'error');
      }
    } else if (val === 'C') {
      expression = '';
      display.val('');
    } else if (val === 'DEL') {
      expression = expression.slice(0, -1);
      display.val(expression);
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(val)) {
      expression += `${val}(`;
      display.val(expression);
    } else if (val === 'π' || val === 'e') {
      expression += val;
      display.val(expression);
    } else if (val === '!') {
      expression += '!';
      display.val(expression);
    } else {
      expression += val;
      display.val(expression);
    }
  });

  function updateHistory() {
    let html = '<h5>📜 Historial:</h5><ul>';
    history.slice(-10).forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += '</ul>';
    $('#history').html(html);
  }

  $('#toggle-angle').click(function () {
    angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    $(this).text(`Modo: ${angleMode}`);
  });

  $('#clear-memory').click(() => {
    memory = '';
    Swal.fire('Memoria', 'Memoria limpiada (MC)', 'info');
  });

  $('#recall-memory').click(() => {
    if (memory !== '') {
      expression += memory;
      display.val(expression);
    }
  });

  $('#save-memory').click(() => {
    memory = display.val();
    Swal.fire('Memoria', `Valor guardado: ${memory}`, 'success');
  });
});
