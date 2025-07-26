import { expect, Locator, Page } from "@playwright/test";
import { LoginModel } from "../../../fixtures/login.model";


export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly btnEntrar: Locator;
    readonly linkCadastrese: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.locator('#email');
        this.passwordInput = this.page.locator('#password');
        this.btnEntrar = this.page.getByRole('button', { name: 'Entrar' });
        this.linkCadastrese = this.page.locator('xpath=//a[text()="Cadastre-se"]');
    }

    async go(path: string) {
        await this.page.goto(path);
    }

    async preencherLogin(login: LoginModel) {
        await this.emailInput.fill(login.email);
        await this.passwordInput.fill(login.password);
        await this.btnEntrar.click();
    }

    async goCadastrarUsuario() {
        await this.linkCadastrese.click();
    }

    async verificarMensagemErro(text: string) {
        const target = this.page.locator(`//span[text()="${text}"]`);
        await expect(target).toBeVisible();
    }

}