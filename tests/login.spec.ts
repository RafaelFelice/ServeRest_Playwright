import { test, expect } from '@playwright/test';
import { LoginModel } from './fixtures/login.model';
import { UsuarioCadastroModel } from './fixtures/usuarioCadastro.model';
import { LoginPage } from './support/pages/login/login';
import { HomePage } from './support/pages/home/home';
import { postCadastrarUsuario, deleteUsuario } from './support/helpers';
import { faker } from '@faker-js/faker';

import dataLogin from './fixtures/login.json';

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.go('https://front.serverest.dev/login');
});

test.describe('Login Tests', () => {

    let usuarioId: string;

    const usuarioBase: UsuarioCadastroModel = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: "true"
    };

    test.beforeAll(async ({ request }) => {
        try {
            usuarioId = await postCadastrarUsuario(request, usuarioBase);
            console.log(`[SETUP] Usuário base criado com ID: ${usuarioId}`);
        } catch (error) {
            console.error("Falha CRÍTICA no beforeAll: não foi possível criar o usuário base.", error);
            throw new Error("Setup para os testes de login falhou.");
        }
    });

    test.afterAll(async ({ request }) => {
        if (usuarioId) {
            await deleteUsuario(request, usuarioId);
            console.log(`[CLEANUP] Usuário base com ID ${usuarioId} deletado.`);
        }
    });

    test('deve realizar login com sucesso', async () => {
        const dadosLoginSucesso: LoginModel = {
            email: usuarioBase.email,
            password: usuarioBase.password
        };

        await loginPage.preencherLogin(dadosLoginSucesso);
        await homePage.verificarMensagemBoasVindas()
    })

    test('erro ao realizar login com email incorreto', async () => {
        const dadosLoginEmailIncorreto: LoginModel = {
            email: faker.internet.email(),
            password: usuarioBase.password
        };

        await loginPage.preencherLogin(dadosLoginEmailIncorreto);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.email_e_password);
    })

    test('erro ao realizar login com password incorreto', async () => {
        const dadosLoginPasswordIncorreto: LoginModel = {
            email: usuarioBase.email,
            password: faker.internet.password()
        };

        await loginPage.preencherLogin(dadosLoginPasswordIncorreto);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.email_e_password);
    })

    test('erro ao realizar login com email e password incorretos', async () => {
        const dadosLoginEmailPasswordIncorreto: LoginModel = {
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        await loginPage.preencherLogin(dadosLoginEmailPasswordIncorreto);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.email_e_password);
    })

    test('erro ao realizar login com email vazio', async () => {
        const dadosLoginEmailvazio: LoginModel = {
            email: '',
            password: usuarioBase.password
        };

        await loginPage.preencherLogin(dadosLoginEmailvazio);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.email_vazio);
    })

    test('erro ao realizar login com password vazio', async () => {
        const dadosLoginPasswordVazio: LoginModel = {
            email: usuarioBase.email,
            password: ''
        };

        await loginPage.preencherLogin(dadosLoginPasswordVazio);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.password_vazio);
    })

    test('erro ao realizar login com email e password vazios', async () => {
        const dadosLoginEmailPasswordVazio: LoginModel = {
            email: '',
            password: ''
        };

        await loginPage.preencherLogin(dadosLoginEmailPasswordVazio);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.email_vazio);
        await loginPage.verificarMensagemErro(dataLogin.menssagem_erro.password_vazio);
    })

    test('erro ao realizar login com email inválido', async () => {
        const dadosLoginEmailInvalido: LoginModel = {
            email: faker.person.firstName(),
            password: usuarioBase.password
        };

        await loginPage.preencherLogin(dadosLoginEmailInvalido);
        const valdationMessage = await loginPage.emailInput.evaluate(e => (e as HTMLInputElement).validationMessage);
        expect(valdationMessage).toContain(dataLogin.menssagem_erro.email_invalido);
    })

});