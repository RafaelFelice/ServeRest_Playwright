import { expect, Locator, Page } from "@playwright/test";
import { UsuarioCadastroModel } from "../../../fixtures/usuarioCadastro.model";


export class CadastroUsuarioPage {
    readonly page: Page;
    readonly nomeInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly administradorInput: Locator;
    readonly btnCadastrar: Locator;
    readonly mensagem: Locator;



    constructor(page: Page) {
        this.page = page;
        this.nomeInput = this.page.locator('#nome');
        this.emailInput = this.page.locator('#email');
        this.passwordInput = this.page.locator('#password');
        this.administradorInput = this.page.locator('#administrador');
        this.btnCadastrar = this.page.getByRole('button', { name: 'Cadastrar' });
    }

    async preencherCadastroUsuario( usuarioCadastro: UsuarioCadastroModel) {
        await this.nomeInput.fill(usuarioCadastro.nome);
        await this.emailInput.fill(usuarioCadastro.email);
        await this.passwordInput.fill(usuarioCadastro.password);
        if (usuarioCadastro.administrador === "true") {
            await this.administradorInput.check();
        }
        await this.btnCadastrar.click();
    }

    async verificarMensagem(text: string) {
        const target = this.page.locator(`//a[text()="${text}"]`);
        await expect(target).toBeVisible();
    }

    async verificarMensagemErro(text: string) {
        const target = this.page.locator(`//span[text()="${text}"]`);
        await expect(target).toBeVisible();
    }

}