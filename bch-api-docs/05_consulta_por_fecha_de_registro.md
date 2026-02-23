# 5. Consulta por fecha de registro

Consulta el valor de un indicador para una fecha específica. Todos los parámetros son obligatorios.

**Cifras — Cifras BCH**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/{id}/cifras/{fecha}[?formato]
```

---

## Request Parameters

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `id` | template | **true** | integer (int32) | Id del indicador a mostrar. |
| `fecha` | template | **true** | string | Fecha de búsqueda para la cifra. Formato `AAAA-MM-DD`. |
| `formato` | query | false | string | Formato de salida de la solicitud. Si no se especifica, el formato por defecto es `json`. |

---

## Request Body

*(Sin cuerpo de solicitud)*

---

## Response: 200 OK

**OK** — `application/json`

### `Cifra`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `indicadorId` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `fecha` | false | string (date-time) | |
| `valor` | false | number (double) | |

**Ejemplo:**

```json
{
    "id": 0,
    "indicadorId": 0,
    "nombre": "string",
    "descripcion": "string",
    "fecha": "string",
    "valor": 0
}
```

---

## Response: 404 Not Found

**Not Found** — `application/json`

### `ErrorResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `code` | false | integer (int32) | |
| `message` | false | string | |

**Ejemplo:**

```json
{
    "code": 0,
    "message": "string"
}
```

---

## Definitions

### `Cifra`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `indicadorId` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `fecha` | false | string (date-time) | |
| `valor` | false | number (double) | |

### `ErrorResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `code` | false | integer (int32) | |
| `message` | false | string | |
