// API Route do Next.js para Criar Usuários Provisórios
// ⚠️ REMOVER ESTA ROTA APÓS CRIAR OS USUÁRIOS!
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

// CONFIGURE OS USUÁRIOS PROVISÓRIOS AQUI:
const PROVISIONING_USERS = [
  {
    name: 'Robson Medeiros',
    email: 'robsonpaulista@hotmail.com',
    password: 'admin123', // ⚠️ ALTERE ESTA SENHA APÓS O PRIMEIRO LOGIN!
    role: 'admin' as const,
    is_active: true
  },
  // Adicione mais usuários se necessário:
  // {
  //   name: 'Usuário Teste',
  //   email: 'teste@exemplo.com',
  //   password: 'senha123',
  //   role: 'user' as const,
  //   is_active: true
  // }
];

export async function POST(request: NextRequest) {
  try {
    // Verificar se há um token de segurança (opcional, mas recomendado)
    const { secret } = await request.json();
    
    // Token simples para evitar execução acidental
    // Em produção, use uma variável de ambiente
    if (secret !== 'CREATE_PROVISIONING_USERS_2024') {
      return NextResponse.json(
        { error: 'Token de segurança inválido' },
        { status: 403 }
      );
    }

    const results = [];
    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const userData of PROVISIONING_USERS) {
      try {
        // Verificar se usuário já existe
        const existing = await User.findByEmail(userData.email);
        
        if (existing) {
          results.push({
            email: userData.email,
            status: 'skipped',
            message: 'Usuário já existe'
          });
          skipped++;
          continue;
        }

        // Criar usuário
        const user = await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          is_active: userData.is_active,
        });

        results.push({
          email: userData.email,
          status: 'created',
          message: 'Usuário criado com sucesso',
          password: userData.password // ⚠️ Mostrar senha apenas nesta criação inicial
        });
        created++;
      } catch (error: any) {
        results.push({
          email: userData.email,
          status: 'error',
          message: error.message
        });
        errors++;
      }
    }

    return NextResponse.json({
      message: 'Processo concluído',
      summary: {
        created,
        skipped,
        errors
      },
      results
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

