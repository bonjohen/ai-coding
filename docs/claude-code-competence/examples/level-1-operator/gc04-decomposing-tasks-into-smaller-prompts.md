# Decomposing Tasks into Smaller Prompts

## The Problem with Mega-Prompts

A single prompt that asks for too much produces worse results than a sequence of focused prompts. Claude Code works best when each interaction has a clear, bounded scope.

## Bad Example — One Mega-Prompt

```
> Build a user authentication system with login, signup, password reset,
> email verification, JWT tokens, refresh tokens, role-based access control,
> and rate limiting. Use Express, Prisma, and SendGrid.
```

This will produce something, but it will likely have:
- Missing edge cases
- Inconsistent patterns across files
- Hardcoded values
- No tests

## Good Example — Decomposed Prompts

### Prompt 1: Data model
```
> Create a Prisma schema for user authentication. I need a User model with
> email, passwordHash, role (enum: USER, ADMIN), emailVerified boolean,
> and timestamps. Add a RefreshToken model linked to User.
```

### Prompt 2: Signup endpoint
```
> Using the Prisma schema we just created, build a POST /auth/signup endpoint
> in src/routes/auth.ts. Hash the password with bcrypt, create the user,
> and return a JWT. Don't implement email verification yet.
```

### Prompt 3: Login endpoint
```
> Add POST /auth/login to the same auth router. Verify email and password,
> return both an access token (15min expiry) and refresh token (7d expiry).
> Store the refresh token in the database.
```

### Prompt 4: Tests
```
> Write tests for the signup and login endpoints using the existing test setup
> in tests/. Mock the database with the Prisma test client. Cover: successful
> signup, duplicate email, successful login, wrong password, missing fields.
```

## The Decomposition Pattern

1. **Data model first** — establish the foundation
2. **One endpoint or feature per prompt** — keep scope bounded
3. **Reference previous work** — "using the schema we just created"
4. **Tests after implementation** — verify each piece works
5. **Integration last** — wire things together after parts work individually

## How Many Prompts?

A good rule of thumb: if your prompt describes more than one logical operation, split it. "Create X and also do Y" should be two prompts.
