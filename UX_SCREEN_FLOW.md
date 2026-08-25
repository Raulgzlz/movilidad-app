# 📱 Movilidad — Screen Flow & Architecture Map

> **Google Stitch Project**: `projects/17384172622607756718`
> **Aesthetic**: Quiet Vitality (Apple Minimalist + Sage Green #8DAA91 + Manrope Typography)

---

## 🧭 The 3 User Paths & Complete Screen Map

```mermaid
graph TD
    Home["🏠 Tab 1: Inicio (Daily Launchpad)"]
    Hero["Hero 1-Tap (8 min Movilidad Matutina)"]
    JointShortcuts["Enfoque Articular Rápido (Caderas, Columna, Hombros)"]
    PreModal["📋 Pre-Workout Preview Modal"]
    Player["🧘 Guided Zen Player"]
    Victory["🎉 Post-Session Victory & Habit Milestone"]
    
    Tab2["🧭 Tab 2: Rutinas & Caminos"]
    Path1["🏃 Camino 1: Moverse a Diario (5-10m Pausas Oficina/Despertar)"]
    Path2["🎯 Camino 2: Enfoque Articular (Cadera FRC, Columna Janda)"]
    Path3["✨ Camino 3: Creador a Medida (Quiz 3 pasos)"]
    Library["📚 Catálogo 30+ Movimientos"]
    
    Tab3["📊 Tab 3: Tu Viaje & Progreso"]
    Shoutout["🌟 Motivación & Felicitación Semanal"]
    Balance["⚖️ Balance Articular Semanal"]
    Heatmap["🟩 Consistencia 26 Semanas"]
    
    Settings["⚙️ Modal Ajustes & Privacidad (Header Top-Right)"]
    
    Home --> Hero
    Home --> JointShortcuts
    Hero --> PreModal
    JointShortcuts --> PreModal
    PreModal --> Player
    Player --> Victory
    Victory --> Home
    
    Tab2 --> Path1
    Tab2 --> Path2
    Tab2 --> Path3
    Tab2 --> Library
    Path1 --> PreModal
    Path2 --> PreModal
    Path3 --> PreModal
    
    Tab3 --> Shoutout
    Tab3 --> Balance
    Tab3 --> Heatmap
```
