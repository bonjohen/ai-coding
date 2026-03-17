# Providing Context Before Asking for Code Changes

## The Problem

When you ask Claude Code to make a change without context, it has to guess what you mean. The same prompt can produce wildly different results depending on what the model assumes.

## Bad Example — No Context

```
> Fix the login bug
```

Claude Code doesn't know which login bug, which file, what framework, or what "fixed" looks like. It may edit the wrong file or introduce a different bug.

## Good Example — With Context

```
> The login form in src/components/LoginForm.tsx throws a "Cannot read property 'email'
> of undefined" error when the user submits with empty fields. The form uses React Hook
> Form with Zod validation. Fix the null check in the onSubmit handler so it validates
> before accessing formData.email.
```

This tells Claude Code:
- **Which file** to look at
- **What the error is** (exact message)
- **What technologies are in use** (React Hook Form, Zod)
- **Where the fix should go** (onSubmit handler)
- **What "fixed" means** (validate before accessing)

## What to Include in Context

1. **File path(s)** involved in the change
2. **What the code does** currently
3. **What's wrong** or what you want changed
4. **Constraints** — coding conventions, libraries in use, performance requirements
5. **What success looks like** — how you'll know the change is correct

## Practice Exercise

Take a task you'd normally give Claude Code in one sentence. Before sending it, write down:
- The file(s) involved
- The current behavior
- The desired behavior
- Any constraints

Then include all of that in your prompt. Compare the result quality to your usual approach.
