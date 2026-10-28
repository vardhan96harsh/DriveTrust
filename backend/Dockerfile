# Build Stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the API Gateway binary with optimizations (stripped symbols)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -X main.version=1.0.0-PROD" \
    -o /app/bin/api-gateway \
    ./services/api-gateway/cmd/server/main.go

# Production Runtime Stage
FROM alpine:3.20

WORKDIR /app

# Install runtime security & networking certificates
RUN apk add --no-cache ca-certificates tzdata

# Create non-root system user
RUN addgroup -S drivetrust && adduser -S drivetrust -G drivetrust
USER drivetrust

# Copy compiled binary from builder
COPY --from=builder --chown=drivetrust:drivetrust /app/bin/api-gateway /app/api-gateway

# Environment defaults
ENV PORT=8080 \
    GIN_MODE=release

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

ENTRYPOINT ["/app/api-gateway"]

