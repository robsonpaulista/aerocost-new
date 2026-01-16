// Script Node.js para definir senha de um usuário
// Execute: node definir-senha-usuario.js

import axios from 'axios';

// Configuração - ajuste conforme necessário
const API_URL = process.env.API_URL || 'https://aerocost.gmconsultoriathe.com.br/api/users/reset-password';
const EMAIL = 'robsonpaulista@hotmail.com';
const NEW_PASSWORD = 'sua_senha_aqui'; // Altere para a senha desejada

async function definirSenha() {
  try {
    console.log('🔄 Definindo senha para:', EMAIL);
    console.log('📍 URL:', API_URL);
    
    const response = await axios.post(API_URL, {
      email: EMAIL,
      newPassword: NEW_PASSWORD
    });
    
    console.log('✅ Senha definida com sucesso!');
    console.log('Mensagem:', response.data.message);
    console.log('Email:', response.data.email);
  } catch (error) {
    console.error('❌ Erro ao definir senha:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Mensagem:', error.response.data.error || error.response.data);
    } else if (error.request) {
      console.error('Erro de rede:', error.message);
      console.error('Verifique se a URL está correta e se o servidor está acessível');
    } else {
      console.error('Erro:', error.message);
    }
    process.exit(1);
  }
}

definirSenha();
