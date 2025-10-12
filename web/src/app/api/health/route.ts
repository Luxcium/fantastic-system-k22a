/**
 * Health Check Endpoint
 * Provides system health status for monitoring
 */

import { checkDatabaseHealth, getDatabaseInfo } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      info?: any;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    environment: {
      nodeEnv: string;
      nodeVersion: string;
    };
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check database health
    const dbStartTime = Date.now();
    const isDatabaseHealthy = await checkDatabaseHealth();
    const dbResponseTime = Date.now() - dbStartTime;

    let dbInfo = null;
    if (isDatabaseHealthy) {
      dbInfo = await getDatabaseInfo();
    }

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;

    // Construct health status
    const healthStatus: HealthStatus = {
      status: isDatabaseHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: {
          status: isDatabaseHealthy ? 'up' : 'down',
          responseTime: dbResponseTime,
          info: dbInfo
        },
        memory: {
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: Math.round((usedMemory / totalMemory) * 100)
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          nodeVersion: process.version
        }
      }
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${Date.now() - startTime}ms`
      }
    });
  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        uptime: process.uptime()
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': `${Date.now() - startTime}ms`
        }
      }
    );
  }
}
