module.exports = [
"[project]/.next-internal/server/app/api/incidents/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        'error'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/lib/events/event-hub.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventHub",
    ()=>eventHub
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/events [external] (events, cjs)");
;
class EventHub extends __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__["EventEmitter"] {
    clients = new Set();
    constructor(){
        super();
        this.setMaxListeners(100);
    }
    subscribe(callback) {
        this.clients.add(callback);
        return ()=>{
            this.clients.delete(callback);
        };
    }
    broadcast(type, data) {
        const payload = {
            type,
            timestamp: new Date().toISOString(),
            data
        };
        this.emit(type, payload);
        // Push to all active SSE subscribers
        this.clients.forEach((client)=>{
            try {
                client(payload);
            } catch (err) {
                console.error('Error broadcasting event to SSE client:', err);
            }
        });
    }
    getSubscriberCount() {
        return this.clients.size;
    }
}
// Singleton EventHub
const globalForEvents = globalThis;
const eventHub = globalForEvents.eventHub ?? new EventHub();
if ("TURBOPACK compile-time truthy", 1) globalForEvents.eventHub = eventHub;
}),
"[project]/src/lib/services/incident-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IncidentEngine",
    ()=>IncidentEngine,
    "incidentEngine",
    ()=>incidentEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/events/event-hub.ts [app-route] (ecmascript)");
;
;
class IncidentEngine {
    async getActiveIncidents() {
        const merchantId = 'mch_apex_01';
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].incident.findMany({
            where: {
                merchantId,
                status: 'ACTIVE'
            },
            orderBy: {
                startedAt: 'desc'
            }
        });
    }
    async triggerUpiSpikeSimulation() {
        const merchantId = 'mch_apex_01';
        // Create or update active UPI anomaly incident
        const incident = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].incident.create({
            data: {
                merchantId,
                title: 'UPI Failure Spike Detected',
                paymentMethod: 'UPI',
                baselineRate: 4.0,
                currentRate: 13.8,
                status: 'ACTIVE',
                startedAt: new Date(),
                affectedValue: 184200,
                possibleExplanation: 'Sudden high traffic volume coincided with partner bank acquiring server timeout bursts.',
                likelyFactor: 'NPCI UPI switch response delay increased from 180ms to 4,200ms for specific issuing bank handles.'
            }
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
            data: {
                merchantId,
                entityType: 'INCIDENT',
                entityId: incident.id,
                action: 'ANOMALY_DETECTED',
                details: `Payment Incident Triggered: UPI Failure Spike (Baseline 4.0% -> Current 13.8%).`
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].broadcast('incident.detected', {
            id: incident.id,
            title: incident.title,
            paymentMethod: incident.paymentMethod,
            baselineRate: incident.baselineRate,
            currentRate: incident.currentRate,
            startedAt: incident.startedAt.toISOString(),
            possibleExplanation: incident.possibleExplanation,
            likelyFactor: incident.likelyFactor
        });
        return incident;
    }
    async resolveIncident(incidentId) {
        const incident = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].incident.update({
            where: {
                id: incidentId
            },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date()
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].broadcast('incident.resolved', {
            id: incidentId,
            title: incident.title
        });
        return incident;
    }
}
const incidentEngine = new IncidentEngine();
}),
"[project]/src/app/api/incidents/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$incident$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/incident-engine.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET() {
    try {
        const incidents = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$incident$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["incidentEngine"].getActiveIncidents();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            incidents
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c5b10729._.js.map