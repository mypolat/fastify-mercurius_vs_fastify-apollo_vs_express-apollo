# 🚀 GraphQL Server Performance Showdown

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)

## Overview

This project provides a comprehensive performance comparison between three widely-used Node.js GraphQL server implementations:

- ⚡ Fastify + Mercurius
- 🚅 Fastify + Apollo
- 🚂 Express + Apollo

## 🏃‍ Quick Start

```bash
# Clone the repository
git clone https://github.com/mypolat/fastify-mercurius_vs_fastify-apollo_vs_express-apollo
cd fastify-mercurius_vs_fastify-apollo_vs_express-apollo

# Install dependencies
npm install

# Build the project
npm run build

# Start all servers
npm run start:all

# Run benchmark tests
npm run test:all
```

## 📊 Performance Comparison

### Response Time Analysis

| Framework           | Best     | Average   | Worst    | Recommended Use Case |
|--------------------|----------|-----------|----------|---------------------|
| Fastify + Mercurius| ~0.6ms   | ~0.7ms    | ~1ms     | High-performance APIs requiring minimal latency |
| Fastify + Apollo   | ~4.8ms   | ~5.1ms    | ~14ms    | Balance between features and performance |
| Express + Apollo   | ~5.3ms   | ~15-40ms  | ~42ms    | Existing Express.js applications |

## 🎯 Key Findings

### Fastify + Mercurius
- ✨ Best overall performance
- ⚡ Most consistent response times
- 🔥 Minimal performance degradation under load
- 👍 Recommended for high-performance GraphQL APIs
- ⚠️ Limited ecosystem compared to Apollo

### Fastify + Apollo
- ✅ Good balance of performance and features
- ⚡ ~7x slower than Mercurius
- 🔥 ~3x faster than Express+Apollo
- 👍 Rich Apollo ecosystem available
- 📈 Excellent monitoring capabilities

### Express + Apollo
- ✅ Most widely adopted combination
- ⚠️ Higher response times
- ⚠️ Significant performance variance
- 🔄 Mature ecosystem
- 📚 Extensive documentation and community support

---

<div align="center">

⭐ If you found this benchmark helpful, please consider giving it a star!

</div>
