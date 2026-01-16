# 🔐 Como Resetar a Senha de um Usuário

## Problema
Se você migrou do Supabase para o Firestore, os hashes de senha podem estar em formato incompatível (PostgreSQL `crypt()` vs `bcryptjs`).

## Solução: Resetar a Senha via API

### Opção 1: Usar a API de Reset (Recomendado)

1. Abra o console do navegador (F12)
2. Execute este código no console:

```javascript
fetch('/api/users/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'seu_email@exemplo.com', // Altere para seu email
    newPassword: 'sua_nova_senha'    // Altere para a nova senha desejada
  })
})
.then(res => res.json())
.then(data => {
  console.log('Resultado:', data);
  if (data.message) {
    alert('Senha resetada com sucesso! Agora você pode fazer login.');
  } else {
    alert('Erro: ' + data.error);
  }
})
.catch(error => {
  console.error('Erro:', error);
  alert('Erro ao resetar senha');
});
```

### Opção 2: Usar o Script Node.js

1. Edite o arquivo `scripts/reset-user-password.ts`
2. Altere as constantes `USER_EMAIL` e `NEW_PASSWORD`
3. Execute:
```bash
cd frontend
npx ts-node scripts/reset-user-password.ts
```

## Após Resetar

Depois de resetar a senha, você poderá fazer login normalmente com:
- **Email**: o mesmo de antes
- **Senha**: a nova senha que você definiu




