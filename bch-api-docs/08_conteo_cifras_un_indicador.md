# 8. Conteo de cifras para un indicador

Consulta el conteo de registros disponibles para un indicador en específico. El parámetro "Id" es un campo obligatorio.

**Cifras BCH — Conteos — Indicadores**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/{id}/conteos[?formato]
```

---

## Request Parameters

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `id` | template | **true** | integer (int32) | Id del indicador a mostrar. |
| `formato` | query | false | string | Formato de salida de la solicitud. Si no se especifica, el formato por defecto es `json`. |

---

## Request Body

*(Sin cuerpo de solicitud)*

---

## Response: 200 OK

**OK** — `application/json`

### `IndicadorConteo`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `periodicidad` | false | string | |
| `correlativoGrupo` | false | string | |
| `grupo` | false | string | |
| `conteo` | false | integer (int32) | |

**Ejemplo:**

```json
{
    "id": 0,
    "nombre": "string",
    "descripcion": "string",
    "periodicidad": "string",
    "conteo": 0,
    "grupo": "string",
    "correlativoGrupo": "string"
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

### `IndicadorConteo`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `periodicidad` | false | string | |
| `correlativoGrupo` | false | string | |
| `grupo` | false | string | |
| `conteo` | false | integer (int32) | |

### `ErrorResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `code` | false | integer (int32) | |
| `message` | false | string | |
