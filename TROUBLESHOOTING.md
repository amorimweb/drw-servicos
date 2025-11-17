# Guia de Troubleshooting - Tela Branca

Se você está vendo uma tela branca, siga estes passos:

## 1. Verificar se as dependências estão instaladas

```bash
npm install
```

## 2. Verificar se o servidor está rodando

```bash
npm run dev
```

Você deve ver algo como:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 3. Abrir o Console do Navegador

1. Pressione `F12` ou `Ctrl+Shift+I`
2. Vá para a aba "Console"
3. Procure por erros em vermelho

## 4. Verificar erros comuns

### Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente

### Erro: "Failed to resolve import"
**Solução:** Verifique se todos os arquivos existem e os imports estão corretos

### Erro: "React is not defined"
**Solução:** Verifique se o React está instalado: `npm list react`

### Erro relacionado ao Tailwind
**Solução:** Verifique se o `tailwind.config.js` está correto e execute:
```bash
npm run dev
```

## 5. Limpar cache e reinstalar

```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

## 6. Verificar se o arquivo index.html está correto

O arquivo `index.html` deve ter:
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

## 7. Verificar porta

Se a porta 5173 estiver ocupada, o Vite tentará usar outra porta. Verifique a mensagem no terminal.

## 8. Teste simples

Tente substituir temporariamente o conteúdo de `src/App.tsx` por:

```tsx
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Teste - React funcionando!</h1>
    </div>
  );
}

export default App;
```

Se isso funcionar, o problema está em algum componente específico.

