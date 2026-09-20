# Routes

## English
- `/`
- `/about`
- `/contact`
- `/services/<service>`

## Portuguese
- `/pt-BR/`
- `/pt-BR/about`
- `/pt-BR/contact`
- `/pt-BR/services/<service>`

## Not Present
- `/services`
- `/projects`
- project-detail routes in current scope.

## Special
- 404
- general error fallback/page
- external Login target

## Locale Rules
- English is default and unprefixed.
- Portuguese uses `/pt-BR/`.
- Switching language preserves equivalent route.
- Untranslated localized routes are not published.
