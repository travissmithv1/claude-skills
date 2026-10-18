---
name: source-control-ready
description: Ensure project is safe for version control. Check for sensitive files, create .env.example, and configure .claudeignore.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Source Control Ready

Ensure the project is properly configured for safe version control.

## Checks to Perform

### 1. Sensitive Files Not Committed

Scan for files that should NOT be in version control:

**Environment & Secrets**
- `.env` (any .env files except .env.example)
- `.env.local`, `.env.development.local`, `.env.production.local`
- `*.pem`, `*.key`, `*.cert`
- `credentials.json`, `secrets.json`, `service-account.json`
- `*.secret`, `*.secrets`

**IDE & System**
- `.idea/`
- `.vscode/` (unless intentionally shared)
- `.DS_Store`
- `Thumbs.db`
- `*.swp`, `*.swo`

**Dependencies & Build**
- `node_modules/`
- `vendor/`
- `dist/`, `build/`, `out/`
- `*.log`
- `coverage/`

**Database**
- `*.sqlite`, `*.db`
- `*.sql` (if contains sensitive data)

Check using:
```bash
git ls-files
git status --porcelain
```

If sensitive files are tracked, warn the user and suggest removal with:
```bash
git rm --cached <file>
```

### 2. Ensure .env.example Exists

If the project uses `.env` files:

1. **Check for .env usage**: Look for `.env` files or `dotenv` imports/config
2. **Create .env.example**: If `.env` exists but `.env.example` doesn't, create one
3. **Contents**: Copy all keys from `.env` but replace values with placeholders

Example transformation:
```
# .env (actual)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
API_KEY=sk-1234567890abcdef
DEBUG=true

# .env.example (generated)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your-api-key-here
DEBUG=true
```

Rules for .env.example:
- Keep all variable names
- Replace secrets/credentials with descriptive placeholders
- Keep non-sensitive values (true/false, localhost, port numbers)
- Add comments explaining what each variable is for if not obvious

### 3. Ensure .claudeignore Exists

Create or update `.claudeignore` at project root to include:

```
# Environment files with secrets
.env
.env.local
.env.*.local
.env.development
.env.production

# Credentials
*.pem
*.key
credentials.json
secrets.json
```

If `.claudeignore` already exists, ensure `.env` is included. Don't duplicate entries.

### 4. Ensure .gitignore is Proper

Verify `.gitignore` includes at minimum:
- `.env` and variants
- `node_modules/` (for JS projects)
- Build output directories
- IDE files
- OS files (`.DS_Store`)

If missing critical entries, suggest additions.

## Process

1. **Scan for sensitive files**: Check what's tracked in git
2. **Report issues**: List any sensitive files that are committed
3. **Check for .env usage**: Determine if project uses environment files
4. **Create .env.example**: If needed, generate from existing .env
5. **Create/update .claudeignore**: Ensure .env is ignored by Claude
6. **Review .gitignore**: Suggest improvements if needed
7. **Summary**: Report what was checked and any actions taken

## Output

Provide a checklist summary:
- [ ] No sensitive files in version control
- [ ] .env.example exists (if .env is used)
- [ ] .claudeignore includes .env
- [ ] .gitignore is properly configured

List any manual actions the user needs to take (like removing already-committed files).
