1:"$Sreact.fragment"
2:I[27684,["/_next/static/chunks/1ba821bf9e6f2de5.js","/_next/static/chunks/62eb0f71c4bc6756.js"],"AestheticProvider"]
4:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
5:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
3:T58b,
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400&family=Syne:wght@400;700;800&display=swap');

        .npos-root {
          background: var(--neo-bg);
          color: var(--neo-text);
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          line-height: 1.7;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          transition: background 1s ease, color 0.5s ease;
        }

        .npos-root * { box-sizing: border-box; }

        .npos-noise {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
          opacity: 0.35;
        }

        .npos-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }
      0:{"buildId":"83pFb9EqFGJp_1-Knr8oT","rsc":["$","$1","c",{"children":[[["$","script","script-0",{"src":"/_next/static/chunks/62eb0f71c4bc6756.js","async":true}]],["$","$L2",null,{"children":[["$","style",null,{"children":"$3"}],["$","div",null,{"className":"npos-root","children":[["$","div",null,{"className":"npos-noise"}],["$","div",null,{"className":"npos-grid"}],["$","$L4",null,{"parallelRouterKey":"children","template":["$","$L5",null,{}]}]]}]]}]]}],"loading":null,"isPartial":false}
