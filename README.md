# Product Review Analyzer 🚀

**Tugas Individu 3 - Pemrograman Aplikasi Web (PAW)**

Aplikasi web full-stack untuk menganalisis ulasan produk secara otomatis menggunakan kecerdasan buatan (AI). Aplikasi ini dapat mendeteksi sentimen (Positif/Negatif) dan merangkum poin-poin penting dari ulasan.

---

## 🌟 Fitur Utama

1.  **Sentiment Analysis**: Menggunakan Hugging Face Transformers (Model Multilingual) untuk mendeteksi apakah ulasan bersifat `POSITIVE` atau `NEGATIVE`. Mendukung Bahasa Indonesia dan Inggris.
2.  **Key Points Extraction**: Menggunakan **Google Gemini AI** untuk merangkum poin-poin utama dari ulasan panjang menjadi bullet points.
3.  **Database Integration**: Menyimpan riwayat analisis (teks, sentimen, dan poin kunci) ke database (SQLite/PostgreSQL).
4.  **Responsive Frontend**: Antarmuka modern menggunakan **React + Vite** dan **Bootstrap**, responsif untuk Desktop dan Mobile.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Bootstrap 5, Axios.
* **Backend**: Python, FastAPI, Uvicorn.
* **Database**: SQLAlchemy ORM (SQLite untuk demo, kompatibel dengan PostgreSQL).
* **AI Models**:
    * Sentiment: `lxyuan/distilbert-base-multilingual-cased-sentiments-student` (Hugging Face).
    * Summarization: Google Gemini Pro.

---

## ⚙️ Cara Menjalankan (Installation)

Pastikan Python dan Node.js sudah terinstall.

### 1. Setup Backend (Python)

Buka terminal dan masuk ke folder root proyek:

```bash
# 1. Install Library yang dibutuhkan
pip install fastapi uvicorn sqlalchemy psycopg2-binary requests transformers torch google-generativeai

# 2. Konfigurasi API Key
# Buka file main.py dan isi variabel GEMINI_API_KEY dengan API Key Anda.

# 3. Jalankan Server
uvicorn main:app --reload
```
---
## Bukti Hasil Screenshoot

<img width="2880" height="2160" alt="Hasil Tugas 3" src="https://github.com/user-attachments/assets/4d69f7c3-05d4-4b5a-ad32-8a42d68faf80" />
