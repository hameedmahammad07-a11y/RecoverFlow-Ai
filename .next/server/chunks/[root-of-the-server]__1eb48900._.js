module.exports = [
"[project]/.next-internal/server/app/api/predictions/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/services/prediction-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PredictionEngine",
    ()=>PredictionEngine,
    "predictionEngine",
    ()=>predictionEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
class PredictionEngine {
    async getLatestForecast() {
        const merchantId = 'mch_apex_01';
        const latest = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].paymentPrediction.findFirst({
            where: {
                merchantId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (!latest) {
            return this.generate24HourForecast();
        }
        return {
            ...latest,
            contributingFactors: JSON.parse(latest.contributingFactors || '[]'),
            recommendations: JSON.parse(latest.recommendations || '[]')
        };
    }
    async generate24HourForecast() {
        const merchantId = 'mch_apex_01';
        // Fetch historical payments from last 24h
        const payments = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findMany({
            where: {
                merchantId
            },
            take: 100
        });
        const failedCount = payments.filter((p)=>p.status === 'FAILED').length;
        const totalCount = payments.length || 1;
        const currentFailureRate = failedCount / totalCount * 100;
        const riskScore = Math.min(85, Math.max(12, currentFailureRate * 2.5 + 10));
        const riskLevel = riskScore > 60 ? 'HIGH' : riskScore > 35 ? 'MEDIUM' : 'LOW';
        const confidence = 82.5;
        const factors = [
            `Current 24-hour payment failure rate is at ${currentFailureRate.toFixed(1)}%`,
            'Peak transaction volume projected between 7:30 PM and 9:30 PM IST',
            'UPI bank handle switch latencies within normal standard range'
        ];
        const recommendations = [
            'Keep automated multi-channel recovery workflows enabled',
            'Ensure quiet hours policy aligns with target customer demographic',
            'Monitor UPI bank response code trends during peak evening window'
        ];
        const forecast = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].paymentPrediction.create({
            data: {
                merchantId,
                targetDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                period: 'NEXT_24_HOURS',
                overallRiskScore: parseFloat(riskScore.toFixed(1)),
                riskLevel,
                confidence,
                vulnerableMethod: 'UPI',
                expectedPeak: '7:30 PM - 9:30 PM',
                trafficMultiplier: 1.2,
                contributingFactors: JSON.stringify(factors),
                recommendations: JSON.stringify(recommendations)
            }
        });
        return {
            ...forecast,
            contributingFactors: factors,
            recommendations
        };
    }
    async generateEventForecast(input) {
        const merchantId = 'mch_apex_01';
        const mult = input.expectedTrafficMultiplier || 2.5;
        // Calculate risk based on traffic multiplier
        let riskScore = 45 + mult * 8.5;
        if (riskScore > 92) riskScore = 92;
        const riskLevel = riskScore > 65 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';
        const confidence = Math.min(88, Math.max(72, 85 - mult * 2));
        const factors = [
            `Expected ${mult}x traffic surge during upcoming ${input.eventName}`,
            'Historical high-volume events exhibit +14.2% bank switch timeout spikes under high concurrency',
            'UPI payment handle contention probability increases significantly above 250 TPS',
            'Card OTP SMS delivery latency projected to increase by 800ms during peak sales'
        ];
        const recommendations = [
            'Enable enhanced real-time failure monitoring and instant alerting before launch',
            'Verify payment gateway webhook health and server socket connection limits',
            'Configure early failure recovery escalation (WhatsApp + SMS fallback)',
            'Prompt high-ticket cart customers with secondary payment options (NetBanking/Cards)'
        ];
        const eventForecast = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].paymentPrediction.create({
            data: {
                merchantId,
                targetDate: input.targetDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                period: input.eventName.toUpperCase().replace(/\s+/g, '_'),
                overallRiskScore: parseFloat(riskScore.toFixed(1)),
                riskLevel,
                confidence: parseFloat(confidence.toFixed(1)),
                vulnerableMethod: input.vulnerableMethod || 'UPI',
                expectedPeak: '7:00 PM - 10:30 PM',
                trafficMultiplier: mult,
                contributingFactors: JSON.stringify(factors),
                recommendations: JSON.stringify(recommendations)
            }
        });
        return {
            ...eventForecast,
            contributingFactors: factors,
            recommendations
        };
    }
}
const predictionEngine = new PredictionEngine();
}),
"[project]/src/app/api/predictions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$prediction$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/prediction-engine.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET() {
    try {
        const forecast = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$prediction$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["predictionEngine"].getLatestForecast();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            forecast
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1eb48900._.js.map