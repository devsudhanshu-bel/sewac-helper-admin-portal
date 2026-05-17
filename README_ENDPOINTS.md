# SEWAC Helper Admin Portal - API Endpoints Documentation

## Overview
This document provides comprehensive documentation for all API endpoints in the SEWAC Helper Admin Portal backend. The API includes authentication, dashboard analytics, RFID tag management, and logging functionality.

---

## Authentication

### Login Endpoint
Authenticate admin users to access the admin portal.

**Endpoint:**
- **Development:** `http://localhost:5000/api/admin/login`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/admin/login`

**Method:** `POST`

**Request Body:**
```json
{
  "username": "sewac",
  "password": "admin@sewac2026"
}
```

**Response:** JWT token for authenticated sessions

---

## Dashboard Endpoints

The dashboard provides key metrics through multiple card endpoints.

### Card 1: Total RFID Tags
Displays the total count of all RFID tags in the system.

**Endpoint:**
- **Development:** `http://localhost:5000/api/dashboard/total-rfid-tags`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/dashboard/total-rfid-tags`

**Method:** `GET`

---

### Card 2: Total Distributed Tags
Displays the count of RFID tags that have been distributed to citizens (assigned to a phone number).

**Endpoint:**
- **Development:** `http://localhost:5000/api/dashboard/distributed-tags`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/dashboard/distributed-tags`

**Method:** `GET`

**Logic:**
- A tag is considered **Distributed** when it has a `phoneNumber` assigned in the RFIDMapping table

---

### Card 3: Tags Distributed by Workers
Displays the total number of RFID tags distributed by workers.

**Endpoint:**
- **Development:** `http://localhost:5000/api/dashboard/worker-distribution`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/dashboard/worker-distribution`

**Method:** `GET`

**Logic:**
- Each citizen receives **2 RFID tags**: 1 Wet, 1 Dry
- Formula: `Distributed Tags = COUNT(workerId rows) × 2`

---

## RFID Tags Endpoints

### Get All RFID Tags
Displays all RFID tags in the system, initially set to unmapped status.

**Endpoint:**
- **Development:** `http://localhost:5000/api/rfid/all`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/rfid/all`

**Method:** `GET`

**Response:** List of all RFID tags with their current status

---

## Logs Endpoints

### Get All Logs
Displays logs with mapping status information.

**Endpoint:**
- **Development:** `http://localhost:5000/api/logs/all`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/logs/all`

**Method:** `GET`

**Mapping Status Logic:**
| Condition | Status |
|-----------|--------|
| `phoneNumber = NULL` OR `wasteType = NULL` | **UNMAPPED** |
| `phoneNumber EXISTS` AND `wasteType EXISTS` | **MAPPED** |

---

### Get Logs Summary
Provides aggregated statistics from the RFIDMapping table.

**Endpoint:**
- **Development:** `http://localhost:5000/api/logs/summary`
- **Production:** `https://sewac-helper-admin-portal.onrender.com/api/logs/summary`

**Method:** `GET`

**Response Format:**
```json
{
  "totalLogs": 0,
  "todaysLogs": 0,
  "activeWorkers": 0,
  "latestLog": "timestamp"
}
```

**Calculations:**
| Card | Logic |
|------|-------|
| **Total Logs** | `COUNT(*)` of all records |
| **Today's Logs** | Records where `createdAt = today` |
| **Active Workers** | `DISTINCT workerId` count |
| **Latest Log** | Record with latest `createdAt` timestamp |

---

## Environment Configuration

### Development
- **Base URL:** `http://localhost:5000`
- **Port:** 5000

### Production
- **Base URL:** `https://sewac-helper-admin-portal.onrender.com`
- **Deployment:** Render.com

---

## Database Tables

### RFIDMapping
Contains RFID tag assignments and distribution tracking.

**Key Columns:**
- `id` - Unique identifier
- `rfid` - RFID tag value
- `phoneNumber` - Assigned citizen phone number (NULL = unmapped)
- `wasteType` - Type of waste (Wet/Dry) (NULL = unmapped)
- `workerId` - Worker ID who distributed the tag
- `createdAt` - Record creation timestamp

---

## Common Response Codes

- **200 OK** - Request successful
- **400 Bad Request** - Invalid request format
- **401 Unauthorized** - Authentication required or failed
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side error

---

## Notes

- All timestamps are stored in the `createdAt` field
- RFID tags are considered "distributed" when assigned to a phone number
- Workers distribute 2 tags per citizen (1 Wet, 1 Dry)
- Unmapped tags have either NULL `phoneNumber` or NULL `wasteType`
