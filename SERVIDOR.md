# 🚀 SERVIDOR DA HOLDING PROMOTORA

## 📋 **COMO MANTER O SERVIDOR SEMPRE FUNCIONANDO**

### **1. 🎯 INICIAR SERVIDOR (Método Simples)**

```bash
# No diretório do projeto
npm run dev
```

**URL:** http://localhost:3000

### **2. 🔧 SCRIPTS AUTOMÁTICOS**

#### **Script PowerShell (Recomendado)**
```powershell
# Executar como administrador
.\start-server.ps1
```

#### **Script Batch (Windows)**
```cmd
start-server.bat
```

### **3. 📊 MONITORAMENTO AUTOMÁTICO**

#### **Monitoramento com Auto-Restart**
```powershell
# Monitora e reinicia automaticamente se necessário
.\monitor-server.ps1 -AutoRestart
```

#### **Monitoramento Simples**
```powershell
# Apenas monitora o status
.\monitor-server.ps1
```

### **4. 🛠️ PM2 (Process Manager)**

#### **Instalar PM2 Globalmente**
```bash
npm install -g pm2
```

#### **Iniciar com PM2**
```bash
# Iniciar servidor
pm2 start ecosystem.config.js

# Ver status
pm2 status

# Ver logs
pm2 logs holding-promotora

# Parar servidor
pm2 stop holding-promotora

# Reiniciar servidor
pm2 restart holding-promotora
```

### **5. 🔍 VERIFICAR SE ESTÁ FUNCIONANDO**

#### **Verificar Porta**
```powershell
netstat -ano | findstr :3000
```

#### **Testar URL**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
```

#### **Abrir no Navegador**
- http://localhost:3000
- http://localhost:3000/login
- http://localhost:3000/dashboard

### **6. 🚨 SOLUÇÃO DE PROBLEMAS**

#### **Porta 3000 em Uso**
```powershell
# Parar todos os processos Node.js
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Ou usar o script de monitoramento
.\monitor-server.ps1 -AutoRestart
```

#### **Dependências Corrompidas**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### **Erro de Compilação**
```bash
# Verificar TypeScript
npm run type-check

# Limpar cache
npm run clean
```

### **7. 📱 CREDENCIAIS DE ACESSO**

- **URL:** http://localhost:3000
- **Email:** grupoarmandogomes@gmail.com
- **Senha:** @252980Hol

### **8. 🔄 MANUTENÇÃO AUTOMÁTICA**

#### **Criar Tarefa Agendada (Windows)**
1. Abrir "Agendador de Tarefas"
2. Criar nova tarefa
3. Ação: `powershell.exe`
4. Argumentos: `-ExecutionPolicy Bypass -File "C:\Projetos\appweb\holding-promotora\monitor-server.ps1" -AutoRestart`
5. Agendar para executar na inicialização do Windows

#### **Criar Atalho na Área de Trabalho**
1. Clicar com botão direito na área de trabalho
2. Novo > Atalho
3. Local: `powershell.exe -ExecutionPolicy Bypass -File "C:\Projetos\appweb\holding-promotora\start-server.ps1"`
4. Nome: "Holding Promotora - Servidor"

### **9. 📊 LOGS E MONITORAMENTO**

#### **Ver Logs em Tempo Real**
```bash
# Logs do Next.js
tail -f .next/server.log

# Logs do PM2
pm2 logs holding-promotora
```

#### **Verificar Uso de Recursos**
```bash
# Processos Node.js
Get-Process | Where-Object {$_.ProcessName -eq "node"}

# Uso de porta
netstat -ano | findstr :3000
```

### **10. 🎯 RECOMENDAÇÕES**

1. **Use o script de monitoramento** com `-AutoRestart` para máxima confiabilidade
2. **Configure PM2** para produção com auto-restart
3. **Monitore os logs** regularmente para identificar problemas
4. **Configure tarefa agendada** para inicialização automática
5. **Mantenha as dependências atualizadas** com `npm update`

---

## 🆘 **SUPORTE**

Se o servidor não funcionar:

1. Execute `.\monitor-server.ps1 -AutoRestart`
2. Verifique os logs em `./logs/`
3. Reinicie o computador se necessário
4. Use PM2 para gerenciamento avançado

**O servidor deve funcionar 24/7 com essas configurações!** 🚀
