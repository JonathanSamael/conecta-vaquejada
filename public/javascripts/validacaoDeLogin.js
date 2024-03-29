const formulario = document.querySelector("#formulario");
const cpfInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha");
const opcaoSelecionadaInput = document.querySelector("input[name='opcao_login']:checked");

formulario.addEventListener("submit", (event) => {

     event.preventDefault();

     if (cpfInput.value === "") {
          alert("Porfavor, digite um cpf!");
          return;
     }

     if (!cpfValido(cpfInput.value)) {
          alert("Formato do cpf esperado: 000.000.000-00");
          return;
     }

     if (senhaInput.value === "") {
          alert("Porfavor, digite sua senha!");
          return;
     }

     if (senhaInput.value.length < 6) {
          alert("Senhas tem no mínimo 6 caracteres!");
          return;
     }

     formulario.submit();

});

function cpfValido(cpf) {
     const cpfRegex = new RegExp(
          // FORMATO ESPERADO: `000.000.000-00`
          /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
     );

     if (cpfRegex.test(cpf)) {
          return true;
     }

     return false;
}
