/** MÉTODO DE LA SECANTE */

window.onload = () => {
  resetValues(); 

  // Mostrar el criterio de paro elegido
  let stopMethods = document.getElementById("stopMethods");
  stopMethods.value = '0';
  stopMethods.addEventListener('change', function() {
    switch (this.value) {
      case '0': // Error relativo
        document.getElementById("iteration").value = 0;
        document.getElementById("iterationMethod").style.display = "none";
        document.getElementById("criteriaMethod").style.display = "block";
        break;
      case '1': // Iteraciones fijas
        document.getElementById("criteria").value = 0;
        document.getElementById("criteriaMethod").style.display = "none";
        document.getElementById("iterationMethod").style.display = "block";
        break;
      case '2': // Default (error fijo)
        document.getElementById("iterationMethod").style.display = "none";
        document.getElementById("criteriaMethod").style.display = "none";
        break;
    }
  });

  // Calcular resultado
  document.getElementById('result').addEventListener('click', function() {
    let xL = document.getElementById('xL').value;
    let xU = document.getElementById('xU').value;
    let squareVal = document.getElementById('xSqr').value;
    let linVal = document.getElementById('xLnl').value;
    let independentVal = document.getElementById('indVal').value;
    let criteriaOption = document.getElementById('stopMethods').value;

    // Validar que los campos no estén vacíos ni incorrectos
    let values = [xL, xU, squareVal, linVal, independentVal];
    let validation = checkValues(values, +criteriaOption);

    ocultarWarnings(); // Limpia advertencias previas

    switch (validation) {
      case 4:
        let calculator = new Secant();
        let res = calculator.secant(+xL, +xU, +squareVal, +linVal, +independentVal, +criteriaOption);
        document.getElementById("root").value = res;
        break;
      case 3:
        mostrarWarning('Warningnumber');
        break;
      case 1:
        mostrarWarning('Warningpercentaje');
        break;
      case 2:
        mostrarWarning('Warningiterationin');
        break;
      case 5:
        mostrarWarning('Warningsame');
        break;
    }
  });

  // Resetear valores
  document.getElementById('reset').addEventListener('click', resetValues);
}

// ----- Funciones auxiliares -----

function resetValues() {
  document.getElementById('xL').value = 0;
  document.getElementById('xU').value = 0;
  document.getElementById('xSqr').value = 0;
  document.getElementById('xLnl').value = 0;
  document.getElementById('indVal').value = 0;
  document.getElementById('criteria').value = 0;
  document.getElementById('iteration').value = 0;
  document.getElementById('root').value = 0;
  ocultarWarnings();
}

function checkValues(values, criteriaOption) {
  for (let val of values) {
    if (isNotNumberValid(val)) return 3; // valor no numérico
  }

  // Verificar criterio de paro
  if (criteriaOption == 0) {
    let percentage = document.getElementById('criteria').value;
    if (isNotNumberValid(percentage)) return 3;
    if (percentage <= 0) return 1;
  }

  if (criteriaOption == 1) {
    let iterations = document.getElementById('iteration').value;
    if (isNotNumberValid(iterations)) return 3;
    if (iterations <= 0) return 1;
    if (!(iterations % 1 == 0)) return 2;
  }

  if (values[0] == values[1]) return 5; // xL == xU

  return 4; // Todo correcto
}

function isNotNumberValid(val) {
  if (val == "0" || val == 0) return false;
  return isNaN(parseFloat(val)) || val.toString().trim() === "";
}

function mostrarWarning(id) {
  const elem = document.getElementById(id);
  if (elem) elem.style.display = "block";
}

function ocultarWarnings() {
  const ids = ['Warningnumber', 'Warningpercentaje', 'Warningiterationin', 'Warningsame'];
  ids.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) elem.style.display = "none";
  });
}

// ----- Clase Secant -----
class Secant {
  secant(xL, xU, squareVal, linVal, independentVal, criteriaOption) {
    let fXL = this.functionX(xL, squareVal, linVal, independentVal);
    let fXU = this.functionX(xU, squareVal, linVal, independentVal);
    let xR = xU - ((fXU * (xL - xU)) / (fXL - fXU));
    let criteria = 0, count = 0;

    do {
      xL = xU;
      xU = xR;
      fXL = this.functionX(xL, squareVal, linVal, independentVal);
      fXU = this.functionX(xU, squareVal, linVal, independentVal);
      xR = xU - ((fXU * (xL - xU)) / (fXL - fXU));

      if (criteriaOption == 0 || criteriaOption == 2)
        criteria = this.relativeError(xR, xU);
      else if (criteriaOption == 1)
        count++;

    } while (!this.evaluateStop(criteria, count, criteriaOption));

    return xR;
  }

  functionX(x, squareVal, linVal, independentVal) {
    return (squareVal * (x * x)) + (linVal * x) + independentVal;
  }

  relativeError(newVal, previousVal) {
    if (newVal === 0) return 0;
    let error = Math.abs(((newVal - previousVal) / newVal) * 100);
    return error;
  }

  evaluateStop(criteria, count, option) {
    switch (option) {
      case 0: // porcentaje
        return criteria <= +(document.getElementById('criteria').value);
      case 1: // número de iteraciones
        return count >= +(document.getElementById('iteration').value);
      case 2: // default
        return criteria <= 0.001;
      default:
        return true;
    }
  }
}
