var express = require('express');
var router = express.Router();

var kenxConfig = require('../knexfile');
var knex = require('knex')(kenxConfig);

const requerAutenticacao = require('../middlewares/requerAutenticacao');

const bcrypt = require('bcrypt');

// Multer, responsavel pelo armazenamento das imagens
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'photo') {
      cb(null, './public/images/cards');
    } else if (file.fieldname === 'banner') {
      cb(null, './public/images/banner');
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// ADICIONA A VAQUEJA E SUAS CATEGORIAS NO BANCO DE DADOS;
const photo = { name: 'photo', maxCount: 1 };
const banner = { name: 'banner', maxCount: 1 };

router.post('/adicionar_vaquejadas', [requerAutenticacao], upload.fields([photo, banner]), async (req, res) => {

  try {

    const {
      nomeVaquejada,
      nomeDono,
      status,
      descricaoVaquejada,
      nomeCategoria,
      numeroDeSenhasPorCategoria,
      numeroSenhasPessoa,
      precoPadraoPorcategoria,
      regrasDaVaquejada,
      ordemDaVaquejada
    } = req.body;

    if (
      !nomeVaquejada
      || !nomeDono
      || !status
      || !descricaoVaquejada
      || !nomeCategoria
      || !numeroDeSenhasPorCategoria
      || !numeroSenhasPessoa
      || !precoPadraoPorcategoria
      || !regrasDaVaquejada
      || !ordemDaVaquejada
    ) {
      const error = new Error('Campos não adicionados ou incompletos!');
      error.code = 400;
      throw error;
    }

    // ADICIONA A VAQUEJADA NA TABLEA VAQUEJADAS NO BD;
    const [vaquejadaID] = await knex.table('vaquejadas').insert({
      nome: nomeVaquejada,
      nome_dono: nomeDono,
      status: status,
      foto: req.files['photo'][0].filename,
      banner: req.files['banner'][0].filename,
      descriçao: descricaoVaquejada,
      regras: regrasDaVaquejada,
      ordem: ordemDaVaquejada
    });

    if (!vaquejadaID) {
      const error = new Error('vaquejada não adicionada');
      error.code = 404;
      throw error;
    };

    // ADICIONA AS CATEGORIAS DA VAQUEJADA NA TABELA CATEGORIAS;

    // PARA CADA CATEGORIA
    for (var i = 0; i < nomeCategoria.length; i++) {
      const [categoria] = await knex.table('categorias').insert({
        vaquejada_id: vaquejadaID,
        nome: nomeCategoria[i],
        quantidade_de_senhas: numeroDeSenhasPorCategoria[i],
        quantidade_por_cpf: numeroSenhasPessoa[i],
        preçoPadrão: precoPadraoPorcategoria[i]
      });

      if (!categoria) {
        const error = new Error('Categoria não adicionada');
        error.code = 404;
        throw error;
      }

    }

    // REDIRECIONA PARA A PAGINA DAS SENHAS;
    res.redirect(`/inputs-de-valores-das-senhas?id=${vaquejadaID}`);

  } catch (error) {

    if (error.code) {
      const code = error.code;
      if (code === 400 || code === 404) {
        res.redirect(`/adicionar_vaquejada_no_bd?erro=${error.message}`);
      } else {
        res.redirect(`/erro?erro=${code}`);
      }
    } else {
      res.redirect(`/erro?erro=500`); // Erro interno do servidor
    }


  };

});

// DEFINIR A VAQUEJADA COMO FINALIZADA;
router.post('/finalizarVaquejada/:idVaquejada', [requerAutenticacao], upload.none(), async (req, res) => {

  try {
    await knex.from('vaquejadas').where('id', req.params.idVaquejada).update({ status: 'finalizado' });
    const vaquejada = await knex.select().from('vaquejadas').where('id', req.params.idVaquejada).first();
    console.log(vaquejada);
    res.redirect('/adm');
  } catch (error) {
    res.redirect(`/erro?erro=${400}`);
  }

});

// ADICIONA AS SENHAS NO BANCO DE DADOS;
router.post('/adicionarSenhas', [requerAutenticacao], upload.none(), async (req, res) => {

  try {

    const { numeroDaSenha, preco, statusDaSenha } = req.body;

    const vaquejada_id = req.query.id;
    const categoriasDoBD = await knex.select().from('categorias').where('vaquejada_id', vaquejada_id);

    const senhas = {};

    for (const key in numeroDaSenha) {

      const [categoria, index] = key.split('-');
      const numero = numeroDaSenha[key];
      const precoSenha = preco[`${categoria}-${index}`];
      const statusSenha = statusDaSenha[`${categoria}-${index}`];

      if (!senhas[categoria]) {
        senhas[categoria] = [];
      }

      senhas[categoria].push({
        numero,
        preco: precoSenha,
        status: statusSenha
      });

    }

    let idCategorias = [];
    categoriasDoBD.forEach((categoria) => {
      let cat = {};
      cat[categoria.nome] = categoria.id;
      idCategorias.push(cat);
    });

    for (const categoria in senhas) {
      const senhaDaCategoria = senhas[categoria]

      const idDaCategoriaObjeto = idCategorias.find(categoriaObjeto => categoriaObjeto[categoria]);
      const idDaCategoria = idDaCategoriaObjeto ? idDaCategoriaObjeto[categoria] : null;

      for (const senha of senhaDaCategoria) {
        await knex.table('senhas').insert({
          numero: senha.numero,
          preço: senha.preco,
          status: senha.status,
          categoria_id: idDaCategoria,
          vaqueja_id: vaquejada_id
        });
      }
    }

    res.redirect('/vaquejadasParaAdms');

  } catch (error) {

    const senhasDaVaquejada = await knex.select().from('senhas').where('vaqueja_id', req.query.id);
    for (const senha of senhasDaVaquejada) {
      await knex.table('senhas').where('id', senha.id).del();
    }

    for (const categoria of categoriasDoBD) {
      await knex.table('categorias').where('id', categoria.id).del();
    }

    await knex.table('vaquejadas').where('id', req.query.id).del();
    res.redirect(`/adicionar_vaquejada_no_bd?erro=ErroNasSenhas`);

  }

});

// FORMULARIO DE CADASTRO DE COMPRA;
router.post('/cadastroDeCompra', upload.none(), async (req, res) => {

  try {

    const idSenha = req.query.idSenha;
    const idVaquejada = req.query.idVaquejada;

    const { categoriaSenha, nomeCompleto, cpf, senha, apelido, cidade, estado, cavaloPuxador, esteira, cavaloEsteira, representacao } = req.body;

    if (!categoriaSenha || !nomeCompleto || !cpf || !senha || !apelido || !cidade || !estado || !cavaloPuxador || !esteira || !cavaloEsteira || !representacao) {
      const error = new Error('Valores Não Adicionados!');
      error.code = 400;
      throw error;
    }

    const comprador = await knex.select().from('compradores').where('cpf', cpf).first();

    if (comprador) {

      await knex.table('senhasporcomprador').insert({
        idComprador: comprador.id,
        idSenha: idSenha,
        apelido: apelido,
        cidade: cidade,
        estado: estado,
        cavalo_puxador: cavaloPuxador,
        cavalo_esteira: cavaloEsteira,
        esteira: esteira,
        representação: representacao,
      });

      await knex('senhas').where({ id: idSenha }).update({ status: "RESERVADA" });
      await knex('compradores').where({ id: comprador.id }).update({ senhaDeLogin: bcrypt.hashSync(senha, 10) });

      res.redirect(`/selecionar-categoria-senha?idVaquejada=${idVaquejada}&idCategoria=${categoriaSenha}&senhaExistente=true`);

    } else {

      const [idDoComprador] = await knex.table('compradores').insert({
        cpf: cpf,
        senhaDeLogin: bcrypt.hashSync(senha, 10),
        nome: nomeCompleto
      });

      await knex.table('senhasporcomprador').insert({
        idComprador: idDoComprador,
        idSenha: idSenha,
        apelido: apelido,
        cidade: cidade,
        estado: estado,
        cavalo_puxador: cavaloPuxador,
        cavalo_esteira: cavaloEsteira,
        esteira: esteira,
        representação: representacao,
      });

      await knex('senhas').where({ id: idSenha }).update({ status: "RESERVADA" });
      res.redirect(`/selecionar-categoria-senha?idVaquejada=${idVaquejada}&idCategoria=${categoriaSenha}`);

    }

  } catch (error) {

    if (error.code) {
      if (error.code == 400) {

        res.redirect(`/cadastro-de-compra?idVaquejada=${req.query.idVaquejada}&senha=${req.query.idSenha}&erro=${error.message}`);

      } else {

        res.redirect(`/erro?erro=${error.code}`);

      }
    } else {

      res.redirect(`/erro?erro=500`); // Erro interno do servidor

    }

  }

});

// ALTERA O STATUS DA SENHA SELECIONADA;
router.post('/alterarStatus/:idSenha/:idVaquejada', [requerAutenticacao], upload.none(), async (req, res) => {
  try {
    const statusDaSenha = req.body.statusDaSenha;
    await knex.table('senhas').where('id', req.params.idSenha).update({ status: statusDaSenha });

    res.redirect(`/senhas_config/${req.params.idVaquejada}`);

  } catch (error) {

    res.redirect(`/senhas_config/${req.params.idVaquejada}?erro=${error.message}`);

  }
});

// ADICIONAR SOLICTAÇÃO DE CADASTRO DE VAQUEJADA:
router.post('/solicitacao', async (req, res) => {
  try {
    const { nomeCompleto, cidade, estado, nomeVaquejada, numeroContato } = req.body;

    if (!nomeCompleto || !cidade || !estado || !nomeVaquejada || !numeroContato) {
      throw new Error("Valores não adicionados")
    }

    const [id] = await knex.table('solicitacoes').insert({
      nomeCompleto: nomeCompleto,
      cidade: cidade,
      estado: estado,
      nomeVaquejada: nomeVaquejada,
      numeroContato: numeroContato
    });

    if (!id) {
      throw new Error("Não adicionado")
    }

    res.redirect("/");

  } catch (error) {
    res.redirect(`/adicionar-vaquejada?ERRO=${error.message}`);
  }
});

// DELETA UMA SOLICITAÇÃO ESPECIFICA
router.post("/apagarSolicitacao/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await knex('solicitacoes').where('id', id).del();
    res.redirect("/solicitacoes");
  } catch (error) {
    res.redirect(`/solicitacoes?erro=${error}`);
  }
});

// ROTAS DE AUTENTICAÇÃO:

// ROTA DE LOGIN;
router.post('/login', upload.none(), async (req, res) => {

  try {

    const { cpf, senha, opcao_login } = req.body

    if (!cpf || !senha || !opcao_login) {
      throw new Error('Campos não informados!');
    }

    if (opcao_login == 'vaqueiro') {

      const comprador = await knex.select().from('compradores').where('cpf', cpf).first();

      if (!comprador) {
        throw new Error('nenhum vaqueiro encontrado com esse cpf!');
      };

      if (bcrypt.compareSync(senha, comprador.senhaDeLogin)) {
        req.session.logged_as = null;
        res.redirect(`/loginVaqueiro/${comprador.id}`)
      } else {
        throw new Error('A senha do vaqueiro está incorreta?!');
      };

    } else if (opcao_login == 'administrador') {

      const administrador = await knex.select().from('administradores').where('cpf', cpf).first();

      if (!administrador) { throw new Error('Administrador não cadastrado!'); };

      if (administrador.senha == senha) {
        req.session.logged_as = administrador.id;
        res.redirect('/adm');
      } else {
        req.session.logged_as = null;
        throw new Error('Senha do administrador está incorreta?!');
      }

    }
  } catch (error) {
    res.redirect(`/login?erroDeLogin=${error}`);
  }

});

// DESLOGAR
router.get('/deslogar', (req, res) => {

  try {
    req.session = null;
    res.redirect('/');
  } catch (error) {
    res.redirect(`/erro?erro=500`);
  }

});

module.exports = router;
