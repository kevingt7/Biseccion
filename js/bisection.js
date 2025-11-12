/** MÉTODO DE BISECCIÓN */

window.onload = () => {
  resetValues();

  // Mostrar criterio de paro elegido
  const stopMethods = document.getElementById("stopMethods");
  stopMethods.value = "0";
  stopMethods.addEventListener("change", function () {
    switch (this.value) {
      case "0": // porcentaje
        document.getElementById("iteration").value = 0;
        document.getElementById("iterationMethod").style.display = "none";
        document.getElementById("criteriaMethod").style.display = "block";
        break;
      case "1": // iteraciones
        document.getElementById("criteria").value = 0;
        document.getElementById("criteriaMethod").style.display = "none";
        document.getElementById("iterationMethod").style.display = "block";
        break;
      case "2": // error fijo
        document.getElementById("iterationMethod").style.display = "none";
        document.getElementById("criteriaMethod").style.display = "none";
        break;
    }
  });

  // Calcular resultado
  document.getElementById("resultBisec").addEventListener("click", function () {
    const xL = document.getElementById("xL").value;
    const xU = document.getElementById("xU").value;
    const squareVal = document.getElementById("xSqr").value;
    const linVal = document.getElementById("xLnl").value;
    const independentVal = document.getElementById("indVal").value;
    const criteriaOption = document.getElementById("stopMethods").value;

    let values = [xL, xU, squareVal, linVal, independentVal];
    let validation = checkValues(values, +criteriaOption);

    ocultarWarnings();

    switch (validation) {
      case 4:
        let calc = new Bisection();
        let res = calc.bisection(+xL, +xU, +squareVal, +linVal, +independentVal, +criteriaOption);
        document.getElementById("root").value = res.toFixed(6);
        break;
      case 3:
        mostrarWarning("Warningnumber");
        break;
      case 1:
        mostrarWarning("Warningpercentaje");
        break;
      case 2:
        mostrarWarning("Warningiterationin");
        break;
      case 5:
        mostrarWarning("Warningsame");
        break;
    }
  });

  // Resetear valores
  document.getElementById("reset").addEventListener("click", resetValues);
};

// ================= FUNCIONES AUXILIARES =================

function resetValues() {
  document.getElementById("xL").value = 0;
  document.getElementById("xU").value = 0;
  document.getElementById("xSqr").value = 0;
  document.getElementById("xLnl").value = 0;
  document.getElementById("indVal").value = 0;
  document.getElementById("criteria").value = 0;
  document.getElementById("iteration").value = 0;
  document.getElementById("root").value = 0;
  ocultarWarnings();
}

function checkValues(values, criteriaOption) {
  for (let val of values) {
    if (isNotNumberValid(val)) return 3;
  }

  if (criteriaOption == 0) {
    let percentage = document.getElementById("criteria").value;
    if (isNotNumberValid(percentage)) return 3;
    if (percentage <= 0) return 1;
  }

  if (criteriaOption == 1) {
    let iterations = document.getElementById("iteration").value;
    if (isNotNumberValid(iterations)) return 3;
    if (iterations <= 0) return 1;
    if (!(iterations % 1 == 0)) return 2;
  }

  if (values[0] == values[1]) return 5;

  return 4;
}

function isNotNumberValid(val) {
  if (val == "0" || val == 0) return false;
  return isNaN(parseFloat(val)) || val.toString().trim() === "";
}

function mostrarWarning(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function ocultarWarnings() {
  const ids = ["Warningnumber", "Warningpercentaje", "Warningiterationin", "Warningsame"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// ================= CLASE DE BISECCIÓN =================

class Bisection {
  bisection(xL, xU, squareVal, linVal, independentVal, criteriaOption) {
    let fXL = this.functionX(xL, squareVal, linVal, independentVal);
    let fXU = this.functionX(xU, squareVal, linVal, independentVal);

    // Comprobación de signo (debe haber cambio de signo entre extremos)
    if (fXL * fXU > 0) {
      alert("No hay cambio de signo entre xL y xU. La función no tiene raíz en ese intervalo.");
      return 0;
    }

    let xR = (xL + xU) / 2;
    let fXR = this.functionX(xR, squareVal, linVal, independentVal);
    let prevXR = xR;
    let error = 100;
    let count = 0;

    do {
      if (fXL * fXR < 0) {
        xU = xR;
        fXU = fXR;
      } else {
        xL = xR;
        fXL = fXR;
      }

      prevXR = xR;
      xR = (xL + xU) / 2;
      fXR = this.functionX(xR, squareVal, linVal, independentVal);

      if (criteriaOption == 0 || criteriaOption == 2)
        error = this.relativeError(xR, prevXR);
      else if (criteriaOption == 1)
        count++;

    } while (!this.evaluateStop(error, count, criteriaOption));

    return xR;
  }

  functionX(x, squareVal, linVal, independentVal) {
    return squareVal * (x * x) + linVal * x + independentVal;
  }

  relativeError(newVal, prevVal) {
    if (newVal === 0) return 0;
    return Math.abs(((newVal - prevVal) / newVal) * 100);
  }

  evaluateStop(error, count, option) {
    switch (option) {
      case 0: // Porcentaje
        return error <= +document.getElementById("criteria").value;
      case 1: // Iteraciones
        return count >= +document.getElementById("iteration").value;
      case 2: // Error fijo
        return error <= 0.001;
      default:
        return true;
    }
  }
}
