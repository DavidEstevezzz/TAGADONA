# Campos nuevos en la tabla `facturas` (kilómetros y observaciones)

Las facturas de **venta** tienen dos campos adicionales:

- `moto_kilometros`: kilómetros que marca la moto en el momento de la venta.
- `observaciones`: texto libre que se imprime al final de la factura, junto a
  la garantía y la forma de pago.

Para que el panel pueda guardarlos hay que añadir las dos columnas en Supabase.
Solo hay que hacerlo **una vez**.

En Supabase → **SQL Editor** → *New query*, pega esto y pulsa **Run**:

```sql
alter table public.facturas
  add column if not exists moto_kilometros integer,
  add column if not exists observaciones   text;
```

Ambas columnas admiten valores vacíos: si no rellenas kilómetros u
observaciones, la factura se genera exactamente igual que antes (esas líneas
simplemente no aparecen en el PDF).

## Dónde se ven

- **Panel → Ventas → Nueva/Editar factura**: campo *Moto — Kilómetros* junto al
  bastidor y campo *Observaciones* al final del formulario.
- **Vista previa** del formulario: ambos se reflejan en tiempo real.
- **PDF de la factura**: los kilómetros salen dentro del detalle del vehículo
  (debajo del bastidor) y las observaciones en el bloque de condiciones, tras
  la forma de pago.
- **Exportación a Excel**: columnas *Kilómetros* y *Observaciones*.
