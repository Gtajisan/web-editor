# Contributing to Anbu AI

First off, thank you for considering contributing to Anbu AI! It's people like you that make Anbu AI such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or animated GIFs** if possible
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Update documentation as needed
6. Write a clear commit message

## Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/anbuai.git

# Navigate to directory
cd anbuai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use ESLint and Prettier for formatting

```bash
# Run linter
npm run lint

# Format code (if prettier is installed)
npx prettier --write .
```

### Commit Messages

Follow these guidelines for commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:
```
Add image generation feature

Implement DALL-E 3 integration for the image API endpoint.
Includes error handling and response formatting.

Closes #123
```

### Branch Naming

Use descriptive branch names:
- `feature/add-voice-input` - for new features
- `fix/chat-scroll-bug` - for bug fixes
- `docs/update-readme` - for documentation
- `refactor/api-structure` - for refactoring

## Project Structure

```
anbuai/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── lib/             # Utility functions and helpers
├── hooks/           # Custom React hooks
├── public/          # Static assets
└── styles/          # Global styles
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments to functions
- Update API documentation for endpoint changes
- Add examples for new features

## Review Process

1. A maintainer will review your PR within 48 hours
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR

## Community

- Join our [Telegram community](https://t.me/Anbusoft)
- Follow us on social media

## Questions?

Feel free to reach out:
- Open a discussion on GitHub
- Email us at anbuinfosec@gmail.com
- Join our Telegram channel

Thank you for contributing! 🎉
