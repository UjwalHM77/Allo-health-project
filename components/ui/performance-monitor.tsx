'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { performanceMonitor } from '@/lib/performance';

interface PerformanceMetrics {
  [key: string]: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const currentMetrics = performanceMonitor.getMetrics();
        setMetrics(currentMetrics);
        
        // Check for performance issues
        checkPerformanceIssues(currentMetrics);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const checkPerformanceIssues = (currentMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];
    
    Object.entries(currentMetrics).forEach(([key, value]) => {
      if (value > 1000) { // Alert if operation takes more than 1 second
        newAlerts.push({
          id: `${key}-${Date.now()}`,
          type: 'warning',
          message: `${key} is taking ${value.toFixed(2)}ms`,
          timestamp: new Date(),
        });
      }
      
      if (value > 5000) { // Error if operation takes more than 5 seconds
        newAlerts.push({
          id: `${key}-${Date.now()}`,
          type: 'error',
          message: `${key} is taking too long: ${value.toFixed(2)}ms`,
          timestamp: new Date(),
        });
      }
    });
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
    }
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    performanceMonitor.clearMetrics();
    setAlerts([]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const clearMetrics = () => {
    performanceMonitor.clearMetrics();
    setMetrics({});
    setAlerts([]);
  };

  const getAveragePerformance = () => {
    const values = Object.values(metrics);
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const getPerformanceScore = () => {
    const avg = getAveragePerformance();
    if (avg < 100) return { score: 'Excellent', color: 'bg-green-500' };
    if (avg < 500) return { score: 'Good', color: 'bg-blue-500' };
    if (avg < 1000) return { score: 'Fair', color: 'bg-yellow-500' };
    return { score: 'Poor', color: 'bg-red-500' };
  };

  const performanceScore = getPerformanceScore();

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="w-4 h-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-2xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance Monitor
              </CardTitle>
              <CardDescription>
                Real-time performance tracking
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Performance Score */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Performance Score:</span>
            <Badge className={performanceScore.color}>
              {performanceScore.score}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isMonitoring ? (
              <Button onClick={startMonitoring} size="sm" className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Start Monitoring
              </Button>
            ) : (
              <Button onClick={stopMonitoring} size="sm" variant="destructive" className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Stop Monitoring
              </Button>
            )}
            <Button onClick={clearMetrics} size="sm" variant="outline">
              Clear
            </Button>
          </div>

          {/* Metrics */}
          {Object.keys(metrics).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Metrics:</h4>
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="truncate">{key}:</span>
                  <span className={`font-mono ${
                    value > 1000 ? 'text-red-600' : 
                    value > 500 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {value.toFixed(2)}ms
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Performance Alerts:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`text-xs p-2 rounded ${
                      alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                      alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {alert.type === 'error' ? <AlertCircle className="w-3 h-3" /> :
                       alert.type === 'warning' ? <TrendingUp className="w-3 h-3" /> :
                       <Activity className="w-3 h-3" />}
                      <span className="truncate">{alert.message}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {Object.keys(metrics).length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Average:</span>
                <span className="font-mono">{getAveragePerformance().toFixed(2)}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Operations:</span>
                <span>{Object.keys(metrics).length}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PerformanceMonitor;
