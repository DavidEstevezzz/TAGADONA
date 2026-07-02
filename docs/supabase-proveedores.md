# Configuración en Supabase para el módulo de Proveedores

La pestaña **Proveedores** permite guardar los datos de facturación de cada
proveedor una sola vez y, al crear un gasto, elegirlo en un desplegable para
que se rellenen automáticamente (nombre, NIF/CIF, dirección, teléfono, forma de
pago y categoría).

Hay que ejecutar este SQL **una vez** en Supabase → **SQL Editor**.

---

## 1) Crear la tabla `proveedores`

```sql
create table if not exists public.proveedores (
  id          uuid primary key default gen_random_uuid(),
  creada_en   timestamptz not null default now(),
  nombre      text not null,
  nif         text,
  direccion   text,
  email       text,
  telefono    text,
  forma_pago  text,
  categoria   text,
  notas       text
);

alter table public.proveedores enable row level security;

create policy "proveedores_select" on public.proveedores for select to authenticated using (true);
create policy "proveedores_insert" on public.proveedores for insert to authenticated with check (true);
create policy "proveedores_update" on public.proveedores for update to authenticated using (true) with check (true);
create policy "proveedores_delete" on public.proveedores for delete to authenticated using (true);
```

---

## 2) Enlazar los gastos con el proveedor

Añade a la tabla `gastos` la columna que guarda a qué proveedor pertenece cada
gasto. Es **obligatorio** para que la pestaña Gastos siga guardando sin errores
una vez desplegado este cambio.

```sql
alter table public.gastos
  add column if not exists proveedor_id uuid references public.proveedores(id) on delete set null;
```

> `on delete set null` significa que, si borras un proveedor, sus gastos se
> conservan (el enlace se pone a nulo). Además el gasto guarda siempre una copia
> del nombre y NIF (`proveedor_nombre`, `proveedor_nif`), así que el histórico no
> se altera aunque edites o borres el proveedor.

---

## Listo

En el panel verás una tercera pestaña, **Proveedores**, donde puedes crear,
editar y borrar proveedores con sus datos de facturación.

Al crear o editar un **gasto**, el primer campo es un desplegable **Proveedor**:
- Si eliges uno, se rellenan su nombre, NIF/CIF, dirección, teléfono, forma de
  pago y categoría (puedes seguir editándolos: el gasto guarda su propia copia).
- Con **“— Manual / sin proveedor —”** rellenas los datos a mano como hasta ahora.
- El botón **“+ Nuevo”** te lleva a la pestaña Proveedores para dar de alta uno.
