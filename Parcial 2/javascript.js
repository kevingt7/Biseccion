function limpiar() {
  document.getElementById('clean').reset();
}
function interLineal() {
  // Obtenemos los valores ingresados por el usuario
  let fx = document.getElementById("function").value;
  let xl = parseFloat(document.getElementById("Xl").value);
  let xu = parseFloat(document.getElementById("Xu").value);
  let error = parseFloat(document.getElementById("stopCriteria").value);
  let xm = 0.0;

  // Verificamos que los valores sean válidos
  if (isNaN(xl) || isNaN(xu) || isNaN(error)) {
    alert("Ingrese valores válidos para los límites y el criterio de paro.");
    return;
  }

  // Verificamos que la función tenga una raíz en el intervalo dado
  if (evaluarFuncion(fx, xl) * evaluarFuncion(fx, xu) > 0) {
    alert("La función no tiene una raíz en el intervalo dado.");
    return;
  }

  let iteracion = 1;
  let errorRelativo = 100;

  // Realizamos el método de bisección
  while (errorRelativo > error) {
    xm = (xl + xu) / 2;
    let fxm = evaluarFuncion(fx, xm);

    // Verificamos si xm es la raíz exacta
    if (fxm == 0) {
      break;
    }

    // Actualizamos los límites
    if (evaluarFuncion(fx, xl) * fxm < 0) {
      xu = xm;
    } else {
      xl = xm;
    }

    // Calculamos el error relativo
    let xmAnterior = xm;
    xm = (xl + xu) / 2;
    errorRelativo = Math.abs((xm - xmAnterior) / xm) * 100;

    iteracion++;
  }

  // Truncar el resultado de xm a 8 decimales
  document.getElementById("fxvalue").value = xm.toFixed(8);

  // Truncar el error relativo a 8 decimales
  document.getElementById("ePorcentual").value = errorRelativo.toFixed(8) + "%";
}

function evaluarFuncion(fx, x) {
  // Reemplazamos la variable x por el valor dado y evaluamos la función
  return eval(fx.replace(/x/g, x));
}

function limpiar() {
  // Limpiamos los campos de la página
  document.getElementById("function").value = "";
  document.getElementById("Xl").value = "";
  document.getElementById("Xu").value = "";
  document.getElementById("stopCriteria").value = "";
  document.getElementById("fxvalue").value = "";
  document.getElementById("ePorcentual").value = "";
}

console.log = function () {};