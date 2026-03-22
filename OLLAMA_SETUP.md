# Ollama + TinyLlama Setup Guide

## 🚀 Quick Setup

### 1. Install Ollama
```bash
# Download from: https://ollama.com/download
# Or install via package manager (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Start Ollama Service
```bash
# Start the Ollama server
ollama serve

# Server will run on http://localhost:11434
```

### 3. Pull TinyLlama Model
```bash
# Download the TinyLlama model (small, fast)
ollama pull tinyllama

# Verify installation
ollama list
```

### 4. Test Installation
```bash
# Test the model
ollama run tinyllama "Hello, how are you?"
```

## 🔧 Integration Complete

Your Task Manager now uses:
- **Ollama API** (localhost:11434)
- **TinyLlama model** for AI processing
- **Automatic fallback** if Ollama is not running

## 🎯 Features

### AI Summarization
- **Local processing** - No API costs
- **Privacy-focused** - Data stays on your machine
- **Fast responses** - TinyLlama is optimized for speed
- **Smart fallback** - Rule-based AI if Ollama is down

### How It Works
1. **User clicks "AI Summary"**
2. **Checks Ollama availability**
3. **Processes with TinyLlama** if available
4. **Falls back to rule-based AI** if needed

## 🛠️ Troubleshooting

### If AI doesn't work:
1. **Check Ollama status**: Visit `/api/ollama-status`
2. **Verify service**: Ensure `ollama serve` is running
3. **Check model**: Run `ollama list` to see if tinyllama is installed
4. **Restart service**: Stop and restart `ollama serve`

### Common Issues:
- **Port 11434 blocked**: Ensure firewall allows localhost:11434
- **Model not found**: Run `ollama pull tinyllama`
- **Service not running**: Start with `ollama serve`

## 📱 Usage

1. **Start Ollama**: `ollama serve`
2. **Open Task Manager**: Navigate to any task
3. **Click "AI Summary"**: Get instant AI analysis
4. **View results**: See summary, key points, time estimate, and priority

The green indicator shows "Using Ollama AI (TinyLlama)" when working correctly!
