// backend/src/routes/metrics.js
const express = require('express');
const router = express.Router();

// Simple metrics storage
const metrics = {
  requests: 0,
  errors: 0,
  uptime: Date.now(),
  lastRequest: null
};

// Middleware to track requests
router.use((req, res, next) => {
  metrics.requests++;
  metrics.lastRequest = new Date().toISOString();
  next();
});

// Prometheus metrics endpoint
router.get('/metrics', (req, res) => {
  const uptime = Math.floor((Date.now() - metrics.uptime) / 1000);
  
  const prometheusMetrics = `
# HELP app_requests_total Total number of requests
# TYPE app_requests_total counter
app_requests_total ${metrics.requests}

# HELP app_errors_total Total number of errors
# TYPE app_errors_total counter
app_errors_total ${metrics.errors}

# HELP app_uptime_seconds Application uptime in seconds
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${uptime}

# HELP app_health Application health status (1 = healthy, 0 = unhealthy)
# TYPE app_health gauge
app_health 1
`.trim();

  res.set('Content-Type', 'text/plain');
  res.send(prometheusMetrics);
});

module.exports = router;