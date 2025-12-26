### Simple WASM Yaneuraou engine console.

This HTML console uses WebAssembly version of Yaneuraou.  
Its a simple proof of concept mock program to exercise the USI communication protocol of Yaneuraou Shogi engine on browser and ensure its functionality with HTML and JavaScript.

Operation of this source code was confirmed with halfkp.noeval version of YaneuraOu engine (various version 8.* and 7.6.3) with 
separately prepared Suisho5 Evaluation function binary as nn.bin,  and
yaneuraou Standard book(2017) as standard_book.db 


### WASM executable is not included in YaneuraOu release packages.  Version 7.6.3 version is available from Mizar/Yaneuraou repo.
https://github.com/mizar/YaneuraOu/releases/tag/v7.6.3  

### In theory, you should be able to compile from the source https://github.com/yaneurao/YaneuraOu with the following setup.
#### Note that WASM component for Version 9.x '_usi_command' export is currently turned off and not functional,so the compilation will fail.

- Clone the source 
- Docker installed in your PC
- just run .\script\build-wasm.cmd
- to limit the compile target to halfkp.noeval, add 'halfkp.noeval' parameter in the last line of build-wasm.cmd. i.e.,
<pre><code>
docker run --rm -v %CD%:/src emscripten/emsdk:3.1.43 node script/wasm_build.js halfkpi.noeval
</code></pre>
- This will compile the tournament version of Yaneuraou
- If normal version is desired, search wasm_build.js  for word 'tournament' and replace it with 'normal'
<pre><code>
     `make -j${cpus} clean tournament COMPILER=em++ TARGET_CPU=WASM YANEURAOU_EDITION=${pkgobj.edition} TARGET=../${builddirlib}yaneuraou.${pkgobj.name}.js EM_EXPORT_NAME=${pkgobj.exportname} ${pkgobj.extra}`,
//change to 
    `make -j${cpus} clean normal COMPILER=em++ TARGET_CPU=WASM YANEURAOU_EDITION=${pkgobj.edition} TARGET=../${builddirlib}yaneuraou.${pkgobj.name}.js EM_EXPORT_NAME=${pkgobj.exportname} ${pkgobj.extra}`,
 
</code></pre>

### The WASN package includes javascript file that you can execute with node.js 
In another word, included top level (usi.halfkp.noeval.js/ts) js file is meant for running the code locally in your PC. 
But why bother with this as you will get native binary for your machine anyway.

The code in this repo will allow you to host this WASM files on a server so that remote browser will load them and run it inside the browser.

Just place files as below

<pre><code>
/lib/yaneuraou.halfkp.noeval.js (and .br, .gz files)
/lib/yaneuraou.halfkp.noeval.wasm (and .br ,.gz files)
/eval/nn.bin
/book/standard_book.db
</code></pre>


For testing it out, run <code>npx serve</code>.  The web site can be viewed at http://localhost:3000

Note two additional http headers in serve.json.  If served from NGINX or Apache server, you need to set these headers. 

Concept recap (why these headers matter)
To use SharedArrayBuffer on the open web, the page must be cross‑origin isolated, which means:

- Cross-Origin-Opener-Policy: same-origin

- Cross-Origin-Embedder-Policy: require-corp or credentialless

Once those are sent on your HTML + worker responses, SAB and high‑precision timers are unlocked in modern browsers.

You also want:

Correct Content-Type: application/wasm for .wasm

Compression (prefer .br, fallback .gz) for .wasm, nn.bin, book.db, etc.

Cross-Origin-Resource-Policy / CORS sane where needed.




