# 3. Consulta Indicadores por grupo

Consulta un conjunto de indicadores publicados mediante la Web-API por grupo de indicadores. El parámetro "grupo" es un campo obligatorio.

**Cifras BCH — Grupos de Indicadores — Indicadores**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/grupo/{grupo}[?formato]
```

---

## Request Parameters

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `grupo` | template | **true** | string | Grupo al cual pertenecen los indicadores a mostrar. |
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
    "periodicidad": "string"
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
