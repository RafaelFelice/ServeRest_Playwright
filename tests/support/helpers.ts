import { APIRequestContext, expect } from "@playwright/test";
import { UsuarioCadastroModel } from "../fixtures/usuarioCadastro.model";


async function postCadastrarUsuario(request: APIRequestContext, usuario: UsuarioCadastroModel): Promise<string> {
    
    const response = await request.post('https://serverest.dev/usuarios', { data: usuario });
    expect(response.ok(), `Erro ao cadastrar usuário. Status: ${response.status()}`).toBeTruthy();
    const responseBody = await response.json();
    console.log(`Usuário cadastrado com sucesso: ${responseBody._id}`);
    return responseBody._id; 
}

async function deleteUsuario(request: APIRequestContext, usuarioId: string) {

    const response = await request.delete(`https://serverest.dev/usuarios/${usuarioId}`);
    expect(response.ok()).toBeTruthy();
}

export { postCadastrarUsuario, deleteUsuario };