# Frontend structure

- `api/`: HTTP clients and API response types.
- `assets/`: static images and icons.
- `components/layout/`: application shell, header and bottom navigation.
- `components/shared/`: reusable UI that is not tied to a feature.
- `components/<feature>/`: reusable UI owned by a feature such as pond, shop or marketplace.
- `pages/<feature>/`: route-level screens and their page-specific styles.
- `context/`, `hooks/`, `sound/`, `theme/`: cross-cutting React state and behavior.
- `types/`: shared backend-facing TypeScript types.
- `utils/`: stateless helpers.

Keep route components in `pages`. Keep component styles beside their component and page styles beside their page.
