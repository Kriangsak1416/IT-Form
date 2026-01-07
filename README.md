# IT-Form

แบบฟอร์มศูนย์คอมพิวเตอร์ โรงพยาบาลแพร่

A Next.js dashboard application for hospital computer center forms, built with TypeScript, Tailwind CSS, and Next.js App Router.

## Features

- Patient registration form
- Service request form
- Risk reporting form
- User login system
- Responsive design with dark mode support
- Docker support for development

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker Development

For Docker development:

```bash
docker compose up --build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `app/` - Next.js App Router pages
- `lib/` - Utility functions
- `public/` - Static assets
- `components.json` - shadcn/ui configuration

## Technologies Used

- Next.js 16
- TypeScript
- Tailwind CSS v4
- ESLint
- Docker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
