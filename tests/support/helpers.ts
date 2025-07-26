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

async function getUsuarioEmail(request: APIRequestContext, email: string): Promise<string> {

    const response = await request.get(`https://serverest.dev/usuarios?email=${email}`);
    expect(response.ok(), `Erro ao pegar usuário. Status: ${response.status()}`).toBeTruthy();
    const responseBody = await response.json();
    if (responseBody.usuarios && responseBody.usuarios.length > 0) {
        console.log(`Usuário encontrado com ID: ${responseBody.usuarios[0]._id}`);
        return responseBody.usuarios[0]._id;
    }
    throw new Error(`Nenhum usuário foi encontrado com o email: ${email}`); 
}


export { postCadastrarUsuario, deleteUsuario, getUsuarioEmail };