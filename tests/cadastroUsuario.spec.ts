import { test, expect } from '@playwright/test';
import { LoginPage } from './support/pages/login/login';
import { CadastroUsuarioPage } from './support/pages/cadastroUsuarios/cadastroUsuario';
import { faker } from '@faker-js/faker';
import { UsuarioCadastroModel } from './fixtures/usuarioCadastro.model';
import { deleteUsuario, getUsuarioEmail } from './support/helpers';
import dataCadastro from './fixtures/cadastroUsuario.json';



let loginPage: LoginPage;
let cadastroUsuarioPage: CadastroUsuarioPage;


test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cadastroUsuarioPage = new CadastroUsuarioPage(page);
    await loginPage.go('https://front.serverest.dev/login');
    await loginPage.goCadastrarUsuario();
});


test.describe('Cadastrar usuário teste', () => {

    test('Deve cadastrar usuário administrador com sucesso', (async ({ request }) => {

        let usuarioId: string;

        const dadosCadastroSucesso: UsuarioCadastroModel = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        };

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroSucesso);
        await cadastroUsuarioPage.verificarMensagem(dataCadastro.menssagem.sucesso);

        usuarioId = await getUsuarioEmail(request, dadosCadastroSucesso.email);
        await deleteUsuario(request, usuarioId);

    }));

    test('Deve cadastrar usuário básico com sucesso', (async ({ request }) => {

        let usuarioId: string;

        const dadosCadastroSucesso: UsuarioCadastroModel = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "false"
        };

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroSucesso);
        await cadastroUsuarioPage.verificarMensagem(dataCadastro.menssagem.sucesso);

        usuarioId = await getUsuarioEmail(request, dadosCadastroSucesso.email);
        await deleteUsuario(request, usuarioId);

    }));

    test('Deve cadastrar usuário com nome email já cadastrado', (async ({ request }) => {

        let usuarioId: string;

        const dadosCadastroEmailJaCadastrado: UsuarioCadastroModel = {
            nome: faker.person.fullName(),
            email: 'fulano@qa.com',
            password: faker.internet.password(),
            administrador: "true"
        };

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroEmailJaCadastrado);
        await cadastroUsuarioPage.verificarMensagemErro(dataCadastro.menssagem.email_ja_cadastrado);

    }));


    test('Deve cadastrar usuário com email vazio', async () => {

        const dadosCadastroEmailVazio: UsuarioCadastroModel = {
            nome: faker.person.fullName(),
            email: '',
            password: faker.internet.password(),
            administrador: "true"
        }

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroEmailVazio);
        await cadastroUsuarioPage.verificarMensagemErro(dataCadastro.menssagem.email_vazio)
    })


    test('Deve cadastrar usuário com nome vazio', async () => {

        const dadosCadastroNomeVazio: UsuarioCadastroModel = {
            nome: '',
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        }

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroNomeVazio);
        await cadastroUsuarioPage.verificarMensagemErro(dataCadastro.menssagem.nome_vazio)
    })


    test('Deve cadastrar usuário com password vazio', async () => {

        const dadosCadastroPasswordVazio: UsuarioCadastroModel = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: '',
            administrador: "true"
        }

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroPasswordVazio);
        await cadastroUsuarioPage.verificarMensagemErro(dataCadastro.menssagem.password_vazio)
    })

    test('Deve cadastrar usuário com email inválido', async () => {

        const dadosCadastroEmailInvalido: UsuarioCadastroModel = {
            nome: faker.person.fullName(),
            email: faker.internet.password(),
            password: faker.internet.password(),
            administrador: "true"
        }

        await cadastroUsuarioPage.preencherCadastroUsuario(dadosCadastroEmailInvalido);
        const valdationMessage = await loginPage.emailInput.evaluate(e => (e as HTMLInputElement).validationMessage);
        expect(valdationMessage).toContain(dataCadastro.menssagem.email_invalido)

    })

});