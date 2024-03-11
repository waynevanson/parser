# `@waynevanson/parser`

Text parsing typescript modules that use the iterator protocol where applicable to convert text into values.

## Modules

Each module is independant of each other. This means you may bring your own scanner for the lexer, as long as the interface matches.

| Package                | Description                                             |
| :--------------------- | :------------------------------------------------------ |
| `@waynevanson/scanner` | Iterates over text and returns lexemes                  |
| `@waynevanson/lexer`   | Iterates over lexemes from a scanner and returns tokens |
| `@waynevanson/pratt`   | Iterates over tokens from a lexer and returns an output |
