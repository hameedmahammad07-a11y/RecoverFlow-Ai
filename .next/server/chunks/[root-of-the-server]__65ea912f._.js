module.exports = [
"[project]/.next-internal/server/app/api/events/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/events/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/events/event-hub.ts [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic';
async function GET(req) {
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
        start (controller) {
            // Send initial connection ping
            const initialMessage = `event: connected\ndata: ${JSON.stringify({
                status: 'connected',
                timestamp: new Date().toISOString()
            })}\n\n`;
            controller.enqueue(encoder.encode(initialMessage));
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].subscribe((payload)=>{
                try {
                    const sseData = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
                    controller.enqueue(encoder.encode(sseData));
                } catch (err) {
                    console.error('Error writing to SSE stream:', err);
                }
            });
            // Send periodic heartbeat ping every 15 seconds to keep connection alive
            const interval = setInterval(()=>{
                try {
                    controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify({
                        timestamp: new Date().toISOString()
                    })}\n\n`));
                } catch (e) {
                    clearInterval(interval);
                }
            }, 15000);
            req.signal.addEventListener('abort', ()=>{
                unsubscribe();
                clearInterval(interval);
                controller.close();
            });
        }
    });
    return new Response(customReadable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__65ea912f._.js.map