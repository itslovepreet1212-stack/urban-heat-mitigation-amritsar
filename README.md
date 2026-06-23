# 🌡️ Urban Heat Mitigation & Cooling Strategies — Amritsar
### ISRO Bharatiya Antariksh Hackathon 2026 | Team Trio

> A satellite-driven AI/ML decision-support system that identifies urban heat stress hotspots in Amritsar, quantifies the exact causes, and recommends optimized cooling interventions per locality — with real predicted temperature reductions in °C, explained in plain language by an AI.

---

## 🚀 Live Dashboard

**👉 [View Live Interactive Dashboard](https://fancy-biscochitos-876d3c.netlify.app/)**

Click any of the 16 Amritsar localities on the satellite map to see:
- Current surface temperature
- Predicted cooling from greenery, cool roofs, or both
- AI-generated plain-language recommendation for that zone

---

## 🏆 Hackathon Details

| Field | Details |
|-------|---------|
| Event | Bharatiya Antariksh Hackathon (BAH) 2026 |
| Organizer | ISRO |
| Platform | Hack2Skill |
| Problem Statement | Optimizing Urban Heat Mitigation and Cooling Strategies via Artificial Intelligence and Machine Learning (AIML) |
| Study Area | Amritsar, Punjab, India |

---

## 👥 Team Trio

| Role | Name | Institution |
|------|------|-------------|
| Team Leader | Prem Sagar | Amritsar Group of Colleges |
| Member | Lovepreet Singh | Amritsar Group of Colleges |
| Member | Nikhil Bhardwaj | Amritsar Group of Colleges |

---

## 🎯 What This System Does

Cities like Amritsar are getting dangerously hot due to rapid urbanization — dense concrete, shrinking green cover, and heat-absorbing surfaces. But city planners have no data-driven tool to decide **where** to intervene and **what** to do.

Our system answers three questions with real satellite data:

| Question | Our Answer |
|----------|-----------|
| WHERE is it hottest? | Heat stress map from Landsat 8 LST data |
| WHY is it hot there? | NDVI r=−0.63, NDBI r=+0.63 — statistically proven |
| WHAT should we do? | 3-scenario cooling simulation + AI-written action plan per zone |

---

## 📊 Key Results

| Metric | Value |
|--------|-------|
| Localities analyzed | 16 |
| Peak surface temperature | 46.91°C (Railway Station / Hall Bazaar) |
| City average temperature | 46.13°C |
| NDVI vs LST correlation | −0.63 |
| NDBI vs LST correlation | +0.63 |
| Model R² score | 0.51 |
| Model MAE | 1.39°C |
| Max cooling potential | −5.19°C (Civil Lines / Mall Road) |
| Cool roofs vs greenery alone | Cool roofs ~3× more effective |
| Total prototype cost | ₹0 |

---

## 🗺️ All 16 Amritsar Localities

| Zone | Locality | Temp (°C) | Max Reduction (°C) |
|------|----------|-----------|-------------------|
| Zone_1_1 | Civil Lines / Mall Road | 45.69 | −5.19 |
| Zone_2_1 | Lawrence Road / Court Road | 45.60 | −5.18 |
| Zone_2_2 | Golden Temple / Walled City | 46.67 | −4.79 |
| Zone_3_1 | Green Avenue | 46.11 | −4.76 |
| Zone_1_2 | Railway Station / Hall Bazaar | 46.91 | −4.35 |
| Zone_0_3 | Verka / Batala Road (outer) | 46.42 | −4.30 |
| Zone_0_0 | Airport / Ajnala Road | 46.70 | −4.02 |
| Zone_3_2 | Tarn Taran Road | 46.40 | −4.05 |
| Zone_3_0 | South-West Rural Fringe | 45.98 | −3.87 |
| Zone_0_1 | Majitha Rd / Ranjit Avenue | 45.76 | −3.78 |
| Zone_2_3 | Sultanwind Road | 45.84 | −3.74 |
| Zone_0_2 | Fatehgarh Churian Road | 45.82 | −3.73 |
| Zone_3_3 | South-East Fringe (Beas) | 46.33 | −3.58 |
| Zone_1_3 | Batala Road East | 46.09 | −3.63 |
| Zone_2_0 | Chheharta | 45.98 | −3.57 |
| Zone_1_0 | GNDU / GT Road West | 45.85 | −3.29 |

---

## ⚙️ How It Works — Pipeline

```
Landsat 8 Satellite (USGS/NASA)
            ↓
Google Earth Engine — LST, NDVI, NDBI derivation
            ↓
Correlation Analysis (NDVI r=−0.63 | NDBI r=+0.63)
            ↓
Random Forest Model (R²=0.51, MAE=1.39°C)
trained on 2,000 city sample points
            ↓
3-Scenario Cooling Simulator per zone
(Greenery | Cool Roofs | Combined)
            ↓
Llama 3.3 70B (Groq) — AI Recommendations
            ↓
Interactive Web Dashboard (MapTiler Satellite Map)
```

---

## 🔧 Tech Stack

### Satellite & Data
- **Google Earth Engine** (Python API) — data access and preprocessing
- **Landsat 8 Collection 2** (USGS/NASA) — thermal band for LST, reflectance bands for NDVI and NDBI
- **ESA WorldCover v200** — land use classification

### AI / Machine Learning
- **Python 3.12** — primary language
- **scikit-learn** — Random Forest Regressor (200 trees, max depth 8)
- **SHAP** — feature importance explainability
- **pandas, numpy, scipy** — data processing and spatial smoothing
- **Google Colab** — development environment (free CPU, no GPU needed)

### Agentic AI
- **Groq API** — inference platform
- **Llama 3.3 70B (Meta)** — writes plain-language zone recommendations

### Web Dashboard
- **MapTiler SDK JS v2** — satellite basemap and zone overlays
- **Vanilla HTML + CSS + JavaScript** — zero-framework, single file
- **Chart.js v4** — intervention bar charts
- **Netlify** — free deployment

---

## 📁 Repository Structure

```
urban-heat-mitigation-amritsar/
├── README.md                              # This file
├── .gitignore                             # Keeps API keys out of git
├── requirements.txt                       # Python dependencies
├── index.html                             # Dashboard entry point
├── style.css                              # All dashboard styles
├── app.js                                 # Map logic and zone interaction
├── data.js                                # All 16 zone data + AI recommendations
├── assets/                                # Icons and static assets
├── urban_heat_amritsar_pipeline.ipynb     # Full satellite + ML pipeline
└── amritsar_zone_recommendations.csv      # Raw results for all 16 zones
```

---

## 🚀 How to Run Locally

### Python Pipeline (Google Colab recommended)

**1. Install dependencies:**
```bash
pip install -r requirements.txt
```

**2. Set up Google Earth Engine:**
```python
import ee
ee.Authenticate()
ee.Initialize(project='YOUR-GEE-PROJECT-ID')
```

**3. Open the notebook:**

Open `urban_heat_amritsar_pipeline.ipynb` in Google Colab and run all cells in order. Add your Groq API key where indicated.

### Web Dashboard

**1.** Open `index.html` in any browser — no server needed

**2.** Add your MapTiler API key in `app.js` where it says `YOUR_MAPTILER_KEY_HERE`

**3.** Or just use the live version: **[fancy-biscochitos-876d3c.netlify.app](https://fancy-biscochitos-876d3c.netlify.app/)**

> ⚠️ **Never commit real API keys.** All keys in this repo are replaced with placeholder text. Get your own free keys from [MapTiler](https://maptiler.com) and [Groq](https://console.groq.com).

---

## 💰 Cost

| Component | Cost |
|-----------|------|
| Google Earth Engine | Free (academic tier) |
| Landsat 8 data | Free (public domain, USGS) |
| Python + scikit-learn | Free (open source) |
| Groq API — Llama 3.3 70B | Free tier |
| MapTiler SDK | Free tier |
| Google Colab | Free (CPU) |
| Netlify hosting | Free |
| **Total prototype** | **₹0** |

Production deployment per city per month: ~₹3,000–8,000

---

## 📈 Scalability

The same pipeline applies to **any Indian city** by changing 4 coordinate values and retraining. Model retraining takes under 5 minutes on a standard CPU. No GPU required at any scale.

Cities this can be applied to next: Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Pune, Ahmedabad, and all major Tier-2 Indian cities.

---

## 📄 License

Built for ISRO BAH 2026 Hackathon. For educational and research use only.

---

<div align="center">

Made with ❤️ in Amritsar, Punjab, India

**Team Trio | Amritsar Group of Colleges | ISRO BAH 2026**

[🌐 Live Dashboard](https://fancy-biscochitos-876d3c.netlify.app/) 

</div>
