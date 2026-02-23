# 6. Consulta de información por Id de indicador

Consulta el detalle de la información del indicador: Id, nombre, descripción, grupo, correlativo de grupo y periodicidad. El parámetro "Id" es un campo obligatorio.

**Cifras BCH — Indicadores**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/{id}[?formato]
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

### `Indicador`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `periodicidad` | false | string | |
| `correlativoGrupo` | false | string | |
| `grupo` | false | string | |

**Ejemplo:**

```json
{
    "id": 0,
    "nombre": "string",
    "descripcion": "string",
    "periodicidad": "string",
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

### `ErrorResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `code` | false | integer (int32) | |
| `message` | false | string | |

### `Indicador`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `periodicidad` | false | string | |
| `correlativoGrupo` | false | string | |
| `grupo` | false | string | |
