# ReadyToMog

**ReadyToMog** is a microservices-based backend application built with **NestJS** and designed around distributed services, RPC communication, event-driven architecture, and production-oriented observability.

The project includes authentication, users, chat, payments, notifications, API Gateway, shared packages, infrastructure services, and a complete observability stack.

---

## Architecture

The application follows a microservices architecture where each business domain is isolated into its own service.

The **API Gateway** is the main entry point for external clients. Internal services communicate with each other using **RPC**, while asynchronous domain events are handled through **RabbitMQ**.

```text
                         ┌─────────────────┐
                         │     Client      │
                         └────────┬────────┘
                                  │
                              HTTP / WS
                                  │
                         ┌────────▼────────┐
                         │   API Gateway   │
                         └────────┬────────┘
                                  │
                     ┌────────────┼────────────┐
                     │            │            │
                    RPC          RPC          RPC
                     │            │            │
              ┌──────▼─────┐ ┌───▼──────┐ ┌──▼────────────┐
              │ Auth       │ │ User     │ │ Chat          │
              │ Service    │ │ Service  │ │ Service       │
              └────────────┘ └──────────┘ └───────────────┘
                     │            │            │
                     │            │            │
              ┌──────▼─────┐ ┌───▼──────┐ ┌──▼────────────┐
              │ Payment    │ │Notification│ │    Redis     │
              │ Service    │ │ Service   │ │              │
              └────────────┘ └───────────┘ └───────────────┘
                     │
              ┌──────▼─────────┐
              │   PostgreSQL   │
              └────────────────┘

                     ┌──────────────────────┐
                     │      RabbitMQ        │
                     │ Async communication   │
                     └──────────────────────┘
```

---

## Services

### API Gateway

The main entry point for clients.

Responsibilities:

* HTTP API
* WebSocket connections
* Request routing
* Rate limiting
* Communication with internal microservices
* Authentication integration
* API-level validation
* Metrics and observability

---

### Auth Service

Responsible for authentication and authorization.

Responsibilities:

* User authentication
* Access and refresh tokens
* Authorization
* Password-related operations
* Authentication-related communication with other services

---

### User Service

Responsible for user-related data and operations.

Responsibilities:

* User profiles
* User management
* User-related business logic
* Persistent user data

**Database:** PostgreSQL

---

### Chat Service

Responsible for real-time communication.

Responsibilities:

* Chat functionality
* WebSocket communication
* Messages
* Chat-related business logic
* Real-time events

**Database:** PostgreSQL

**Additional infrastructure:**

* RabbitMQ
* WebSockets

---

### Payment Service

Responsible for payment-related business logic.

Responsibilities:

* Payment processing
* Payment state management
* Payment-related events
* Communication with external payment providers

**Database:** PostgreSQL

---

### Notification Service

Responsible for asynchronous notifications.

Responsibilities:

* Processing notification events
* Sending notifications
* Consuming messages from RabbitMQ
* Communication with other services through events

---

## Communication

The project uses two main communication patterns.

### RPC

Synchronous communication between microservices is implemented using RPC.

```text
API Gateway
     │
     │ RPC
     ▼
User Service
```

RPC is used when a service needs an immediate response from another service.

---

### RabbitMQ

**RabbitMQ** is used for asynchronous, event-driven communication.

```text
Payment Service
      │
      │ Event
      ▼
   RabbitMQ
      │
      ├──────────────► Notification Service
      │
      └──────────────► Other Services
```

This allows services to remain loosely coupled and process events asynchronously.

---

## Infrastructure

All infrastructure services run inside **Docker** containers.

The local environment includes:

* PostgreSQL
* MongoDB
* Redis
* RabbitMQ
* Prometheus
* Grafana
* Loki
* OpenTelemetry
* Jaeger
* Alertmanager

This makes it possible to run the complete distributed system locally without installing infrastructure dependencies directly on the host machine.

---

## Data Storage

### PostgreSQL

Used for relational and transactional data.
---

### MongoDB
---

### Redis

Used for fast in-memory operations and distributed application needs.

Potential use cases within the system include:

* caching
* temporary data
* distributed state
* rate limiting
* race condition
* real-time application support

---

## Observability

The project contains a dedicated observability stack designed to monitor a distributed microservices environment.

```text
                    ┌─────────────────┐
                    │   Microservices │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
           Metrics         Logs           Traces
              │              │              │
              ▼              ▼              ▼
         Prometheus         Loki       OpenTelemetry
              │                             │
              │                             ▼
              │                           Jaeger
              │
              └──────────────┬──────────────┘
                             ▼
                          Grafana

                       Alertmanager
                            ▲
                            │
                       Prometheus
```

### Prometheus

Collects application and infrastructure metrics.

Examples:

* HTTP metrics
* service metrics
* request duration
* request counts
* error rates
* infrastructure metrics

---

### Grafana

Used for visualization and monitoring.

Dashboards can be used to monitor:

* service health
* request rates
* latency
* errors
* resource usage
* infrastructure metrics

---

### Loki

Used for centralized log aggregation.

Instead of checking logs independently inside every Docker container, application logs can be collected and queried centrally.

---

### OpenTelemetry

Used for distributed tracing and telemetry instrumentation.

OpenTelemetry allows requests to be traced across multiple services.

Example:

```text
Client
  │
  ▼
API Gateway
  │
  ├──► Auth Service
  │
  └──► User Service
          │
          └──► PostgreSQL
```

A single request can therefore be analyzed across the entire distributed system.

---

### Jaeger

Used for visualization and investigation of distributed traces.

It helps identify:

* slow services
* slow database operations
* RPC latency
* service-to-service dependencies
* failed requests
* bottlenecks

---

### Alertmanager

Responsible for handling Prometheus alerts.

It allows the system to notify when predefined conditions occur, such as:

* high error rate
* service downtime
* high latency
* infrastructure problems
* abnormal resource usage

---

## Shared NPM Packages

The project uses separate shared packages to avoid duplicating common functionality between microservices.

### `@readytomog/core`

Contains shared core functionality used across services.

Examples:

* common application abstractions
* shared utilities
* infrastructure-related functionality
* reusable core modules

---

### `@readytomog/common`

Contains common application functionality shared between services.

Examples:

* shared helpers
* common constants
* reusable utilities
* shared types

---

### `@readytomog/contracts`

Contains contracts used for communication between microservices.

Contracts define shared interfaces for service-to-service communication and help keep communication consistent across the system.

```text
             ┌──────────────────┐
             │   API Gateway    │
             └────────┬─────────┘
                      │
                      │
             ┌────────▼─────────┐
             │    Contracts     │
             └────────┬─────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      User          Chat          Payment
     Service       Service        Service
```

The packages are published as separate NPM packages and consumed by the microservices.

---

## Technology Stack

### Backend

* **Node.js**
* **NestJS**
* **TypeScript**

### Communication

* **RPC**
* **RabbitMQ**
* **WebSockets**

### Databases

* **PostgreSQL**
* **MongoDB**
* **Redis**

### Observability

* **Prometheus**
* **Grafana**
* **Loki**
* **OpenTelemetry**
* **Jaeger**
* **Alertmanager**

### Infrastructure

* **Docker**
* **Docker Compose**

### Shared Packages

* `@readytomog/core`
* `@readytomog/common`
* `@readytomog/contracts`


## Running Locally

### Requirements

Make sure the following are installed:

* Node.js
* npm
* Docker
* Docker Compose

---

### Clone the repository

```bash
git clone <repository-url>

cd readytomog
```

---

### Install dependencies

```bash
yarn add
```

---

### Start infrastructure

Start the complete infrastructure using Docker Compose:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

---

## Docker

The application is designed to run as a set of independent containers.

A typical environment contains:

```text
┌────────────────────────────────────────────────────┐
│                    Docker                          │
│                                                    │
│  ┌────────────┐   ┌────────────┐   ┌───────────┐ │
│  │ API Gateway│   │ Auth       │   │ User      │ │
│  └────────────┘   └────────────┘   └───────────┘ │
│                                                    │
│  ┌────────────┐   ┌────────────┐   ┌───────────┐ │
│  │ Chat       │   │ Payment    │   │Notification│ │
│  └────────────┘   └────────────┘   └───────────┘ │
│                                                    │
│  ┌────────────┐   ┌────────────┐   ┌───────────┐ │
│  │ PostgreSQL │   │ MongoDB    │   │ Redis     │ │
│  └────────────┘   └────────────┘   └───────────┘ │
│                                                    │
│  ┌────────────┐   ┌────────────┐   ┌───────────┐ │
│  │ RabbitMQ   │   │ Prometheus │   │ Grafana   │ │
│  └────────────┘   └────────────┘   └───────────┘ │
│                                                    │
│  ┌────────────┐   ┌────────────┐   ┌───────────┐ │
│  │ Loki       │   │ Jaeger     │   │ Alertmanager│
│  └────────────┘   └────────────┘   └───────────┘ │
└────────────────────────────────────────────────────┘
```

---

## Key Architectural Concepts

The project demonstrates several patterns commonly used in distributed backend systems:

* Microservices architecture
* Domain-based service separation
* Synchronous RPC communication
* Event-driven architecture
* Message queues
* Asynchronous processing
* WebSocket-based real-time communication
* Relational and NoSQL databases
* Distributed caching
* Idempotent payment operations
* Race condition prevention
* Distributed locking
* Centralized logging
* Metrics collection
* Distributed tracing
* Alerting
* Containerized infrastructure
* Shared contracts between services
* Reusable NPM packages

---

## Architecture Goals

The main goals of the project are:

1. **Service isolation** — each business domain has its own service.
2. **Loose coupling** — asynchronous communication is handled through RabbitMQ events.
3. **Type-safe communication** — shared contracts are distributed through NPM packages.
4. **Scalability** — services can be scaled independently.
5. **Observability** — metrics, logs, traces, and alerts are available across the system.
6. **Containerization** — application and infrastructure dependencies run through Docker.
7. **Real-time communication** — WebSockets are used for chat functionality.

---

## What This Project Demonstrates

ReadyToMog is primarily a backend and infrastructure-oriented project demonstrating how a distributed NestJS application can be designed, developed, containerized, and monitored as a complete system.

The project combines:

**NestJS + Microservices + RPC + RabbitMQ + PostgreSQL + MongoDB + Redis + WebSockets + Docker + Prometheus + Grafana + Loki + OpenTelemetry + Jaeger + Alertmanager**

into a single distributed application.
