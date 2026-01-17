# TR Construction Backend API Sənədləşməsi

Bu sənəd TR Construction vebsaytının backend API-sinin tam təsvirini əhatə edir.

## Əsas Məlumat

- **Base URL:** `http://localhost:8000` (development), Production-da `.env` faylında `BASE_URL` dəyişdiriləcək
- **API Versiyası:** v1
- **Prefix:** `/api/v1`

---

## Autentifikasiya

API JWT (JSON Web Token) əsaslı autentifikasiya istifadə edir.

### Token İstifadəsi

Qorunan endpointlərə sorğu göndərərkən `Authorization` header-ində token göndərilməlidir:

```
Authorization: Bearer {access_token}
```

### Rollər

- **admin** - Standart idarəetmə hüquqları
- **superAdmin** - Tam idarəetmə hüquqları (istifadəçi idarəetməsi daxil)

---

## Tərcümə Sistemi (Multi-Language)

### Necə İşləyir

Backend çoxdilli kontenti dəstəkləyir. Məlumatlar JSON formatında hər dil üçün ayrı saxlanılır:

```json
{
  "title": {
    "az": "Azərbaycan dilində başlıq",
    "en": "English title"
  }
}
```

### Dil Seçimi

**GET sorğularında** `Accept-Language` header istifadə edin:

```bash
# Azərbaycan dilində cavab almaq
curl http://localhost:8000/api/v1/hero -H "Accept-Language: az"

# İngilis dilində cavab almaq
curl http://localhost:8000/api/v1/hero -H "Accept-Language: en"
```

**Header olmadan** sorğu göndərdikdə bütün dillər qaytarılır (admin panel üçün əlverişli).

### Yeni Dil Əlavə Etmək

1. `/api/v1/languages` endpoint-inə POST sorğusu göndərin
2. Admin paneldə bütün CRUD əməliyyatlarında yeni dil field-ləri görünəcək
3. Kontenti yeni dildə doldurun

---

## Auth Endpointləri

### POST /api/v1/auth/login

İstifadəçi girişi.

**Request:**
```json
{
  "email": "admin@trconstruction.az",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### GET /api/v1/auth/logout

Sistemdən çıxış. **Token tələb olunur.**

**Response:**
```
"Uğurla çıxış etdiniz"
```

---

### GET /api/v1/auth/me

Cari istifadəçi məlumatları. **Token tələb olunur.**

**Response:**
```json
{
  "id": "uuid",
  "full_name": "Super Admin",
  "phone": "+994 XX XXX XX XX",
  "email": "admin@trconstruction.az",
  "role": "superAdmin",
  "profile_image": "http://localhost:8000/uploads/image.jpg"
}
```

---

### PUT /api/v1/auth/me

İstifadəçi profilini yeniləmək. **Token tələb olunur.** FormData göndərilir.

**Request (FormData):**
| Field | Type | Required |
|-------|------|----------|
| full_name | string | ✓ |
| phone | string | ✓ |
| email | string | ✓ |
| profile_image | file | ✗ |

**Response:** Yenilənmiş istifadəçi məlumatları.

---

### POST /api/v1/auth/register

Yeni admin əlavə etmək. **Yalnız superAdmin.** **Token tələb olunur.**

**Request:**
```json
{
  "full_name": "Yeni Admin",
  "email": "newadmin@trconstruction.az",
  "password": "Password123",
  "phone": "+994 XX XXX XX XX",
  "role": "admin"
}
```

---

### GET /api/v1/auth/users

Bütün istifadəçiləri əldə etmək. **Yalnız superAdmin.** **Token tələb olunur.**

**Response:** İstifadəçilər siyahısı.

---

### PUT /api/v1/auth/change_user_role

İstifadəçi rolunu dəyişmək. **Yalnız superAdmin.** **Token tələb olunur.**

**Request:**
```json
{
  "id": "user_id",
  "role": "superAdmin"
}
```

---

### DELETE /api/v1/auth/users/{id}

İstifadəçini silmək. **Yalnız superAdmin.** **Token tələb olunur.**

---

### POST /api/v1/auth/send_otp_to_email_for_change_password

Şifrə dəyişdirmək üçün OTP göndərmək.

**Request:**
```json
{
  "email": "admin@trconstruction.az"
}
```

---

### POST /api/v1/auth/change_password

OTP ilə şifrəni dəyişmək.

**Request:**
```json
{
  "email": "admin@trconstruction.az",
  "otp": "123456",
  "new_password": "NewPassword123"
}
```

---

## Hero Endpointləri

### GET /api/v1/hero

Hero slaydlarını əldə etmək.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": { "az": "Başlıq", "en": "Title" },
    "info": { "az": "Məlumat", "en": "Info" },
    "image_url": "http://localhost:8000/uploads/image.jpg",
    "button_text": { "az": "Ətraflı", "en": "Learn More" },
    "button_url": "/about"
  }
]
```

---

### POST /api/v1/hero

Yeni slayd əlavə etmək. **Token tələb olunur.** FormData göndərilir.

**Request (FormData):**
| Field | Type | Required |
|-------|------|----------|
| title | JSON string | ✓ |
| info | JSON string | ✗ |
| image | file | ✗ |
| button_text | JSON string | ✗ |
| button_url | string | ✗ |

**Response:** Bütün slaydlar siyahısı.

---

### PUT /api/v1/hero/{id}

Slaydı yeniləmək. **Token tələb olunur.** FormData göndərilir.

**Response:** Bütün slaydlar siyahısı.

---

### DELETE /api/v1/hero/{id}

Slaydı silmək. **Token tələb olunur.**

**Response:** Qalan slaydlar siyahısı.

---

## About Endpointləri

### GET /api/v1/about

Haqqımızda bölməsi.

**Response:**
```json
{
  "title": { "az": "...", "en": "..." },
  "info": { "az": "...", "en": "..." },
  "description": { "az": "...", "en": "..." },
  "image": "http://localhost:8000/uploads/image.jpg",
  "our_mission": { "az": "...", "en": "..." },
  "our_vision": { "az": "...", "en": "..." }
}
```

---

### POST /api/v1/about

About yaratmaq/yeniləmək. **Token tələb olunur.** FormData göndərilir.

---

### PUT /api/v1/about

About yeniləmək. **Token tələb olunur.** FormData göndərilir.

---

## Services Endpointləri

### GET /api/v1/services

Bütün xidmətlər.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": { "az": "Xidmət", "en": "Service" },
    "info": { "az": "Təsvir", "en": "Description" }
  }
]
```

---

### GET /api/v1/services/{id}

Tək xidmət məlumatı. **Token tələb olunur.**

---

### POST /api/v1/services

Xidmət əlavə etmək. **Token tələb olunur.**

**Request:**
```json
{
  "title": { "az": "...", "en": "..." },
  "info": { "az": "...", "en": "..." }
}
```

**Response:** Bütün xidmətlər siyahısı.

---

### PUT /api/v1/services

Xidmət yeniləmək. **Token tələb olunur.**

**Request:**
```json
{
  "id": "uuid",
  "title": { "az": "...", "en": "..." },
  "info": { "az": "...", "en": "..." }
}
```

---

### DELETE /api/v1/services/{id}

Xidmət silmək. **Token tələb olunur.**

---

## Stats Endpointləri

### GET /api/v1/stats

Statistikalar.

**Response:**
```json
[
  {
    "id": "uuid",
    "count": { "az": "150+", "en": "150+" },
    "detail": { "az": "Layihə", "en": "Projects" }
  }
]
```

---

### GET /api/v1/stats/{id}

Tək statistika. **Token tələb olunur.**

---

### POST /api/v1/stats

Statistika əlavə etmək. **Token tələb olunur.**

---

### PUT /api/v1/stats

Statistika yeniləmək. **Token tələb olunur.**

---

### DELETE /api/v1/stats/{id}

Statistika silmək. **Token tələb olunur.**

---

## Projects Endpointləri

### GET /api/v1/projects

Bütün layihələr (siyahı görünüşü).

**Response:**
```json
[
  {
    "id": "uuid",
    "title": { "az": "...", "en": "..." },
    "badge": { "az": "...", "en": "..." },
    "address": { "az": "...", "en": "..." },
    "map_url": "...",
    "cover_image": "http://localhost:8000/uploads/image.jpg"
  }
]
```

---

### GET /api/v1/projects/{id}

Layihə detalları (şəkil qalereyası ilə).

**Response:**
```json
{
  "id": "uuid",
  "title": { "az": "...", "en": "..." },
  "details": { "az": "...", "en": "..." },
  "badge": { "az": "...", "en": "..." },
  "address": { "az": "...", "en": "..." },
  "map_url": "...",
  "cover_image": "...",
  "image_gallery": [
    { "id": "uuid", "image_url": "..." }
  ]
}
```

---

### POST /api/v1/projects

Layihə yaratmaq. **Token tələb olunur.** FormData göndərilir.

---

### PUT /api/v1/projects

Layihə yeniləmək. **Token tələb olunur.** FormData göndərilir.

---

### DELETE /api/v1/projects/{id}

Layihə silmək. **Token tələb olunur.**

---

### POST /api/v1/projects/images/{project_id}

Layihəyə şəkillər əlavə etmək. **Token tələb olunur.**

---

### PUT /api/v1/projects/images/{project_id}

Layihə şəklini yeniləmək. **Token tələb olunur.**

---

### DELETE /api/v1/projects/{project_id}/{image_id}

Layihədən şəkil silmək. **Token tələb olunur.**

---

## Workflow Endpointləri

### GET /api/v1/workflow

İş axını addımları.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": { "az": "...", "en": "..." },
    "details": { "az": "...", "en": "..." }
  }
]
```

---

### POST /api/v1/workflow

Addım əlavə etmək. **Token tələb olunur.**

---

### PUT /api/v1/workflow

Addım yeniləmək. **Token tələb olunur.**

---

### DELETE /api/v1/workflow/{id}

Addım silmək. **Token tələb olunur.**

---

## Partners Endpointləri

### GET /api/v1/partners

Tərəfdaşlar.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": { "az": "...", "en": "..." },
    "image": "http://localhost:8000/uploads/image.jpg"
  }
]
```

---

### POST /api/v1/partners

Tərəfdaş əlavə etmək. **Token tələb olunur.** FormData göndərilir.

---

### PUT /api/v1/partners

Tərəfdaş yeniləmək. **Token tələb olunur.** FormData göndərilir.

---

### DELETE /api/v1/partners/{id}

Tərəfdaş silmək. **Token tələb olunur.**

---

## Testimonials Endpointləri

### GET /api/v1/testimonials

Müştəri rəyləri.

**Response:**
```json
[
  {
    "id": "uuid",
    "customer_full_name": { "az": "...", "en": "..." },
    "customer_type": { "az": "...", "en": "..." },
    "customer_review": { "az": "...", "en": "..." },
    "rating": 4.5
  }
]
```

---

### POST /api/v1/testimonials

Rəy əlavə etmək. **Token tələb olunur.**

---

### PUT /api/v1/testimonials

Rəy yeniləmək. **Token tələb olunur.**

---

### DELETE /api/v1/testimonials/{id}

Rəy silmək. **Token tələb olunur.**

---

## Contact Info Endpointləri

### GET /api/v1/contact_info

Əlaqə məlumatları.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": { "az": "Ünvan", "en": "Address" },
    "detail": { "az": "Bakı...", "en": "Baku..." },
    "url": "...",
    "contact_type": "address"
  }
]
```

---

### POST /api/v1/contact_info

Əlaqə əlavə etmək. **Token tələb olunur.**

---

### PUT /api/v1/contact_info

Əlaqə yeniləmək. **Token tələb olunur.**

---

### DELETE /api/v1/contact_info/{id}

Əlaqə silmək. **Token tələb olunur.**

---

## Socials Endpointləri

### GET /api/v1/socials

Sosial şəbəkələr.

**Response:**
```json
[
  {
    "id": "uuid",
    "url": "https://facebook.com/...",
    "type": "facebook"
  }
]
```

---

### POST /api/v1/socials

Sosial əlavə etmək. **Token tələb olunur.**

---

### PUT /api/v1/socials

Sosial yeniləmək. **Token tələb olunur.**

---

### DELETE /api/v1/socials/{id}

Sosial silmək. **Token tələb olunur.**

---

## Map URL Endpointləri

### GET /api/v1/map_url

Xəritə koordinatları.

**Response:**
```json
{
  "long": "49.8671",
  "lat": "40.4093"
}
```

---

### PUT /api/v1/map_url

Koordinatları yeniləmək. **Token tələb olunur.**

**Request:**
```json
{
  "long": "49.8671",
  "lat": "40.4093"
}
```

---

## Applications Endpointləri

### GET /api/v1/applications

Müraciətlər. **Token tələb olunur.**

**Response:**
```json
[
  {
    "id": "uuid",
    "full_name": "Ad Soyad",
    "email": "email@example.com",
    "phone": "+994...",
    "message": "...",
    "is_viewed": false
  }
]
```

---

### POST /api/v1/applications

Müraciət göndərmək (vebsaytdan).

**Request:**
```json
{
  "full_name": "Ad Soyad",
  "email": "email@example.com",
  "phone": "+994...",
  "message": "..."
}
```

**Response:**
```
"Müraciətiniz qəbul olundu"
```

---

### PUT /api/v1/applications

Müraciət statusunu yeniləmək. **Token tələb olunur.**

**Request:**
```json
{
  "id": "uuid",
  "is_viewed": true
}
```

---

### PUT /api/v1/applications/{id}

Müraciəti baxıldı kimi işarələmək. **Token tələb olunur.**

---

## Languages Endpointləri

### GET /api/v1/languages

Mövcud dillər.

**Response:**
```json
[
  { "id": "uuid", "lang": "az" },
  { "id": "uuid", "lang": "en" }
]
```

---

### POST /api/v1/languages

Dil əlavə etmək. **Token tələb olunur.**

**Request:**
```json
{
  "lang": "ru"
}
```

---

### PUT /api/v1/languages

Dil yeniləmək. **Token tələb olunur.**

**Request:**
```json
{
  "id": "uuid",
  "lang": "ru"
}
```

---

### DELETE /api/v1/languages/{id}

Dil silmək. **Token tələb olunur.**

---

## Xəta Kodları

| Kod | Məna |
|-----|------|
| 200 | Uğurlu |
| 201 | Yaradıldı |
| 400 | Səhv sorğu |
| 401 | Autentifikasiya tələb olunur |
| 403 | İcazə yoxdur |
| 404 | Tapılmadı |
| 500 | Server xətası |

---

## Qeydlər

1. Bütün şəkillər `public/uploads` qovluğunda saxlanılır
2. Şəkil formatları: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`
3. Maksimum şəkil ölçüsü: 10MB
4. Profil şəkli maksimum: 5MB
5. JWT token müddəti: 30 gün

---

## Default Admin Məlumatları

```
Email: admin@trconstruction.az
Password: Admin@123
```

---

*Sənəd versiyası: 1.0.0*
*Son yenilənmə: 2026-01-17*
