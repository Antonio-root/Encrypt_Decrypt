# Cifrado César y Vigenère API

API construida con Node.js y Express que proporciona servicios de encriptación y desencriptación utilizando los algoritmos de César y Vigenère. Además, mantiene un historial de todas las operaciones realizadas en una base de datos MongoDB.

## Características

- **Cifrado César**: Encripta y desencripta texto usando un desplazamiento numérico.
- **Cifrado Vigenère**: Encripta y desencripta texto usando una palabra clave.
- **Historial de Operaciones**: Registro automático de todas las acciones (algoritmo, tipo de acción, clave, resultado).

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución.
- **Express**: Framework web para la API.
- **MongoDB**: Base de datos NoSQL para persistencia.
- **Mongoose**: ODM para modelado de datos.
- **Cors**: Middleware para habilitar CORS.
- **Dotenv**: Manejo de variables de entorno.

## Instalación

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables (ajusta según tu configuración):

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
    ```

4.  **Iniciar el servidor:**

    ```bash
    npm start
    ```

## Documentación de la API

### 1. Cifrado César

*   **Encriptar**
    *   **URL:** `/api/cipher/caesar`
    *   **Método:** `POST`
    *   **Body:**
        ```json
        {
          "text": "Hola Mundo",
          "shift": 3
        }
        ```
    *   **Respuesta:** `json { "originalText": "Hola Mundo", "encryptedText": "Krod Pxqgr", "shift": 3, "algorithm": "caesar", "action": "encrypt" }`

*   **Desencriptar**
    *   **URL:** `/api/cipher/caesar/decrypt`
    *   **Método:** `POST`
    *   **Body:**
        ```json
        {
          "text": "Krod Pxqgr",
          "shift": 3
        }
        ```

### 2. Cifrado Vigenère

*   **Encriptar**
    *   **URL:** `/api/cipher/vigenere`
    *   **Método:** `POST`
    *   **Body:**
        ```json
        {
          "text": "Hola Mundo",
          "key": "clave"
        }
        ```

*   **Desencriptar**
    *   **URL:** `/api/cipher/vigenere/decrypt`
    *   **Método:** `POST`
    *   **Body:**
        ```json
        {
          "text": "TextoEncriptado",
          "key": "clave"
        }
        ```

### 3. Historial

*   **Obtener Historial**
    *   **URL:** `/api/cipher/history`
    *   **Método:** `GET`
    *   **Respuesta:** Devuelve un array con los registros de todas las operaciones realizadas.
