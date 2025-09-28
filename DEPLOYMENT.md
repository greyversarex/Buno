# Deployment Guide for Tajik Trails API

## Deployment Issues Fixed

### Issue 1: Invalid Run Command
**Problem**: The run command was showing a configuration message instead of starting the application.
**Solution**: 
- Updated server.ts to handle both development and production environments properly
- Created proper startup scripts (start.sh) for deployment
- Server now uses PORT environment variable correctly

### Issue 2: Port Configuration
**Problem**: Application was trying to start on port 3001 but Autoscale Deployments expect external port 80 mapping.
**Solution**:
- Updated server configuration to use port 8080 in production (standard for Cloud Run)
- Maintains port 3001 for development to work with existing workflows
- Added proper environment-based port selection

### Issue 3: Health Check Failures
**Problem**: Health checks were failing because no HTTP server was listening on the expected port.
**Solution**:
- Server now properly listens on 0.0.0.0 for all environments
- Health check endpoint available at `/api/health`
- Added comprehensive CORS configuration for deployment URLs

## Deployment Configuration

### For Replit Autoscale Deployments

The application is now configured with:

1. **Proper Run Command**: `npx ts-node src/server.ts`
2. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=8080` (automatically set by Cloud Run)
3. **Health Check**: Available at `/api/health`
4. **CORS**: Configured to accept requests from deployment URLs

### Files Created/Updated

1. **Dockerfile**: Container configuration for Cloud Run deployment
2. **start.sh**: Startup script with Prisma setup and environment configuration
3. **deployment.toml**: Replit-specific deployment configuration
4. **src/server.ts**: Updated with production-ready port and environment handling
5. **src/app.ts**: Enhanced CORS configuration for deployment URLs

### Testing Deployment

Before deploying, verify:

1. **Health Check**: `curl http://localhost:3001/api/health` returns success
2. **API Endpoints**: All endpoints respond correctly
3. **Database**: Prisma client connects successfully
4. **Environment**: Server handles both development and production environments

### Post-Deployment Steps

1. Set up environment variables in Replit deployment settings
2. Configure custom domain if needed
3. Monitor health checks and logs
4. Test all API endpoints in production environment

## Environment Variables for Production

Required environment variables for deployment:
- `NODE_ENV=production`
- `PORT=8080` (set automatically by Cloud Run)
- `DATABASE_URL` (if using external database)
- `FRONTEND_URL` (for CORS configuration)

Optional:
- `REPLIT_DEV_DOMAIN` (automatically set by Replit)

## Manual Deployment Steps

If using the start.sh script manually:

```bash
chmod +x start.sh
./start.sh
```

This will:
1. Set production environment
2. Generate Prisma client
3. Run database migrations
4. Start the server on the correct port