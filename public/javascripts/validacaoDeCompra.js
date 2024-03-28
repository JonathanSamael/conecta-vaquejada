const formulario = document.querySelector("#formulario");
const nomeCompletoInput = document.querySelector("#nomeCompleto");
const representacaoInput = document.querySelector("#representacao");
const apelidoInput = document.querySelector("#apelido");
const cidadeInput = document.querySelector("#cidade");
const estadoInput = document.querySelector("#estado");
const cavaloPuxadorInput = document.querySelector("#cavaloPuxador");
const estreiraInput = document.querySelector("#estreira");
const cavaloEsteiraInput = document.querySelector("#cavaloEsteira");
const cpfInput = document.querySelector("#cpf");
const senhaInput = document.querySelector("#senha");


formulario.addEventListener("submit", (event) => {

     event.preventDefault();

     if (nomeCompletoInput.value === "") {
          alert("Porfavor, preencha o seu nome!");
          return;
     }

     if (nomeCompletoInput.value.length < 3) {
          alert("Porfavor, preencha o seu nome com no mínimo 3 caracteres!");
          return;
     }

     if (representacaoInput.value === "") {
          alert("Porfavor, preencha o sua representação!");
          return;
     }

     if (representacaoInput.value.length < 2) {
          alert("Porfavor, preencha a sua representção com no mínimo 2 caracteres!");
          return;
     }

     if (apelidoInput.value === "") {
          alert("Porfavor, preencha o seu apelido!");
          return;
     }

     if (apelidoInput.value.length < 3) {
          alert("Porfavor, preencha o seu apelido com no mínimo 3 caracteres!");
          return;
     }

     if (cidadeInput.value === "") {
          alert("Porfavor, preencha o nome da cidade!");
          return;
     }

     if (cidadeInput.value.length < 3) {
          alert("Porfavor, preencha o nome da cidade com no mínimo 3 caracteres!");
          return;
     }

     if (estadoInput.value === "") {
          alert("Porfavor, preencha o nome do seu estado!");
          return;
     }

     if (estadoInput.value.length < 2) {
          alert("Porfavor, preencha o nome do seu estado com no mínimo 2 caracteres!");
          return;
     }

     if (cavaloPuxadorInput.value === "") {
          alert("Porfavor, preencha o nome do seu cavalo puxador!");
          return;
     }

     if (cavaloPuxadorInput.value.length < 3) {
          alert("Porfavor, preencha o nome do seu cavalo puxador com no mínimo 3 caracteres!");
          return;
     }

     if (estreiraInput.value === "") {
          alert("Porfavor, preencha o nome do seu esteira!");
          return;
     }

     if (estreiraInput.value.length < 3) {
          alert("Porfavor, preencha o nome do seu esteira com no mínimo 3 caracteres!");
          return;
     }

     if (cavaloEsteiraInput.value === "") {
          alert("Porfavor, preencha o nome do seu cavalo esteira!");
          return;
     }

     if (cavaloEsteiraInput.value.length < 3) {
          alert("Porfavor, preencha o nome do seu cavalo esteira com no mínimo 3 caracteres!");
          return;
     }

     if (senhaInput.value === "") {
          alert("Porfavor, digite uma senha!");
          return;
     }

     if (senhaInput.value.length < 6) {
          alert("Senha com no mínimo 6 caracteres!");
          return;
     }

     if (cpfInput.value === "") {
          alert("Porfavor, digite um cpf!");
          return;
     }

     if (!cpfValido(cpfInput.value)) {
          alert("Formato do cpf esperado: 000.000.000-00");
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