ChatBot Agent (Work in Progress)

A work-in-progress backend agent built with TypeScript and Bun.
This repository serves as an experimental and evolving foundation for an intelligent agent that may later be integrated into a larger academic or production system.

Overview

This project is currently under active development and design exploration.
Its exact responsibilities and final architecture are still being defined in collaboration with an academic supervisor.

At this stage, the focus is on:
• Establishing a clean and flexible project structure
• Experimenting with agent-oriented backend design
• Using modern tooling (Bun + TypeScript)
• Keeping the codebase easy to extend and refactor

Status

This repository should be considered experimental.

Functionality, structure, and responsibilities may change as the project evolves and as system requirements become clearer.

Tech Stack
• TypeScript
• Bun runtime
• Node-style backend structure
• ESLint, Prettier, Husky for code quality

Project Structure

.
├── .husky/ # Git hooks
├── packages/ # Local workspace packages (optional / future use)
├── index.ts # Application entry point
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
├── bun.lock # Bun lockfile
├── .prettierrc # Formatting rules
├── .lintstagedrc # Linting configuration
└── README.md

Prerequisites
• Bun installed locally
Installation instructions: https://bun.sh/

Installation

git clone https://github.com/arelraba11/ChatBot-project.git
cd ChatBot-project
bun install

Running the Project

bun run index.ts

The current entry point is index.ts.
As the design stabilizes, the codebase may be refactored into dedicated modules or services.

Design Notes

This project is intentionally kept lightweight and flexible.
It is expected to evolve into one of the following roles (not finalized):
• Intelligent agent component
• Backend service within a larger system
• Supporting service for an academic final project

No final design decisions have been locked yet.

Future Direction (Tentative)

Possible future directions include:
• Integration with LLM or AI services
• Agent-to-agent communication
• API-based interaction with other system components
• Integration into a larger data or AI-driven platform

Purpose

The primary goal of this repository is exploration and iteration.
It acts as a sandbox for architectural decisions before committing to a finalized system design.

License

Open for learning, experimentation, and academic use.
