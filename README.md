# 🎨 Braindemy Frontend

> **Proyecto académico** desarrollado como parte de una práctica para el desarrollo de software.
>
> Este repositorio contiene la **interfaz web** de la plataforma **Braindemy**, un entorno educativo diseñado para la gestión de cursos, usuarios (docentes, alumnos y administradores), inscripciones, pagos, transmisiones en vivo y comunicación en tiempo real.

---

## 🎯 Objetivo del proyecto

El propósito de este proyecto es **aplicar principios modernos de desarrollo frontend** mediante el uso del framework **Angular**, implementando componentización, modularización y *lazy loading* para garantizar una arquitectura escalable y mantenible.

El proyecto **no tiene fines comerciales** y se encuentra en **etapa de desarrollo académico**, por lo que pueden existir errores.

---

## 🛠️ Tecnologías principales

| 🧩 **Componente** | ⚙️ **Tecnología / Herramienta** | 📝 **Descripción** |
| :--- | :---: | :--- |
| **Framework Frontend** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Angular-Dark.svg" width="40" height="40"><br>**Angular 18** | Framework moderno basado en TypeScript para construir aplicaciones web escalables. |
| **Lenguaje** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/TypeScript.svg" width="40" height="40"><br>**TypeScript** | Lenguaje tipado que mejora la mantenibilidad y robustez del código. |
| **Estilos / UI** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Bootstrap.svg" width="40" height="40"><br>**Bootstrap** | Framework utilitario para construir interfaces rápidas y modernas. |
| **Routing** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Angular-Light.svg" width="40" height="40"><br>**Angular Router** | Sistema de enrutamiento modular y dinámico con soporte para *lazy loading*. |
| **Autenticación** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Angular-Light.svg" width="40" height="40"><br>**Auth Guards / Services** | Sistema de protección de rutas y gestión de sesión de usuario. |
| **Backend API** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/NestJS-Dark.svg" width="40" height="40"><br>**NestJS REST API** | Comunicación con el backend de Braindemy mediante *HTTP Services*. |

---

## 📁 Estructura general del proyecto

```text
src/
 ├── app/
 │   ├── core/                # Servicios globales, guards, interceptores, etc.
 │   ├── shared/              # Componentes y utilidades reutilizables
 │   ├── features/
 │   │   ├── public/          # Landing page, about, contact
 │   │   ├── auth/            # Login, registro, recuperación de cuenta
 │   │   ├── teacher/         # Panel y gestión de cursos del docente
 │   │   └── admin/           # Panel administrativo del sistema
 │   ├── app.module.ts
 │   └── app-routing-module.ts
 ├── assets/
 └── environments/

```

## 🚀 Scripts principales

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo en `http://localhost:4200/` |
| `npm run build` | Genera la versión de producción del proyecto |
| `npm run lint` | Analiza el código para verificar buenas prácticas |
| `ng g c <nombre>` | Genera un nuevo componente Angular |
| `ng g module <nombre>` | Crea un nuevo módulo de funcionalidad |

---

## 🔒 Autenticación y seguridad

El sistema implementa *guards* (`CanActivate`, `CanActivateChild`) para restringir el acceso según el rol del usuario (docente, administrador).

La comunicación con el backend se realiza mediante servicios HTTP centralizados y un sistema de interceptores para el manejo de tokens y errores.

---

## 📦 Estado del proyecto

🚧 **En desarrollo** — Este repositorio forma parte del ecosistema Braindemy, junto con el backend desarrollado en NestJS.

Puede contener errores o funcionalidades incompletas debido a su naturaleza académica.
