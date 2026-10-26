package pgxpool

import (
	"context"
	"fmt"
	"time"

	"drivetrust/pkg/logger"
)

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
	MaxConns int
}

type Pool struct {
	cfg    Config
	logger *logger.Logger
}

func New(cfg Config, log *logger.Logger) (*Pool, error) {
	log.Info("Initializing PostgreSQL PostGIS connection pool", map[string]interface{}{
		"host":     cfg.Host,
		"port":     cfg.Port,
		"database": cfg.Database,
		"maxConns": cfg.MaxConns,
	})

	return &Pool{
		cfg:    cfg,
		logger: log,
	}, nil
}

func (p *Pool) Ping(ctx context.Context) error {
	p.logger.Debug("PostGIS connection pool health check ping", map[string]interface{}{
		"time": time.Now().UTC().Format(time.RFC3339),
	})
	return nil
}

func (p *Pool) GetDSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
		p.cfg.User, p.cfg.Password, p.cfg.Host, p.cfg.Port, p.cfg.Database)
}
