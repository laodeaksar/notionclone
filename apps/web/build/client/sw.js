/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-edf91e0a'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "icon-512.png",
    "revision": "51dd5f8f588d63ce641afd5da3915408"
  }, {
    "url": "icon-192.png",
    "revision": "81995a04e7903e6f7842ccc019deb598"
  }, {
    "url": "favicon.png",
    "revision": "0d13dab31b4fb05f0fb2222810071f6e"
  }, {
    "url": "_app/immutable/nodes/7.Du2TPhnT.js",
    "revision": "39d0fc6807e01f6bdc0e5f356d5c34db"
  }, {
    "url": "_app/immutable/nodes/6.BJ87NOqJ.js",
    "revision": "399d3d6d9ac8b7a10eb157fe4bfae215"
  }, {
    "url": "_app/immutable/nodes/5.CEMd9OZ9.js",
    "revision": "b0078b168bbf51a378e6720304c197fd"
  }, {
    "url": "_app/immutable/nodes/4.BFrRGoo-.js",
    "revision": "dc5035fcbd1c25f6463e6b524fbfb595"
  }, {
    "url": "_app/immutable/nodes/3.Brp8QZs4.js",
    "revision": "9fc6d3ae08363a8fb36052127d7703c5"
  }, {
    "url": "_app/immutable/nodes/2.CJZnjP0X.js",
    "revision": "8e4a3655108514b34435a84b923fbf6f"
  }, {
    "url": "_app/immutable/nodes/1.Dw6dEqYu.js",
    "revision": "8000939fe5bc9c35caee3dd3c616ff8e"
  }, {
    "url": "_app/immutable/nodes/0.CTi_B2Cz.js",
    "revision": "eaa7b7dbbd6699935e0ff9731c721e6e"
  }, {
    "url": "_app/immutable/entry/start.B90_0cwv.js",
    "revision": "b3a87bd98a37fc14ec647aea4aa8f980"
  }, {
    "url": "_app/immutable/entry/app.DRhFepzW.js",
    "revision": "1be63e6595e2069ff3968b70eddfc6ce"
  }, {
    "url": "_app/immutable/chunks/xihTtKlq.js",
    "revision": "7a4650a3c1de985a31ca3e0af5c4977d"
  }, {
    "url": "_app/immutable/chunks/kNaey6uv.js",
    "revision": "da61a49d6ce7b71eaef4e9e80e677709"
  }, {
    "url": "_app/immutable/chunks/ZqnwlrtH.js",
    "revision": "e4c71497d7dbcb126624fd5208c4c982"
  }, {
    "url": "_app/immutable/chunks/Dd0lzVuY.js",
    "revision": "b6fa8612c7dec3e2659c2a6f2bfd36e8"
  }, {
    "url": "_app/immutable/chunks/DOL-cyM-.js",
    "revision": "13bcf4fd0b230308fadfabba08a2d626"
  }, {
    "url": "_app/immutable/chunks/DKNvIY6X.js",
    "revision": "f385a2cf0c4ea35ffaf8da0bbe6e3c2e"
  }, {
    "url": "_app/immutable/chunks/D-ic2Vwa.js",
    "revision": "e2ff4e49b67b5e8e9e1580c769e727d0"
  }, {
    "url": "_app/immutable/chunks/CqjRz4PM.js",
    "revision": "fd9ae4bcab7802ecb25f082076a8e2ca"
  }, {
    "url": "_app/immutable/chunks/CkNR8D2O.js",
    "revision": "8a0f103a1af728f6e3444c09433a093c"
  }, {
    "url": "_app/immutable/chunks/Citc-pUH.js",
    "revision": "85c39e65a4dc6f536e3710f3eee3fd35"
  }, {
    "url": "_app/immutable/chunks/CSnZjfWO.js",
    "revision": "0889b9cb22ea603de992fa021dede430"
  }, {
    "url": "_app/immutable/chunks/CM-TpoA4.js",
    "revision": "581771fba5053e8790cd8dd403f5972a"
  }, {
    "url": "_app/immutable/chunks/BVD7tvKy.js",
    "revision": "386d185e2488e7a3b6834cf342aabc9a"
  }, {
    "url": "_app/immutable/chunks/BOx43okh.js",
    "revision": "90a4bca8a95862ab240ac38c30172d32"
  }, {
    "url": "_app/immutable/chunks/BBxpdsee.js",
    "revision": "9d9d93c25353db7ed702e5379c61086c"
  }, {
    "url": "_app/immutable/chunks/AowkN6Qv.js",
    "revision": "f71d4ef5976209af7d432c1584804b45"
  }, {
    "url": "_app/immutable/chunks/23Zaqi3w.js",
    "revision": "56ee5aa2f01894137119189ad0fa1377"
  }, {
    "url": "_app/immutable/assets/src.m5pMEzso.css",
    "revision": "0ec91e1aac9ed7c202578518adf6933a"
  }, {
    "url": "_app/immutable/assets/5.DYBzCQiw.css",
    "revision": "5fad389f8875f6303a441fa4ae5d1af9"
  }, {
    "url": "_app/immutable/assets/3.DPjYpT33.css",
    "revision": "c56dd0e42aeb84859dd51d68a967ffad"
  }, {
    "url": "_app/immutable/assets/0.tXtFLs9d.css",
    "revision": "9076078dae7124320e9c903d7b0bc64c"
  }, {
    "url": "icon-192.png",
    "revision": "81995a04e7903e6f7842ccc019deb598"
  }, {
    "url": "icon-512.png",
    "revision": "51dd5f8f588d63ce641afd5da3915408"
  }, {
    "url": "manifest.webmanifest",
    "revision": "c06391df6adff1793d3e1d8d57cd4822"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^\/api\/.*/i, new workbox.NetworkFirst({
    "cacheName": "api-cache",
    "networkTimeoutSeconds": 5,
    plugins: [new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    }), new workbox.ExpirationPlugin({
      maxEntries: 200,
      maxAgeSeconds: 86400
    })]
  }), 'GET');

}));
