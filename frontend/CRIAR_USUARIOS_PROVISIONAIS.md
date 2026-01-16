# 👥 Criar Usuários Provisórios de Implantação

## Problema
Após migrar do Supabase para o Firestore, os hashes de senha podem estar incompatíveis. É necessário criar usuários provisórios com senhas válidas.

## Solução: Script de Criação de Usuários

### Passo 1: Editar o Script

Abra o arquivo `scripts/create-provisioning-users.ts` e edite a seção `PROVISIONING_USERS`:

```typescript
const PROVISIONING_USERS = [
  {
    name: 'Robson Medeiros',
    email: 'robsonpaulista@hotmail.com',
    password: 'admin123', // ⚠️ ALTERE ESTA SENHA APÓS O PRIMEIRO LOGIN!
    role: 'admin' as const,
    is_active: true
  },
  // Adicione mais usuários se necessário
];
```

### Passo 2: Executar o Script

No terminal, execute:

```bash
cd frontend
npx ts-node scripts/create-provisioning-users.ts
```

### Passo 3: Verificar

O script irá:
- ✅ Verificar se o usuário já existe (não duplica)
- ✅ Gerar hash bcrypt válido da senha
- ✅ Criar o usuário no Firestore
- ✅ Mostrar resumo do que foi criado

### Passo 4: Fazer Login

Após criar, você pode fazer login com:
- **Email**: o email configurado no script
- **Senha**: a senha configurada no script

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## Alternativa: Usar a API de Reset

Se você já tem um usuário no Firestore mas com hash inválido, use a API de reset:

```javascript
// No console do navegador (F12)
fetch('/api/users/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'seu_email@exemplo.com',
    newPassword: 'sua_nova_senha'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```




