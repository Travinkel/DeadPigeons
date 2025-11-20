# Advanced Querying & Sieve (W41/W44)

Short guide to stable server‑side filtering, sorting, and pagination patterns that map to Programming II.

---

## Goals

- Predictable query model across endpoints
- Avoid ad‑hoc string parsing in controllers
- Ensure validation and safe defaults to prevent over‑fetching

## Patterns

- Filtering: explicit field allowlist; operators like eq, neq, contains, gt, lt; reject unknown fields
- Sorting: `sort=field,asc|desc` with allowlist; stable secondary sort (e.g., CreatedAt, Id) to avoid jitter
- Pagination: `page` + `pageSize` with caps (e.g., max 100)
- Projection: select only required columns (DTOs), use `AsNoTracking()`

## Example shape

`GET /players?name.contains=ann&sort=createdAt,desc&page=1&pageSize=20`

Server handling:

- Validate fields against allowlist (Name, CreatedAt, etc.)
- Build EF expressions via a small helper (or Sieve if adopted)
- Always append a stable tiebreaker sort (Id)

## Sieve option

- If using Sieve:
    - Define SieveModel from query
    - Configure SieveProcessor with mappings: which entity fields are filterable/sortable
    - Apply via `processor.Apply(model, dbSet.AsNoTracking())`
    - Wrap with DTO projection before materialization

## Response contract

- Data: array of DTOs
- Meta: totalCount, page, pageSize, hasNext

## Validation & security

- Enforce max pageSize
- Reject unknown filters/sorts
- Guard against over‑fetching by projecting to DTOs only

## Tests

- Sorting stability: same inputs → same order across calls
- Pagination boundaries: first/last page, hasNext correctness
- Filter correctness: eq/contains, numeric/date ranges

Related docs: Data Model Decisions (projections), NSwag Strategy (typed clients), Integration Tests (auth + query tests).