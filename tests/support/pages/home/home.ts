import { expect, Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async verificarMensagemBoasVindas() {
        const target = this.page.locator('xpath=//h1[contains(text(), "Bem Vindo")]');
        await expect (target).toBeVisible();
    }
}