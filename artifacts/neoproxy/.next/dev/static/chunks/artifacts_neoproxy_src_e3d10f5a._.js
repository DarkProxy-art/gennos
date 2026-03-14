(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/artifacts/neoproxy/src/lib/agents/aesthetic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AestheticAgent",
    ()=>AestheticAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chroma$2d$js$40$3$2e$2$2e$0$2f$node_modules$2f$chroma$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/chroma-js@3.2.0/node_modules/chroma-js/index.js [app-client] (ecmascript) <locals>");
;
// Brain.js simulation for style genome processing
class BrainSimulator {
    memory = new Map();
    constructor(){
        this.initializeMemory();
    }
    initializeMemory() {
        // Initialize with basic aesthetic patterns
        this.memory.set('cyberpunk', {
            palette: [
                '#00d4ff',
                '#020408',
                '#ff6b6b'
            ],
            mood: 'high-tech',
            intensity: 0.8
        });
        this.memory.set('minimal', {
            palette: [
                '#ffffff',
                '#000000',
                '#cccccc'
            ],
            mood: 'clean',
            intensity: 0.3
        });
    }
    predict(input) {
        // Simple pattern matching based on input
        const patterns = Array.from(this.memory.keys());
        const match = patterns.find((pattern)=>input && typeof input === 'string' && input.toLowerCase().includes(pattern.toLowerCase()));
        return this.memory.get(match || '') || {
            palette: [
                '#00d4ff',
                '#020408'
            ],
            mood: 'unknown',
            intensity: 0.5
        };
    }
    learn(input, output) {
        // Store learning patterns
        const key = `pattern_${Date.now()}`;
        this.memory.set(key, {
            input,
            output,
            timestamp: Date.now()
        });
    }
}
const brain = new BrainSimulator();
/**
 * Foundational Style Frames
 */ const STYLE_FRAMES = {
    cyberpunk: {
        palette: {
            primary: '#00ffff',
            secondary: '#ff0066',
            background: '#050505',
            accent: '#7b2fff'
        },
        lighting: {
            intensity: 1.0,
            glow: 'rgba(0, 255, 255, 0.4)'
        },
        material: {
            blur: '10px',
            opacity: 0.7
        },
        geometry: {
            rounding: '0px',
            borderWidth: '1px'
        }
    },
    minimal: {
        palette: {
            primary: '#ffffff',
            secondary: '#333333',
            background: '#000000',
            accent: '#00ff9d'
        },
        lighting: {
            intensity: 0.5,
            glow: 'rgba(255, 255, 255, 0.1)'
        },
        material: {
            blur: '0px',
            opacity: 1.0
        },
        geometry: {
            rounding: '2px',
            borderWidth: '1px'
        }
    },
    neural: {
        palette: {
            primary: '#00ff9d',
            secondary: '#00d4ff',
            background: '#020408',
            accent: '#ff3cac'
        },
        lighting: {
            intensity: 0.8,
            glow: 'rgba(0, 255, 157, 0.3)'
        },
        material: {
            blur: '15px',
            opacity: 0.6
        },
        geometry: {
            rounding: '12px',
            borderWidth: '0px'
        }
    }
};
const AestheticAgent = {
    net: {
        train: (data)=>{
            console.log('Training aesthetic agent with data:', data);
        },
        run: (input)=>{
            return brain.predict(input);
        }
    },
    train: ()=>{
        const trainingData = [
            {
                input: {
                    entropy: 0.1,
                    health: 1.0
                },
                output: {
                    minimal: 1
                }
            },
            {
                input: {
                    entropy: 0.4,
                    health: 0.9
                },
                output: {
                    neural: 1
                }
            },
            {
                input: {
                    entropy: 0.9,
                    health: 0.4
                },
                output: {
                    cyberpunk: 1
                }
            }
        ];
        AestheticAgent.net.train(trainingData);
    },
    /**
   * Generates a unique Style Genome based on AI prediction and stochastic mutation.
   */ generateGenome: async (entropy, health)=>{
        AestheticAgent.train();
        const prediction = AestheticAgent.net.run({
            entropy,
            health
        });
        // Select dominant frame
        const frameKey = Object.keys(prediction).reduce((a, b)=>prediction[a] > prediction[b] ? a : b);
        const baseGenome = {
            ...STYLE_FRAMES[frameKey]
        };
        // Apply Mutation Rules (The 35% Stability Law)
        const mutationFactor = entropy * 0.35; // Max 35% change
        // Mutate Primary Color (chroma-js rotation)
        const primaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chroma$2d$js$40$3$2e$2$2e$0$2f$node_modules$2f$chroma$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(baseGenome.palette.primary);
        const hslColor = primaryColor.get('hsl');
        const mutatedHSL = {
            h: hslColor[0] + mutationFactor * 100,
            s: hslColor[1] + mutationFactor * 2,
            l: hslColor[2]
        };
        const mutedPrimary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chroma$2d$js$40$3$2e$2$2e$0$2f$node_modules$2f$chroma$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(mutatedHSL).hex();
        // Get complementary color
        const complementaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$chroma$2d$js$40$3$2e$2$2e$0$2f$node_modules$2f$chroma$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(mutedPrimary).set('hsl.h', (hslColor[0] + 180) % 360).hex();
        return {
            ...baseGenome,
            palette: {
                ...baseGenome.palette,
                primary: mutedPrimary,
                accent: complementaryColor
            },
            lighting: {
                ...baseGenome.lighting,
                intensity: baseGenome.lighting.intensity * (1 + (entropy - 0.5) * 0.2)
            }
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/artifacts/neoproxy/src/components/npos/AestheticProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AestheticProvider",
    ()=>AestheticProvider,
    "useAesthetics",
    ()=>useAesthetics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$neoproxy$2f$src$2f$lib$2f$agents$2f$aesthetic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/neoproxy/src/lib/agents/aesthetic.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AestheticContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AestheticProvider({ children }) {
    _s();
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const updateAesthetics = async (entropy, health)=>{
        const genome = await __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$neoproxy$2f$src$2f$lib$2f$agents$2f$aesthetic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AestheticAgent"].generateGenome(entropy, health);
        setTokens(genome);
        // Apply to CSS variables
        const root = document.documentElement;
        root.style.setProperty('--neo-primary', genome.palette.primary);
        root.style.setProperty('--neo-secondary', genome.palette.secondary);
        root.style.setProperty('--neo-background', genome.palette.background);
        root.style.setProperty('--neo-accent', genome.palette.accent);
        root.style.setProperty('--neo-glow', genome.lighting.glow);
        root.style.setProperty('--neo-intensity', genome.lighting.intensity.toString());
        root.style.setProperty('--neo-blur', genome.material.blur);
        root.style.setProperty('--neo-opacity', genome.material.opacity.toString());
        root.style.setProperty('--neo-rounding', genome.geometry.rounding);
        root.style.setProperty('--neo-border-width', genome.geometry.borderWidth);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AestheticProvider.useEffect": ()=>{
            // Initial call with baseline
            updateAesthetics(0.1, 1.0);
            // Poll for changes (simulating system awareness)
            const interval = setInterval({
                "AestheticProvider.useEffect.interval": ()=>{
                    // In a real scenario, this would fetch real entropy from Oracle
                    const mockEntropy = Math.random();
                    const mockHealth = 0.5 + Math.random() * 0.5;
                    updateAesthetics(mockEntropy, mockHealth);
                }
            }["AestheticProvider.useEffect.interval"], 30000); // Pulse every 30s
            return ({
                "AestheticProvider.useEffect": ()=>clearInterval(interval)
            })["AestheticProvider.useEffect"];
        }
    }["AestheticProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AestheticContext.Provider, {
        value: {
            tokens,
            updateAesthetics
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/artifacts/neoproxy/src/components/npos/AestheticProvider.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(AestheticProvider, "VTg6ifHKJppMN8jRpIb1lIs7Ce4=");
_c = AestheticProvider;
const useAesthetics = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AestheticContext);
    if (!context) throw new Error('useAesthetics must be used within AestheticProvider');
    return context;
};
_s1(useAesthetics, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AestheticProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=artifacts_neoproxy_src_e3d10f5a._.js.map