const formulario = document.querySelector("#formulario");
const nomeCompletoInput = document.querySelector("#nomeCompleto");
const cidadeInput = document.querySelector("#cidade");
const estadoInput = document.querySelector("#estado");
const nomeVaquejadaInput = document.querySelector("#nomeVaquejada");
const numeroContatoInput = document.querySelector("#numeroContato");

formulario.addEventListener("submit", (event) => {
     event.preventDefault();

     if (nomeCompletoInput.value === "") {
          alert("Porfavor, preencha o seu nome!");
          return;
     }

     if (nomeCompletoInput.value.length < 3) {
          alert("Porfavor, preencha com o nome completo!");
          return;
     }

     if (cidadeInput.value === "") {
          alert("Porfavor, informe o nome da cidade!");
          return;
     }

     if (cidadeInput.value.length < 3) {
          alert("Porfavor, preencha o nome da cidade com mais de 3 caracteres!");
          return;
     }

     if (estadoInput.value === "") {
          alert("Porfavor, informe o estado!");
          return;
     }

     if (estadoInput.value.length < 2) {
          alert("Porfavor, preencha o seu nome do estado com no minimo 2 caracteres!");
          return;
     }

     if (nomeVaquejadaInput.value === "") {
          alert("Porfavor, informe o nome da vaquejada!");
          return;
     }

     if (nomeVaquejadaInput.value.length < 3) {
          alert("Porfavor, preencha o seu nome da vaquejada com mais de 3 caracteres!");
          return;
     }

     if (numeroContatoInput.value === "") {
          alert("Porfavor, digite um numero para contato!");
          return;
     }

     if (!telefoneValido(numeroContatoInput.value)) {
          alert("Formato de número esperado: (00) 00000-0000");
          return;
     }

     formulario.submit();
});

function telefoneValido(telefone) {
     const telefoneRegex = new RegExp(
          // FORMATO ESPERADO: `(00) 0000-0000`, `(00) 00000-0000`, `0000-0000`, `00 0000-0000`, `(00)00000000`, `00000000000`
          /^\(?\d{2}\)? ?(?:\d{5}-?\d{4}|\d{4,5}-?\d{4})$/
     );

     if (telefoneRegex.test(telefone)) {
          return true;
     }

     return false;
}
