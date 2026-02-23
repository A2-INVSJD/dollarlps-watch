# 1. Consulta de catálogo de indicadores

Consulta el catálogo de indicadores publicados mediante la Web-API, asimismo, se obtiene el detalle de la información del indicador: Id, nombre, descripción, grupo, correlativo de grupo y periodicidad. Ningún parámetro es obligatorio.

**Cifras BCH Indicadores**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores[?formato][&nombre][&descripcion][&periodicidad][&ordenamiento][&grupo][&correlativogrupo][&omitir][&reciente]
```

---

## Request Parameters

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `formato` | query | false | string | Formato de salida de la solicitud. Si no se especifica, el formato por defecto es `json`. |
| `nombre` | query | false | string | Criterio de búsqueda que contiene el nombre del indicador. La búsqueda por este criterio no distingue mayúsculas de minúsculas. |
| `descripcion` | query | false | string | Criterio de búsqueda por descripción para el indicador. La búsqueda por este criterio no distingue mayúsculas de minúsculas. |
| `periodicidad` | query | false | string | Criterio de búsqueda de periodicidad para el indicador. |
| `ordenamiento` | query | false | string | Criterio de ordenamiento por id para la serie de datos obtenidos. Si no se especifica, el valor por defecto es Ascendente. |
| `grupo` | query | false | string | Grupo al cual pertenece el indicador. |
| `correlativogrupo` | query | false | string | Correlativo que tiene el indicador dentro del grupo al que pertenece. |
| `omitir` | query | false | integer (int32) | Cantidad de registros a omitir del resultado de los filtros. Por ejemplo: especificar `10` inicia a contar los registros a obtener bajo los filtros y criterio de ordenamiento especificados, si los hubiera, y a partir del décimo registro. |
| `reciente` | query | false | integer (int32) | Cantidad de registros a obtener del resultado de los filtros. Por ejemplo: especificar `1` obtiene solo el primer registro bajo los filtros y criterio de ordenamiento especificados, si los hubiera. |

---

## Request Body

*(Sin cuerpo de solicitud)*

---

## Response: 200 OK

**OK** — `application/json`

### `V1IndicadoresGet200ApplicationJsonResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `[]` | true | Indicador[] | |

**Ejemplo:**

```json
[{
    "id": 0,
    "nombre": "string",
    "descripcion": "string",
    "periodicidad": "string",
    "grupo": "string",
    "correlativoGrupo": "string"
}]
```

---

## Definitions

### `Indicador`

| Name | Required | Type | Description |
|---|---|---|---|
| `id` | false | integer (int32) | |
| `nombre` | false | string | |
| `descripcion` | false | string | |
| `periodicidad` | false | string | |
| `correlativoGrupo` | false | string | |
| `grupo` | false | string | |

### `V1IndicadoresGet200ApplicationJsonResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `[]` | true | Indicador[] | |
