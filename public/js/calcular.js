document.getElementById("calculate-btn").addEventListener("click", function () {
    const length = parseFloat(document.getElementById("length").value);
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
  
    if (!length || !width || !height || !weight) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
  
    const volume = length * width * height;
    const price = (volume * 0.00005 + weight * 5).toFixed(2); // Fórmula exemplo
  
    document.getElementById("dimension").innerText = `Volume da Caixa: ${volume} cm³`;
    document.getElementById("price").innerText = `Valor Estimado: R$ ${price}`;
  });
  