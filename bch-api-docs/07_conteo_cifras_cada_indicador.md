# 7. Conteo de cifras para cada indicador

Consulta los indicadores publicados mediante la Web-API devolviendo el conteo de registros disponibles para cada uno. Todos los filtros son opcionales.

**Cifras BCH — Conteos — Indicadores**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/conteos[?formato][&nombre][&descripcion][&periodicidad][&ordenamiento][&conteoMinimo][&conteoMaximo][&ordenamientoConteo][&grupo][&correlativogrupo][&omitir][&reciente]
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
| `conteoMinimo` | query | false | integer (int32) | Criterio de búsqueda para el valor mínimo de conteos a incluir. |
| `conteoMaximo` | query | false | integer (int32) | Criterio de búsqueda para el valor máximo de conteos a incluir. |
| `ordenamientoConteo` | query | false | string | Criterio de ordenamiento por cantidad de conteos para la serie de datos obtenidos. Si no se especifica, los datos serán ordenados únicamente por el ordenamiento de id. |
| `grupo` | query | false | string | Grupo al cual pertenece el indicador a mostrar. |
| `correlativogrupo` | query | false | string | Correlativo que tiene el indicador dentro del grupo al que pertenece. |
| `omitir` | query | false | integer (int32) | Cantidad de registros a omitir del resultado de los filtros. Por ejemplo: especificar `10` inicia a contar los registros a obtener bajo los filtros y criterio de ordenamiento especificados, si los hubiera, y a partir del décimo registro. |
| `reciente` | query | false | integer (int32) | Cantidad de registros a obtener del resultado de los filtros. Por ejemplo: especificar `1` obtiene solo el primer registro bajo los filtros y criterio de ordenamiento especificados, si los hubiera. |

---

## Request Body

*(Sin cuerpo de solicitud)*

---

## Response: 200 OK

**OK** — `application/json`

### `V1IndicadoresConteosGet200ApplicationJsonResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `[]` | true | IndicadorConteo[] | |

**Ejemplo:**

```json
[{
    "id": 0,
    "nombre": "string",
    "descripcion": "string",
    "periodicidad": "string",
    "conteo": 0,
    "grupo": "string",
    "correlativoGrupo": "string"
}]
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

### `V1IndicadoresConteosGet200ApplicationJsonResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `[]` | true | IndicadorConteo[] | |
