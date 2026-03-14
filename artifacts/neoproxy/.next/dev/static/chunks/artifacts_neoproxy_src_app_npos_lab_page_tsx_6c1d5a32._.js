(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GenerativeLab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/babylonjs@8.55.1/node_modules/babylonjs/babylon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$neoproxy$2f$src$2f$components$2f$npos$2f$AestheticProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/neoproxy/src/components/npos/AestheticProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// PRNG Mulberry32
function mulberry32(a) {
    return function() {
        let t = a += 0x6d2b79f5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
const attractors = {
    lorenz: {
        name: 'Lorenz',
        equations: 'dx/dt = σ(y−x)\ndy/dt = x(ρ−z)−y\ndz/dt = xy−βz',
        params: {
            sigma: 10,
            rho: 28,
            beta: 8 / 3,
            dt: 0.005
        },
        init: ()=>({
                x: 0.1,
                y: 0,
                z: 0
            }),
        step: (p, _, s)=>{
            const dx = p.sigma * (s.y - s.x);
            const dy = s.x * (p.rho - s.z) - s.y;
            const dz = s.x * s.y - p.beta * s.z;
            return {
                x: s.x + dx * p.dt,
                y: s.y + dy * p.dt,
                z: s.z + dz * p.dt
            };
        },
        scale: 0.1
    },
    thomas: {
        name: 'Thomas',
        equations: 'dx/dt = sin(y)−bx\ndy/dt = sin(z)−by\ndz/dt = sin(x)−bz',
        params: {
            b: 0.208,
            dt: 0.05
        },
        init: ()=>({
                x: 0.1,
                y: 0,
                z: 0
            }),
        step: (p, _, s)=>({
                x: s.x + (Math.sin(s.y) - p.b * s.x) * p.dt,
                y: s.y + (Math.sin(s.z) - p.b * s.y) * p.dt,
                z: s.z + (Math.sin(s.x) - p.b * s.z) * p.dt
            }),
        scale: 2.0
    },
    aizawa: {
        name: 'Aizawa',
        equations: 'dx/dt = (z-b)x - dy\ndy/dt = dx + (z-b)y\ndz/dt = c + az - z³/3...',
        params: {
            a: 0.95,
            b: 0.7,
            c: 0.6,
            d: 3.5,
            e: 0.25,
            f: 0.1,
            dt: 0.01
        },
        init: ()=>({
                x: 0.1,
                y: 0,
                z: 0
            }),
        step: (p, _, s)=>({
                x: s.x + ((s.z - p.b) * s.x - p.d * s.y) * p.dt,
                y: s.y + (p.d * s.x + (s.z - p.b) * s.y) * p.dt,
                z: s.z + (p.c + p.a * s.z - s.z ** 3 / 3 - (s.x ** 2 + s.y ** 2) * (1 + p.e * s.z) + p.f * s.z * s.x ** 3) * p.dt
            }),
        scale: 4.0
    },
    dejong: {
        name: 'De Jong',
        equations: 'x = sin(ay) - cos(bx)\ny = sin(cx) - cos(dy)',
        params: {
            a: 1.4,
            b: -2.3,
            c: 2.4,
            d: -2.1,
            dt: 0.1
        },
        init: ()=>({
                x: 0.1,
                y: 0,
                z: 0
            }),
        step: (p, _, s)=>{
            const nx = Math.sin(p.a * s.y) - Math.cos(p.b * s.x);
            const ny = Math.sin(p.c * s.x) - Math.cos(p.d * s.y);
            return {
                x: nx,
                y: ny,
                z: s.z + Math.sin(nx * ny) * 0.1
            };
        },
        scale: 5.0
    },
    chen: {
        name: 'Chen',
        equations: 'dx/dt = a(y-x)\ndy/dt = (c-a)x - xz + cy\ndz/dt = xy - bz',
        params: {
            a: 35,
            b: 3,
            c: 28,
            dt: 0.002
        },
        init: ()=>({
                x: 5,
                y: 10,
                z: 10
            }),
        step: (p, _, s)=>({
                x: s.x + p.a * (s.y - s.x) * p.dt,
                y: s.y + ((p.c - p.a) * s.x - s.x * s.z + p.c * s.y) * p.dt,
                z: s.z + (s.x * s.y - p.b * s.z) * p.dt
            }),
        scale: 0.15
    },
    halvorsen: {
        name: 'Halvorsen',
        equations: 'dx/dt = -ax - 4y - 4z - y²\ndy/dt = -ay - 4z - 4x - z²...',
        params: {
            a: 1.89,
            dt: 0.005
        },
        init: ()=>({
                x: -1,
                y: 0,
                z: 0
            }),
        step: (p, _, s)=>({
                x: s.x + (-p.a * s.x - 4 * s.y - 4 * s.z - s.y * s.y) * p.dt,
                y: s.y + (-p.a * s.y - 4 * s.z - 4 * s.x - s.z * s.z) * p.dt,
                z: s.z + (-p.a * s.z - 4 * s.x - 4 * s.y - s.x * s.x) * p.dt
            }),
        scale: 0.4
    },
    l_system: {
        name: 'L-System Plant',
        equations: 'F -> FF\nX -> F[+X][-X]FX',
        params: {
            angle: 25,
            dt: 1
        },
        init: ()=>({
                x: 0,
                y: 0,
                z: 0,
                angle: 0
            }),
        step: (p, rand, s)=>{
            // Pseudo-atractor para simular L-System en un atractor visual
            const r = rand();
            return {
                x: s.x + Math.sin(s.angle) * 0.2,
                y: s.y + Math.cos(s.angle) * 0.2,
                z: s.z + (r - 0.5) * 0.1,
                angle: s.angle + (r > 0.5 ? p.angle : -p.angle) * 0.01
            };
        },
        scale: 5.0
    },
    clifford: {
        name: 'Clifford',
        equations: 'x = sin(ay) + c cos(ax)\ny = sin(bx) + d cos(by)',
        params: {
            a: 1.5,
            b: -1.8,
            c: 1.6,
            d: 2.0,
            dt: 0.1
        },
        init: ()=>({
                x: 0.1,
                y: 0.1,
                z: 0
            }),
        step: (p, _, s)=>{
            const nx = Math.sin(p.a * s.y) + p.c * Math.cos(p.a * s.x);
            const ny = Math.sin(p.b * s.x) + p.d * Math.cos(p.b * s.y);
            return {
                x: nx,
                y: ny,
                z: s.z + Math.cos(nx + ny) * 0.05
            };
        },
        scale: 4.0
    },
    rossler: {
        name: 'Rössler',
        equations: 'dx/dt = −y−z\ndy/dt = x+ay\ndz/dt = b+z(x−c)',
        params: {
            a: 0.2,
            b: 0.2,
            c: 5.7,
            dt: 0.01
        },
        init: ()=>({
                x: 0.1,
                y: 0,
                z: 0
            }),
        step: (p, _, s)=>({
                x: s.x + (-s.y - s.z) * p.dt,
                y: s.y + (s.x + p.a * s.y) * p.dt,
                z: s.z + (p.b + s.z * (s.x - p.c)) * p.dt
            }),
        scale: 0.5
    },
    torus_knot: {
        name: 'Torus Knot',
        equations: 'r = cos(q*phi) + 2\nx = r * cos(p*phi)\ny = r * sin(p*phi)\nz = -sin(q*phi)',
        params: {
            p: 3,
            q: 7,
            dt: 0.01,
            phi: 0
        },
        init: ()=>({
                x: 0,
                y: 0,
                z: 0,
                phi: 0
            }),
        step: (p, _, s)=>{
            const phi = s.phi + p.dt;
            const r = Math.cos(p.q * phi) + 2;
            return {
                x: r * Math.cos(p.p * phi),
                y: r * Math.sin(p.p * phi),
                z: -Math.sin(p.q * phi),
                phi: phi
            };
        },
        scale: 2.5
    }
};
function GenerativeLab() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [selectedAlgo, setSelectedAlgo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('lorenz');
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [windowWidth, setWindowWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1024);
    const [isPanelOpen, setIsPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { tokens } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$neoproxy$2f$src$2f$components$2f$npos$2f$AestheticProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAesthetics"])();
    // Handle window resize safely
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GenerativeLab.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                setIsClient(true);
                setWindowWidth(window.innerWidth);
                const handleResize = {
                    "GenerativeLab.useEffect.handleResize": ()=>{
                        setWindowWidth(window.innerWidth);
                    }
                }["GenerativeLab.useEffect.handleResize"];
                window.addEventListener('resize', handleResize);
                return ({
                    "GenerativeLab.useEffect": ()=>window.removeEventListener('resize', handleResize)
                })["GenerativeLab.useEffect"];
            }
        }
    }["GenerativeLab.useEffect"], []);
    const isMobile = windowWidth <= 768;
    const sceneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const engineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GenerativeLab.useEffect": ()=>{
            if (!isClient || !canvasRef.current) return;
            const engine = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Engine"](canvasRef.current, true);
            engineRef.current = engine;
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"](engine);
            sceneRef.current = scene;
            // Initial theme setup from tokens if available
            const bgColor = tokens ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(tokens.palette.background) : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"](0.02, 0.03, 0.045);
            scene.clearColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color4"](bgColor.r, bgColor.g, bgColor.b, 1);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArcRotateCamera"]('cam', Math.PI / 4, Math.PI / 3, 20, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"].Zero(), scene);
            camera.attachControl(canvasRef.current, true);
            camera.wheelPrecision = 50;
            const hemi = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HemisphericLight"]('h', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0), scene);
            hemi.intensity = tokens ? tokens.lighting.intensity * 0.5 : 0.4;
            const gl = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlowLayer"]('glow', scene);
            gl.intensity = tokens ? tokens.lighting.intensity * 0.8 : 0.6;
            engine.runRenderLoop({
                "GenerativeLab.useEffect": ()=>scene.render()
            }["GenerativeLab.useEffect"]);
            const resize = {
                "GenerativeLab.useEffect.resize": ()=>engine.resize()
            }["GenerativeLab.useEffect.resize"];
            window.addEventListener('resize', resize);
            return ({
                "GenerativeLab.useEffect": ()=>{
                    engine.dispose();
                    window.removeEventListener('resize', resize);
                }
            })["GenerativeLab.useEffect"];
        }
    }["GenerativeLab.useEffect"], [
        isClient
    ]);
    // Reaction to aesthetic changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GenerativeLab.useEffect": ()=>{
            const scene = sceneRef.current;
            if (!scene || !tokens) return;
            const bgColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(tokens.palette.background);
            scene.clearColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color4"](bgColor.r, bgColor.g, bgColor.b, 1);
            const hemi = scene.getLightByName('h');
            if (hemi) hemi.intensity = tokens.lighting.intensity * 0.5;
            const gl = scene.getGlowLayerByName('glow');
            if (gl) gl.intensity = tokens.lighting.intensity * 0.8;
            // Update existing specimen material if it exists
            const mesh = scene.getMeshByName('Specimen_Core');
            if (mesh && mesh.material) {
                const mat = mesh.material;
                mat.emissiveColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(tokens.palette.primary).scale(0.2);
                mat.specularColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(tokens.palette.primary);
                mat.diffuseColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(tokens.palette.secondary).scale(0.1);
            }
        }
    }["GenerativeLab.useEffect"], [
        tokens
    ]);
    // Reaction to algorithm change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GenerativeLab.useEffect": ()=>{
            const scene = sceneRef.current;
            if (!scene) return;
            setIsLoading(true);
            // Give time for the UI to show the loading state
            const timer = setTimeout({
                "GenerativeLab.useEffect.timer": ()=>{
                    // Clean previous specimen
                    const oldSpecimen = scene.getMeshByName('Specimen_Core');
                    if (oldSpecimen) oldSpecimen.dispose();
                    const algo = attractors[selectedAlgo];
                    const rand = mulberry32(42);
                    let state = algo.init(rand);
                    const p = algo.params;
                    // Warm up
                    for(let i = 0; i < 500; i++){
                        state = algo.step(p, rand, state);
                    }
                    const raw = [];
                    for(let i = 0; i < 50000; i++){
                        state = algo.step(p, rand, state);
                        if (i % 3 === 0) raw.push({
                            x: state.x,
                            y: state.y,
                            z: state.z
                        });
                    }
                    let cx = 0, cy = 0, cz = 0;
                    raw.forEach({
                        "GenerativeLab.useEffect.timer": (pt)=>{
                            cx += pt.x;
                            cy += pt.y;
                            cz += pt.z;
                        }
                    }["GenerativeLab.useEffect.timer"]);
                    cx /= raw.length;
                    cy /= raw.length;
                    cz /= raw.length;
                    const pts = raw.map({
                        "GenerativeLab.useEffect.timer.pts": (pt)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]((pt.x - cx) * algo.scale, (pt.y - cy) * algo.scale, (pt.z - cz) * algo.scale)
                    }["GenerativeLab.useEffect.timer.pts"]);
                    const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StandardMaterial"]('m', scene);
                    const primaryStr = tokens ? tokens.palette.primary : '#00d4ff';
                    const secondaryStr = tokens ? tokens.palette.secondary : '#111111';
                    mat.diffuseColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(secondaryStr).scale(0.1);
                    mat.emissiveColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(primaryStr).scale(0.2);
                    mat.specularColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color3"].FromHexString(primaryStr);
                    const tubes = [];
                    // Increased chunk size for faster merging
                    for(let i = 0; i < pts.length; i += 200){
                        const chunk = pts.slice(i, Math.min(i + 202, pts.length));
                        if (chunk.length < 2) continue;
                        const tube = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBuilder"].CreateTube('t' + i, {
                            path: chunk,
                            radius: 0.05,
                            tessellation: 4,
                            cap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"].CAP_ALL
                        }, scene);
                        tubes.push(tube);
                    }
                    const merged = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"].MergeMeshes(tubes, true, true, undefined, false, true);
                    if (merged) {
                        merged.material = mat;
                        merged.name = 'Specimen_Core';
                        // Animation
                        const anim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Animation"]("rot", "rotation.y", 30, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Animation"].ANIMATIONTYPE_FLOAT, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Animation"].ANIMATIONLOOPMODE_CYCLE);
                        anim.setKeys([
                            {
                                frame: 0,
                                value: 0
                            },
                            {
                                frame: 360,
                                value: Math.PI * 2
                            }
                        ]);
                        merged.animations = [
                            anim
                        ];
                        scene.beginAnimation(merged, 0, 360, true);
                    }
                    setIsLoading(false);
                }
            }["GenerativeLab.useEffect.timer"], 50);
            return ({
                "GenerativeLab.useEffect": ()=>clearTimeout(timer)
            })["GenerativeLab.useEffect"];
        }
    }["GenerativeLab.useEffect"], [
        selectedAlgo
    ]);
    const handleExportSTL = ()=>{
        const scene = sceneRef.current;
        if (!scene) return;
        const mesh = scene.getMeshByName('Specimen_Core');
        if (!mesh) return;
        const positions = mesh.getVerticesData(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$babylonjs$40$8$2e$55$2e$1$2f$node_modules$2f$babylonjs$2f$babylon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VertexBuffer"].PositionKind);
        const indices = mesh.getIndices();
        if (!positions || !indices) return;
        const triangleCount = indices.length / 3;
        const bufferSize = 84 + triangleCount * 50;
        const buffer = new ArrayBuffer(bufferSize);
        const dv = new DataView(buffer);
        // 80-byte Header
        for(let i = 0; i < 80; i++)dv.setUint8(i, 0);
        // Triangle Count
        dv.setUint32(80, triangleCount, true);
        let offset = 84;
        for(let i = 0; i < indices.length; i += 3){
            dv.setFloat32(offset, 0, true);
            dv.setFloat32(offset + 4, 0, true);
            dv.setFloat32(offset + 8, 0, true);
            offset += 12;
            for(let v = 0; v < 3; v++){
                const index = indices[i + v] * 3;
                dv.setFloat32(offset, positions[index], true);
                dv.setFloat32(offset + 4, positions[index + 1], true);
                dv.setFloat32(offset + 8, positions[index + 2], true);
                offset += 12;
            }
            dv.setUint16(offset, 0, true);
            offset += 2;
        }
        const blob = new Blob([
            buffer
        ], {
            type: 'application/octet-stream'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `NeoProxy_${selectedAlgo}_specimen.stl`;
        link.click();
        URL.revokeObjectURL(url);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "lab-page main-content",
        "data-theme": "lab",
        style: {
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    background: 'rgba(5, 10, 20, 0.8)',
                    borderBottom: '1px solid var(--neo-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    zIndex: 100,
                    backdropFilter: 'blur(5px)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '12px',
                            letterSpacing: '2px',
                            color: 'var(--neo-primary)'
                        },
                        children: "NEOPROXY // R&D // GENERATIVE_LAB.v3"
                    }, void 0, false, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/npos",
                        style: {
                            color: 'var(--neo-primary)',
                            textDecoration: 'none',
                            fontSize: '10px',
                            border: '1px solid var(--neo-glow)',
                            padding: '2px 8px'
                        },
                        children: "EXIT_PROTOCOL"
                    }, void 0, false, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            isClient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '50px',
                            left: '10px',
                            right: '10px',
                            zIndex: 100,
                            background: 'rgba(5, 10, 20, 0.95)',
                            border: '1px solid #00d4ff22',
                            backdropFilter: 'blur(15px)',
                            borderRadius: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsPanelOpen(!isPanelOpen),
                                style: {
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#00d4ff',
                                    padding: '10px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontFamily: "'Space Mono', monospace"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "SELECT_ALGORITHM"
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                        lineNumber: 392,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: isPanelOpen ? '▼' : '▶'
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                        lineNumber: 393,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 376,
                                columnNumber: 15
                            }, this),
                            isPanelOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '0 10px 10px',
                                    borderTop: '1px solid #00d4ff22',
                                    marginTop: '5px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: '10px',
                                            maxHeight: '150px',
                                            overflowY: 'auto'
                                        },
                                        className: "custom-scroll",
                                        children: Object.keys(attractors).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setSelectedAlgo(key);
                                                    setIsPanelOpen(false); // Close after selection
                                                },
                                                style: {
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    background: selectedAlgo === key ? '#00d4ff22' : 'transparent',
                                                    border: 'none',
                                                    color: selectedAlgo === key ? '#00d4ff' : '#4a6080',
                                                    padding: '8px 10px',
                                                    marginBottom: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '10px',
                                                    transition: 'all 0.2s',
                                                    borderLeft: selectedAlgo === key ? '2px solid #00d4ff' : '2px solid transparent',
                                                    fontFamily: "'Space Mono', monospace"
                                                },
                                                children: attractors[key].name.toUpperCase()
                                            }, key, false, {
                                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                                lineNumber: 402,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                        lineNumber: 400,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '8px',
                                            background: '#00000044',
                                            fontSize: '8px',
                                            color: '#00d4ff88',
                                            whiteSpace: 'pre-wrap',
                                            marginBottom: '10px',
                                            maxHeight: '80px',
                                            overflow: 'auto'
                                        },
                                        children: attractors[selectedAlgo].equations
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                        lineNumber: 421,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleExportSTL,
                                        style: {
                                            width: '100%',
                                            background: '#00d4ff',
                                            color: '#020408',
                                            border: 'none',
                                            padding: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '9px',
                                            cursor: 'pointer',
                                            letterSpacing: '1px',
                                            boxShadow: '0 0 15px #00d4ff33',
                                            fontFamily: "'Space Mono', monospace"
                                        },
                                        children: "▲ EXPORT_SPECIMEN (.STL)"
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                        lineNumber: 435,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 398,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                                children: `
                .custom-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #00d4ff33 transparent;
                }
                .custom-scroll::-webkit-scrollbar { width: 2px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #00d4ff33; border-radius: 10px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #00d4ff66; }
              `
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 456,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 364,
                        columnNumber: 13
                    }, this) : /* Desktop Algorithm Panel - Always Visible */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '60px',
                            left: '20px',
                            width: '220px',
                            bottom: '20px',
                            zIndex: 100,
                            background: 'rgba(5, 10, 20, 0.85)',
                            border: '1px solid #00d4ff22',
                            padding: '15px',
                            backdropFilter: 'blur(15px)',
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    color: '#4a6080',
                                    marginBottom: '10px',
                                    flexShrink: 0
                                },
                                children: "SELECT_ALGORITHM"
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 483,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flexGrow: 1,
                                    overflowY: 'auto',
                                    marginBottom: '15px',
                                    paddingRight: '5px'
                                },
                                className: "custom-scroll",
                                children: Object.keys(attractors).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedAlgo(key),
                                        style: {
                                            display: 'block',
                                            width: '100%',
                                            textAlign: 'left',
                                            background: selectedAlgo === key ? '#00d4ff22' : 'transparent',
                                            border: 'none',
                                            color: selectedAlgo === key ? '#00d4ff' : '#4a6080',
                                            padding: '10px 12px',
                                            marginBottom: '4px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            transition: 'all 0.2s',
                                            borderLeft: selectedAlgo === key ? '2px solid #00d4ff' : '2px solid transparent'
                                        },
                                        children: attractors[key].name.toUpperCase()
                                    }, key, false, {
                                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                        lineNumber: 487,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 485,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: '#00000044',
                                    fontSize: '9px',
                                    color: '#00d4ff88',
                                    whiteSpace: 'pre-wrap',
                                    marginBottom: '15px',
                                    overflow: 'hidden'
                                },
                                children: attractors[selectedAlgo].equations
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 501,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleExportSTL,
                                style: {
                                    width: '100%',
                                    background: '#00d4ff',
                                    color: '#020408',
                                    border: 'none',
                                    padding: '12px',
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    letterSpacing: '1px',
                                    boxShadow: '0 0 15px #00d4ff33',
                                    flexShrink: 0
                                },
                                children: "▲ EXPORT_SPECIMEN (.STL)"
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 513,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                                children: `
                .custom-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #00d4ff33 transparent;
                }
                .custom-scroll::-webkit-scrollbar { width: 3px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #00d4ff33; border-radius: 10px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #00d4ff66; }
              `
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 532,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 469,
                        columnNumber: 13
                    }, this),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(2, 4, 8, 0.7)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 200,
                            color: 'var(--neo-primary)',
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '12px',
                            letterSpacing: '4px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: "GENERATING_MESH..."
                                }, void 0, false, {
                                    fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                    lineNumber: 562,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '10px',
                                        fontSize: '8px',
                                        opacity: 0.6
                                    },
                                    children: "// ATTRACTOR_DATA_PROCESSING"
                                }, void 0, false, {
                                    fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                    lineNumber: 563,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                            lineNumber: 561,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 547,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        style: {
                            width: '100%',
                            height: '100%',
                            outline: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 569,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            bottom: isMobile ? '10px' : '20px',
                            right: isMobile ? '10px' : '20px',
                            textAlign: 'right',
                            pointerEvents: 'none',
                            background: 'rgba(5, 10, 20, 0.8)',
                            padding: '8px 12px',
                            borderRadius: 'var(--neo-rounding)',
                            border: 'var(--neo-border-width) solid var(--neo-glow)',
                            backdropFilter: 'blur(var(--neo-blur))'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: isMobile ? '9px' : '10px',
                                    color: '#4a6080',
                                    marginBottom: '4px'
                                },
                                children: "SPECIMEN_STATUS"
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 594,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: isMobile ? '14px' : '18px',
                                    color: 'var(--neo-primary)',
                                    marginBottom: '4px',
                                    textShadow: '0 0 10px var(--neo-glow)'
                                },
                                children: "RESONANT_ACTIVE"
                            }, void 0, false, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 595,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: isMobile ? '8px' : '9px',
                                    color: '#4a6080',
                                    maxWidth: isMobile ? '150px' : 'auto',
                                    wordBreak: 'break-word'
                                },
                                children: [
                                    "ALGO: ",
                                    attractors[selectedAlgo].name.toUpperCase(),
                                    " // SEED: 0x42"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                                lineNumber: 596,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
                        lineNumber: 582,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/artifacts/neoproxy/src/app/npos/lab/page.tsx",
        lineNumber: 353,
        columnNumber: 5
    }, this);
}
_s(GenerativeLab, "J2pYW/W6vL7ITiaVnMOTKWUIv10=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$neoproxy$2f$src$2f$components$2f$npos$2f$AestheticProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAesthetics"]
    ];
});
_c = GenerativeLab;
var _c;
__turbopack_context__.k.register(_c, "GenerativeLab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=artifacts_neoproxy_src_app_npos_lab_page_tsx_6c1d5a32._.js.map