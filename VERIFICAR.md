# Como Verificar se Está Tudo Funcionando

## Passo 1: Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Aguarde até que todas as dependências sejam instaladas.

## Passo 2: Iniciar o Servidor

```bash
npm run dev
```

Você deve ver uma mensagem como:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Passo 3: Abrir no Navegador

1. Abra seu navegador (Chrome, Firefox, Edge)
2. Acesse: `http://localhost:5173`
3. Pressione `F12` para abrir o Console do Desenvolvedor
4. Vá para a aba "Console"

## Passo 4: Verificar Erros

### Se você vê erros no console:

**Erro: "Cannot find module 'react'"**
- Execute: `npm install` novamente

**Erro: "Failed to resolve import"**
- Verifique se todos os arquivos existem
- Execute: `npm run dev` novamente

**Erro relacionado ao Tailwind**
- Verifique se o `tailwind.config.js` existe
- Execute: `npm install -D tailwindcss postcss autoprefixer`

### Se a tela está branca mas não há erros:

1. Verifique se você vê a mensagem "App component carregado" no console
2. Se não vê, o problema pode ser com o React Router
3. Tente acessar diretamente: `http://localhost:5173/login`

## Passo 5: Teste Simples

Se ainda não funcionar, tente este teste:

1. Abra `src/App.tsx`
2. Substitua todo o conteúdo por:

```tsx
function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>Teste - React Funcionando!</h1>
      <p>Se você vê isso, o React está OK.</p>
    </div>
  );
}

export default App;
```

3. Salve e recarregue a página
4. Se funcionar, o problema está em algum componente específico
5. Restaure o arquivo original e vamos investigar qual componente está causando o problema

## Problemas Comuns

### Porta já em uso
Se a porta 5173 estiver ocupada, o Vite usará outra (5174, 5175, etc.)
Verifique a mensagem no terminal para ver qual porta está sendo usada.

### Cache do navegador
Tente:
- `Ctrl + Shift + R` (Windows/Linux)
- `Cmd + Shift + R` (Mac)

Ou limpe o cache do navegador.

### Node.js não instalado
Verifique se o Node.js está instalado:
```bash
node --version
npm --version
```

Se não estiver, instale do site: https://nodejs.org/

