# Configuración en Supabase para el módulo de Gastos

El panel de administración divide la facturación en **Ventas** (lo de siempre) y
**Gastos** (facturas recibidas de proveedores, con adjunto en PDF/imagen y
lectura automática de campos). Para que la pestaña **Gastos** funcione hay que
crear una tabla y un bucket de almacenamiento en tu proyecto de Supabase.

Solo hay que hacerlo **una vez**.

---

## 1) Crear la tabla `gastos`

En Supabase → **SQL Editor** → *New query*, pega esto y pulsa **Run**:

```sql
create table if not exists public.gastos (
  id             uuid primary key default gen_random_uuid(),
  creada_en      timestamptz not null default now(),
  fecha          date,
  proveedor_nombre text,
  proveedor_nif  text,
  concepto       text,
  categoria      text,
  base           numeric(12,2) default 0,
  iva_pct        numeric(5,2)  default 0,
  iva_importe    numeric(12,2) default 0,
  total          numeric(12,2) default 0,
  forma_pago     text,
  archivo_path   text,   -- ruta del adjunto dentro del bucket
  archivo_nombre text,   -- nombre original del archivo
  notas          text
);

alter table public.gastos enable row level security;

-- Solo el equipo (usuarios autenticados) puede operar con los gastos.
create policy "gastos_select" on public.gastos for select to authenticated using (true);
create policy "gastos_insert" on public.gastos for insert to authenticated with check (true);
create policy "gastos_update" on public.gastos for update to authenticated using (true) with check (true);
create policy "gastos_delete" on public.gastos for delete to authenticated using (true);
```

---

## 2) Crear el bucket de adjuntos

En Supabase → **Storage** → **New bucket**:

- **Name:** `gastos-adjuntos`
- **Public bucket:** **desactivado** (privado). Los archivos se abren mediante
  enlaces firmados temporales, así que no quedan expuestos públicamente.

Pulsa **Create bucket**.

---

## 3) Permisos del bucket

Vuelve al **SQL Editor** y ejecuta esto para que el equipo pueda subir, ver y
borrar los adjuntos:

```sql
create policy "gastos_files_select" on storage.objects
  for select to authenticated using (bucket_id = 'gastos-adjuntos');

create policy "gastos_files_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'gastos-adjuntos');

create policy "gastos_files_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'gastos-adjuntos');
```

> Si alguna policy ya existe y Supabase se queja, borra la que choque desde
> **Storage → Policies** o cambia el nombre y vuelve a ejecutar.

---

## Listo

Al entrar en el panel verás las pestañas **Ventas** y **Gastos**. En Gastos
puedes:

- **+ Nuevo gasto**: crear el registro a mano.
- **⬆ Subir factura**: subir un PDF o una imagen. El programa intenta leer
  automáticamente fecha, proveedor, NIF/CIF, base, IVA y total, y prerrellena
  el formulario para que lo **revises** antes de guardar.
- Ver el adjunto, editar, borrar y exportar los gastos filtrados a Excel.

### Notas sobre la lectura automática
- Funciona mejor con **PDFs digitales** (los que genera un ordenador).
- En **fotos y escaneos** se usa OCR (Tesseract.js): tarda más y puede fallar;
  por eso **siempre hay que revisar** los campos antes de guardar.
- La primera lectura descarga las librerías desde CDN (unos segundos).
