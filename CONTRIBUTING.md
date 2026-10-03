# Contributing to Local Business AI Suite

Thank you for your interest in contributing! We welcome all kinds of contributions from the community.

## Types of Contributions

### 🐛 Bug Reports
- Use the GitHub Issues tab
- Include steps to reproduce
- Specify your environment (Node version, OS, etc.)
- Attach error logs or screenshots

### ✨ Feature Requests
- Check existing issues first to avoid duplicates
- Describe the use case and expected behavior
- Explain how it benefits local businesses
- Suggest implementation approach if possible

### 📝 Documentation Improvements
- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Translate documentation to other languages

### 💻 Code Contributions
- Fork the repository
- Create a feature branch: `git checkout -b feature/your-feature`
- Commit your changes: `git commit -m "Add feature: description"`
- Push to the branch: `git push origin feature/your-feature`
- Open a Pull Request

## Code Standards

### TypeScript
- Use strict mode (`tsconfig.json`)
- Add type annotations
- No `any` types without justification
- Use meaningful variable names

### Formatting
```bash
# Type check your code
npm run lint
```

### Commit Messages
```
type: description

Optional detailed explanation

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
```
feat: Add WhatsApp webhook validation
fix: Resolve Gemini API timeout on 503
docs: Update deployment guide for Cloud Run
```

## Pull Request Process

1. **Before submitting:**
   - Ensure code passes `npm run lint`
   - Test locally with `npm run dev`
   - Update README if adding new features
   - Add comments for complex logic

2. **PR Description:**
   - Link to related issues
   - Describe changes clearly
   - Include screenshots for UI changes
   - List any breaking changes

3. **Review process:**
   - Maintainers will review within 3-5 days
   - Address feedback and push updates
   - We may suggest improvements

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/LOCAL-BUSINESS-AI-SUITE.git
cd LOCAL-BUSINESS-AI-SUITE

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development
npm run dev

# Open http://localhost:3000
```

## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed information.

## Areas We're Looking For Help

### High Priority
- Backend modularization (split `server.ts`)
- Comprehensive test suite
- Database integration (PostgreSQL/MongoDB)
- Improved error handling

### Medium Priority
- Additional AI models integration
- Enhanced analytics dashboard
- Mobile app improvements
- Documentation translations

### Nice-to-Have
- Performance optimizations
- UI/UX improvements
- Additional language support
- Community integrations

## Community Guidelines

- Be respectful and inclusive
- Help others learn
- Give credit to contributors
- Report issues professionally
- No spam or self-promotion

## Questions?

- Open a GitHub Discussion
- Email: sangameshkhatge@gmail.com
- Check existing documentation

## Recognition

All contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in project documentation

Thank you for helping us build the best AI platform for local businesses! 🙌
