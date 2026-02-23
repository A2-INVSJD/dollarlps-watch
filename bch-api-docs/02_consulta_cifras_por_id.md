# 2. Consulta cifras por Id de indicador

Consulta las cifras para un indicador en específico obtenido por el Id del indicador. El parámetro "Id" es un campo obligatorio, el resto de criterios quedan a consideración del usuario. Si no se especifican parámetros, se obtendrán todos los datos disponibles para el indicador requerido, lo que podría demorar la obtención de la consulta; en ese sentido se sugiere afinar la búsqueda a los criterios requeridos.

**Cifras BCH**

---

## Request

```
GET https://bchapi-am.azure-api.net/api/v1/indicadores/{id}/cifras[?formato][&fechaInicio][&fechaFinal][&valorMinimo][&valorMaximo][&ordenamiento][&omitir][&reciente]
```

---

## Request Parameters

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `id` | template | **true** | integer (int32) | Id del indicador a mostrar. |
| `formato` | query | false | string | Formato de salida de la solicitud. Si no se especifica, el formato por defecto es `json`. |
| `fechaInicio` | query | false | string (date-time, RFC3339) | Fecha de inicio para el rango de búsqueda de fecha. Este rango es inclusivo. Formato `AAAA-MM-DD`. |
| `fechaFinal` | query | false | string (date-time, RFC3339) | Fecha de finalización para el rango de búsqueda por fecha. Este rango es inclusivo. Formato `AAAA-MM-DD`. |
| `valorMinimo` | query | false | number (double) | Valor mínimo para el rango de búsqueda por valor. Este rango es inclusivo. |
| `valorMaximo` | query | false | number (double) | Valor máximo para el rango de búsqueda por valor. Este rango es inclusivo. |
| `ordenamiento` | query | false | string | Criterio de ordenamiento por fecha para la serie de datos obtenidos. Si no se especifica, el valor por defecto es Descendente. |
| `omitir` | query | false | integer (int32) | Cantidad de registros a omitir del resultado de los filtros. Por ejemplo: especificar `10` inicia a contar los registros a obtener bajo los filtros y criterio de ordenamiento especificados, si los hubiera, y a partir del décimo registro. |
| `reciente` | query | false | integer (int32) | Cantidad de registros a obtener del resultado de los filtros. Por ejemplo: especificar `1` obtiene solo el primer registro bajo los filtros y criterio de ordenamiento especificados, si los hubiera. |

---

## Request Body

*(Sin cuerpo de solicitud)*

---

## Response: 200 OK

**OK** — `application/json`

### `V1Indicadores-id-CifrasGet200ApplicationJsonResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `[]` | true | Cifra[] | |

**Ejemplo:**

```json
[{
    "id": 0,
    "indicadorId": 0,
    "nombre": "string",
    "descripcion": "string",
    "fecha": "string",
    "valor": 0
}]
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

### `V1Indicadores-id-CifrasGet200ApplicationJsonResponse`

| Name | Required | Type | Description |
|---|---|---|---|
| `[]` | true | Cifra[] | |
