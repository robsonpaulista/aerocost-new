# 👥 Criar Usuários Provisórios via API

## Método Mais Simples

### Passo 1: Editar a Rota de API

Abra o arquivo `frontend/app/api/users/create-provisioning/route.ts` e edite a seção `PROVISIONING_USERS`:

```typescript
const PROVISIONING_USERS = [
  {
    name: 'Robson Medeiros',
    email: 'robsonpaulista@hotmail.com',
    password: 'admin123', // ⚠️ ALTERE ESTA SENHA APÓS O PRIMEIRO LOGIN!
    role: 'admin' as const,
    is_active: true
  },
];
```

### Passo 2: Executar via Console do Navegador

1. Inicie o servidor de desenvolvimento: `npm run dev`
2. Abra o console do navegador (F12)
3. Execute este código:

```javascript
fetch('/api/users/create-provisioning', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: 'CREATE_PROVISIONING_USERS_2024'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Resultado:', data);
  if (data.results) {
    data.results.forEach(r => {
      if (r.status === 'created') {
        console.log(`✅ ${r.email} - Senha: ${r.password}`);
      } else {
        console.log(`⏭️  ${r.email} - ${r.message}`);
      }
    });
  }
})
.catch(error => {
  console.error('Erro:', error);
});
```

### Passo 3: Fazer Login

Após criar, você pode fazer login com:
- **Email**: o email configurado
- **Senha**: a senha configurada

⚠️ **IMPORTANTE**: 
- Altere a senha após o primeiro login!
- **REMOVA a rota `/api/users/create-provisioning` após criar os usuários** por segurança!




