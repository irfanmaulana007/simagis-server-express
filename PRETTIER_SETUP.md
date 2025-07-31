# Prettier Setup Documentation

This document explains the Prettier configuration and usage in the POS & Warehouse API project.

## 🎨 What is Prettier?

Prettier is an opinionated code formatter that ensures consistent code style across the entire project. It automatically formats your code according to predefined rules, eliminating debates about code style and making the codebase more maintainable.

## ⚙️ Configuration

### Prettier Configuration (`.prettierrc`)
```json
{
  "semi": true,                    // Use semicolons
  "trailingComma": "es5",         // Trailing commas where valid in ES5
  "singleQuote": true,            // Use single quotes instead of double
  "printWidth": 100,              // Line length limit
  "tabWidth": 2,                  // 2 spaces per indentation level
  "useTabs": false,               // Use spaces instead of tabs
  "bracketSpacing": true,         // Spaces between brackets { foo }
  "bracketSameLine": false,       // Put > on new line in JSX
  "arrowParens": "avoid",         // Omit parens when possible (x => x)
  "endOfLine": "lf"               // Use Unix line endings
}
```

### ESLint Integration
Prettier is integrated with ESLint to work together seamlessly:
- `eslint-config-prettier`: Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule

## 📝 Usage

### Command Line Scripts
```bash
# Format code in src/ directory
npm run format

# Check if code is properly formatted (returns error if not)
npm run format:check

# Format all files in the project
npm run format:all
```

### VS Code Integration
The project includes VS Code settings that:
- Format code automatically on save
- Use Prettier as the default formatter
- Run ESLint fixes on save
- Set consistent editor settings

### Manual Formatting
You can also run Prettier directly:
```bash
# Format specific files
npx prettier --write src/controllers/userController.ts

# Format all TypeScript files
npx prettier --write "src/**/*.ts"

# Check formatting without making changes
npx prettier --check "src/**/*.ts"
```

## 🔧 IDE Setup

### VS Code (Recommended)
1. Install the "Prettier - Code formatter" extension
2. The project includes `.vscode/settings.json` with optimal settings
3. Code will format automatically on save

### Other IDEs
- **WebStorm/IntelliJ**: Built-in Prettier support
- **Vim/Neovim**: Use plugins like `prettier/vim-prettier`
- **Sublime Text**: Use the "JsPrettier" package

## 🚫 Files Excluded from Formatting

The `.prettierignore` file excludes:
- `node_modules/`
- `dist/` and `build/` directories
- Generated files
- Database migration files
- Log files
- Package lock files
- Environment files

## 🔄 Workflow Integration

### Pre-commit Hook (Optional)
You can set up a pre-commit hook to automatically format code:

1. Install husky:
```bash
npm install --save-dev husky lint-staged
```

2. Add to `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,js,json,md}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```

### CI/CD Integration
Add to your CI pipeline:
```bash
# Check formatting in CI
npm run format:check
npm run lint
```

## 🎯 Benefits

1. **Consistency**: All code follows the same style rules
2. **No Debates**: Removes discussions about code formatting
3. **Automatic**: Formats code without manual intervention
4. **Focus**: Developers can focus on logic instead of formatting
5. **Readability**: Consistent formatting improves code readability

## 🛠️ Customization

To modify formatting rules, edit `.prettierrc`:

```json
{
  "printWidth": 120,        // Increase line length
  "singleQuote": false,     // Use double quotes
  "semi": false,            // Remove semicolons
  "tabWidth": 4             // Use 4 spaces
}
```

After changing configuration, run:
```bash
npm run format:all
```

## 🐛 Troubleshooting

### Common Issues

1. **Formatting conflicts with ESLint**
   - Solution: The project uses `eslint-config-prettier` to disable conflicting rules

2. **Code not formatting on save**
   - Check VS Code settings
   - Ensure Prettier extension is installed and enabled
   - Check `.vscode/settings.json` configuration

3. **Different formatting in team**
   - Ensure everyone uses the same `.prettierrc` configuration
   - Consider using pre-commit hooks
   - Check editor settings

### Reset Formatting
To reformat all files according to current rules:
```bash
npm run format:all
```

## 📚 Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Prettier Configuration Options](https://prettier.io/docs/en/options.html)
- [ESLint + Prettier Integration](https://prettier.io/docs/en/integrating-with-linters.html)
- [VS Code Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
