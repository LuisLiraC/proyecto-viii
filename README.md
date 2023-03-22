# Casos de uso

### 📝 Usuarios pueden crear su cuenta con correo y contraseña

Criterios de aceptación:

- Los usuarios deben poder crear una cuenta proporcionando un correo electrónico y una contraseña válidos.
- El sistema debe verificar que el correo electrónico no esté ya registrado en el sistema.
- Una vez creada la cuenta, los usuarios deben poder iniciar sesión con su correo electrónico y contraseña.

### 📝 Los usuarios pueden crear retos

Criterios de aceptación:

- Los usuarios deben poder crear un reto proporcionando un título y una descripción del mismo.
- El sistema debe asignar automáticamente un identificador único al reto.

### 📝 Los usuarios pueden ver retos

Criterios de aceptación:

- Los usuarios deben poder ver una lista de todos los retos publicados en el sistema.
- Los usuarios deben poder buscar retos por título o palabras clave.
- Los usuarios deben poder ver los detalles de un reto específico, incluyendo la descripción y las soluciones
  presentadas.

### 📝 Los usuarios pueden subir soluciones a los retos

Criterios de aceptación:

- Los usuarios deben poder subir una solución a un reto específico.
- El sistema debe permitir a los usuarios subir archivos de imagen, video o texto para describir la solución.
- Los usuarios deben poder ver su solución después de subirla.

### 📝 Los usuarios pueden retroalimentar otros proyectos

Criterios de aceptación:

- Los usuarios deben poder proporcionar retroalimentación pública a las soluciones presentadas por otros usuarios.
- El sistema debe mostrar la retroalimentación pública junto con la solución correspondiente.

### 📝 Las retroalimentaciones son públicas

Criterios de aceptación:

- Las retroalimentaciones proporcionadas por los usuarios deben ser visibles públicamente.

### 📝 Los usuarios pueden compartir tener información sobre su perfil donde se verán sus proyectos solucionados y retros creados

Criterios de aceptación:

- El sistema debe permitir que los usuarios compartan información sobre su perfil, incluyendo una lista de los retos en
  los que han participado y las soluciones que han subido.
- Los usuarios deben poder editar su perfil y agregar información adicional si lo desean.
- El sistema debe mostrar la información del perfil en la página pública de cada usuario.

### 📝 Los administradores pueden gestionar los proyectos creados y soluciones subidas por los usuarios

Criterios de aceptación:

- El sistema debe permitir a los administradores ver y editar la información de todos los retos y soluciones.
- Los administradores deben poder eliminar retos o soluciones si son inapropiados o incumplen las reglas del sistema.

## Database

![ERD Draw](https://i.imgur.com/NJYQ3eo.jpg)
![ERD](https://i.imgur.com/lenSzGq.png)

## Mockups

### Página Principal

![Home](https://i.imgur.com/nWny0tW.png)
![Home Empty State](https://i.imgur.com/QQVGcZ8.png)

### Iniciar sesión / Registrarse

![Sign In Sign Up](https://i.imgur.com/3lV3ea4.png)
![Sign In Errors](https://i.imgur.com/jMymNg3.png)
![Sign Up Errors](https://i.imgur.com/IDkXX92.png)

### Vista del reto

![Challenge View](https://i.imgur.com/IMmxSNd.png)
![Solved](https://i.imgur.com/nGCdXu4.png)
![Upload Solution](https://i.imgur.com/pPUSwdH.png)
![Upload Solution Errors](https://i.imgur.com/ILN6viz.png)

### Crear reto

![Create Challenge](https://i.imgur.com/S0QaClG.png)
![Create Challenge Errors](https://i.imgur.com/qipNRt4.png)

### Solución

![Solution View](https://i.imgur.com/dqSxFTQ.png)
![Comment Errors](https://i.imgur.com/pTzN9Oa.png)

### Perfil

![Profile](https://i.imgur.com/72FOrYe.png)
![Profile Solutions Empty State](https://i.imgur.com/NMh5vJQ.png)
![Profile Challenges Empty State](https://i.imgur.com/HSQcmIH.png)

## API Contracts

`POST /api/v1/auth/sign_in/`

Request Body

```json
{
  "email": "test@email.com",
  "password": "123456"
}
```

---

`POST /api/v1/auth/sign_up/`

Request Body

```json
{
  "email": "test@email.com",
  "password": "123456",
  "name": "Test Test",
  "username": "Test123"
}
```

---

`POST /api/v1/auth/username_available/`

Request Body

```json
{
  "username": "Test123456"
}
```

Response Body

```json
{
  "is_available": true
}
```

---

`GET /api/v1/challenge/`

Response Body

```json
[
  {
    "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5",
    "title": "Reto de ejemplo",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    "author": {
      "username": "LuisLiraC",
      "name": "Luis Lira"
    },
    "created_at": "2023-03-20 18:09:49.539010"
  },
  {
    "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
    "title": "Reto de ejemplo 2",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    "author": {
      "username": "LuisLiraC",
      "name": "Luis Lira"
    },
    "created_at": "2023-03-20 18:09:49.539010"
  }
]
```

---

`GET /api/v1/challenge/<challenge_id>/`

Response Body

```json
{
  "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5",
  "title": "Reto de ejemplo",
  "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  "author": {
    "username": "LuisLiraC",
    "name": "Luis Lira"
  },
  "created_at": "2023-03-20 18:09:49.539010"
}
```

---

`GET /api/v1/challenge/<challenge_id>/solutions/`

Response Body

```json
[
  {
    "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
    "url": "https://luislira.dev/",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    "author": {
      "username": "LuisLiraC",
      "name": "Luis Lira"
    },
    "created_at": "2023-03-20 18:09:49.539010"
  },
  {
    "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5",
    "url": "https://luislira.dev/",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    "author": {
      "username": "LuisLiraC",
      "name": "Luis Lira"
    },
    "created_at": "2023-03-20 18:09:49.539010"
  }
]
```

`POST /api/v1/challenge/`

Request Body

```json
{
  "title": "Reto de ejemplo",
  "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  "tags": [
    {
      "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
      "name": "Frontend"
    },
    {
      "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5",
      "name": "Backend"
    }
  ]
}
```

Response Body

```json
{
  "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5"
}
```

---

`GET /api/v1/solution/<solution_id>/`

Response Body

```json
{
  "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
  "url": "https://luislira.dev/",
  "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  "author": {
    "username": "LuisLiraC",
    "name": "Luis Lira"
  },
  "created_at": "2023-03-20 18:09:49.539010"
}
```

---

`GET /api/v1/solution/<solution_id>/comments/`

Response Body

```json
[
  {
    "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
    "content": "Comentario de ejemplo",
    "author": {
      "username": "LuisLiraC",
      "name": "Luis Lira"
    },
    "created_at": "2023-03-20 18:09:49.539010"
  },
  {
    "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5",
    "content": "Comentario de ejemplo",
    "author": {
      "username": "LuisLiraC",
      "name": "Luis Lira"
    },
    "created_at": "2023-03-20 18:09:49.539010"
  }
]
```

---

`POST /api/v1/solution/`

Request Body

```json
{
  "url": "https://luislira.dev/",
  "description": "Some description",
  "challenge_id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2"
}
```

Response Body

```json
{
  "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2"
}
```

---

`GET /api/v1/tag/`

Response Body

```json
[
  {
    "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
    "name": "Frontend"
  },
  {
    "id": "87c05b98-abfa-4f67-97ce-b6f5e276aea5",
    "name": "Backend"
  }
]
```

---

`GET /api/v1/profile/<username>/`

Response Body

```json
{
  "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
  "name": "Luis Lira",
  "username": "LuisLiraC",
  "challenges": [
    {
      "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
      "title": "Reto de ejemplo 2",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      "created_at": "2023-03-20 18:09:49.539010"
    }
  ],
  "solutions": [
    {
      "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      "url": "https://luislira.dev/",
      "challenge_id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
      "created_at": "2023-03-20 18:09:49.539010"
    }
  ]
}
```

---

`POST /api/v1/comment/`

Request Body

```json
{
  "solution_id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
  "content": "Comentario de ejemplo"
}
```

Response Body

```json
{
  "id": "c4bbdcf5-e1eb-43ef-8572-464963b41cd2",
  "content": "Comentario de ejemplo",
  "author": {
    "username": "LuisLiraC",
    "name": "Luis Lira"
  },
  "created_at": "2023-03-20 18:09:49.539010"
}
```
