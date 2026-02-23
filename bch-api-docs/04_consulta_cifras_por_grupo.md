# 4. Consulta cifras por grupo de indicadores

Consulta las cifras de todos los indicadores por grupo de indicadores. El parámetro "grupo" es un campo obligatorio.

**Cifras — Cifras BCH — Grupos de Indicadores**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/grupo/{grupo}/cifras[?formato]
```

---

## Request Parameters

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `grupo` | template | **true** | string | Grupo de indicadores a mostrar. |
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
    "valor": 0.369715077747528
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
