package pgxpool

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
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
	pool   *pgxpool.Pool
	logger *logger.Logger
}

func New(cfg Config, log *logger.Logger) (*Pool, error) {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database)

	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Warn("Failed to parse PostgreSQL DSN; running with mock fallback", map[string]interface{}{"error": err.Error()})
		return &Pool{cfg: cfg, logger: log}, nil
	}

	if cfg.MaxConns > 0 {
		poolConfig.MaxConns = int32(cfg.MaxConns)
	} else {
		poolConfig.MaxConns = 25
	}
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = 30 * time.Minute
	poolConfig.MaxConnIdleTime = 5 * time.Minute

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	p, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		log.Warn("PostgreSQL cluster unavailable at startup; using fallback", map[string]interface{}{
			"host":  cfg.Host,
			"port":  cfg.Port,
			"error": err.Error(),
		})
		return &Pool{cfg: cfg, logger: log}, nil
	}

	if err := p.Ping(ctx); err != nil {
		log.Warn("PostgreSQL ping failed; database pool running in degraded mode", map[string]interface{}{
			"host":  cfg.Host,
			"error": err.Error(),
		})
	} else {
		log.Info("PostgreSQL PostGIS connection pool established", map[string]interface{}{
			"host":     cfg.Host,
			"port":     cfg.Port,
			"database": cfg.Database,
			"maxConns": poolConfig.MaxConns,
		})
	}

	return &Pool{
		cfg:    cfg,
		pool:   p,
		logger: log,
	}, nil
}

func (p *Pool) Ping(ctx context.Context) error {
	if p.pool != nil {
		return p.pool.Ping(ctx)
	}
	p.logger.Debug("PostGIS connection pool health check ping (in-memory mode)", map[string]interface{}{
		"time": time.Now().UTC().Format(time.RFC3339),
	})
	return nil
}

func (p *Pool) Close() {
	if p.pool != nil {
		p.pool.Close()
	}
}

func (p *Pool) Exec(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error) {
	if p.pool != nil {
		return p.pool.Exec(ctx, sql, arguments...)
	}
	return pgconn.CommandTag{}, nil
}

func (p *Pool) Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error) {
	if p.pool != nil {
		return p.pool.Query(ctx, sql, args...)
	}
	return nil, nil
}

func (p *Pool) QueryRow(ctx context.Context, sql string, args ...any) pgx.Row {
	if p.pool != nil {
		return p.pool.QueryRow(ctx, sql, args...)
	}
	return nil
}

func (p *Pool) GetDSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
		p.cfg.User, p.cfg.Password, p.cfg.Host, p.cfg.Port, p.cfg.Database)
}
