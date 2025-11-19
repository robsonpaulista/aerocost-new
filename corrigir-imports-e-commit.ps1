# Corrigir imports e fazer commit
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Corrigir Imports e Fazer Commit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Verificando arquivos da API..." -ForegroundColor Yellow
$apiFiles = @(
    "frontend/app/api/aircraft/route.ts",
    "frontend/app/api/aircraft/[id]/route.ts",
    "frontend/app/api/users/login/route.ts"
)

foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "src/controllers" -or $content -match "\.\.\/.*src\/controllers") {
            Write-Host "  ❌ $file tem imports incorretos!" -ForegroundColor Red
        } else {
            Write-Host "  ✓ $file está correto" -ForegroundColor Green
        }
    }
}

Write-Host "`n[2/4] Garantindo que os arquivos estão corretos..." -ForegroundColor Yellow

# Corrigir aircraft/route.ts
$aircraftRoute = @"
// API Route do Next.js para Aircraft
import { NextRequest, NextResponse } from 'next/server';
import { Aircraft } from '@/lib/models/Aircraft';

export async function GET(request: NextRequest) {
  try {
    const aircraft = await Aircraft.findAll();
    return NextResponse.json(aircraft);
  } catch (error: any) {
    console.error('[Aircraft API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const aircraft = await Aircraft.create(body);
    return NextResponse.json(aircraft, { status: 201 });
  } catch (error: any) {
    console.error('[Aircraft API Error]', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Registration already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}
"@
Set-Content -Path "frontend/app/api/aircraft/route.ts" -Value $aircraftRoute -Encoding UTF8
Write-Host "  ✓ frontend/app/api/aircraft/route.ts corrigido" -ForegroundColor Green

# Corrigir aircraft/[id]/route.ts
$aircraftIdRoute = @"
// API Route do Next.js para Aircraft por ID
import { NextRequest, NextResponse } from 'next/server';
import { Aircraft } from '@/lib/models/Aircraft';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const aircraft = await Aircraft.findById(id);
    if (!aircraft) {
      return NextResponse.json(
        { error: 'Aircraft not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(aircraft);
  } catch (error: any) {
    console.error('[Aircraft API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const aircraft = await Aircraft.update(id, body);
    return NextResponse.json(aircraft);
  } catch (error: any) {
    console.error('[Aircraft API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    await Aircraft.delete(id);
    return NextResponse.json({ message: 'Aircraft deleted successfully' });
  } catch (error: any) {
    console.error('[Aircraft API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
"@
Set-Content -Path "frontend/app/api/aircraft/[id]/route.ts" -Value $aircraftIdRoute -Encoding UTF8
Write-Host "  ✓ frontend/app/api/aircraft/[id]/route.ts corrigido" -ForegroundColor Green

# Corrigir users/login/route.ts
$loginRoute = @"
// API Route do Next.js para Login
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('[LOGIN] ========================================');
    console.log('[LOGIN] Tentativa de login recebida');
    console.log('[LOGIN] Email:', email);
    console.log('[LOGIN] Senha fornecida:', password ? 'SIM (' + password.length + ' caracteres)' : 'NÃO');
    console.log('[LOGIN] ========================================');

    if (!email || !password) {
      console.log('[LOGIN] ❌ Erro: Email ou senha faltando');
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await User.verifyCredentials(email, password);
    
    if (!user) {
      console.log('[LOGIN] ❌ Erro: Credenciais inválidas para:', email);
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    console.log('[LOGIN] ✅ Sucesso para:', email);
    console.log('[LOGIN] Usuário retornado:', { id: user.id, name: user.name, role: user.role });
    
    return NextResponse.json({
      user,
      message: 'Login realizado com sucesso',
    });
  } catch (error: any) {
    console.error('[LOGIN] ❌ Erro:', error.message);
    console.error('[LOGIN] Stack:', error.stack);
    
    if (error.message === 'Usuário inativo') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
"@
Set-Content -Path "frontend/app/api/users/login/route.ts" -Value $loginRoute -Encoding UTF8
Write-Host "  ✓ frontend/app/api/users/login/route.ts corrigido" -ForegroundColor Green

Write-Host "`n[3/4] Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add frontend/app/api/
git add frontend/lib/
Write-Host "  ✓ Arquivos adicionados" -ForegroundColor Green

Write-Host "`n[4/4] Fazendo commit..." -ForegroundColor Yellow
git commit -m "fix: corrigir imports nas rotas da API - usar modelos do frontend/lib"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Próximo passo:" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

