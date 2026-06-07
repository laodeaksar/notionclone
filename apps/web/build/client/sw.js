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
    "url": "_app/immutable/nodes/7.Drl2UM9S.js",
    "revision": "54a8095a9e19541046563afacb9d20a7"
  }, {
    "url": "_app/immutable/nodes/6.4kX7ywtR.js",
    "revision": "191ce2761a0cff571ebad3cfb079a79c"
  }, {
    "url": "_app/immutable/nodes/5.DQj81bTy.js",
    "revision": "70ca3f60b9985a32d401c82dd7e8667f"
  }, {
    "url": "_app/immutable/nodes/4.BqQ14dB4.js",
    "revision": "6c5cc2d0bf1fb21f40afc2f94a3f4667"
  }, {
    "url": "_app/immutable/nodes/3.q8Q6rVH7.js",
    "revision": "10e042308a8e0487a590502bbce61241"
  }, {
    "url": "_app/immutable/nodes/2.Dr82TTpm.js",
    "revision": "fe64c66c41dd6ddef326cda53f3b1194"
  }, {
    "url": "_app/immutable/nodes/1.D0JKQrUu.js",
    "revision": "b9a966acc8a27dcaf5ba0be459191a37"
  }, {
    "url": "_app/immutable/nodes/0.CTi_B2Cz.js",
    "revision": "eaa7b7dbbd6699935e0ff9731c721e6e"
  }, {
    "url": "_app/immutable/entry/start.ljIZFQOT.js",
    "revision": "ef6f9ef900a1c4b05695b4df2162e6aa"
  }, {
    "url": "_app/immutable/entry/app.CddeQNXV.js",
    "revision": "c373992ed4ddd0b0e6c147fe92e26f2a"
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
    "url": "_app/immutable/chunks/FYOwbzeX.js",
    "revision": "65b78137e827bcec420dfc09bcb80b49"
  }, {
    "url": "_app/immutable/chunks/Dd0lzVuY.js",
    "revision": "b6fa8612c7dec3e2659c2a6f2bfd36e8"
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
    "url": "_app/immutable/chunks/CSnZjfWO.js",
    "revision": "0889b9cb22ea603de992fa021dede430"
  }, {
    "url": "_app/immutable/chunks/CPZfkC7k.js",
    "revision": "357faebe3a400b9f8c7c8bd1d1f32fd4"
  }, {
    "url": "_app/immutable/chunks/Bp2wUQ_c.js",
    "revision": "997f7a2c978890908eb0276b452d301e"
  }, {
    "url": "_app/immutable/chunks/BOx43okh.js",
    "revision": "90a4bca8a95862ab240ac38c30172d32"
  }, {
    "url": "_app/immutable/chunks/BA-joozJ.js",
    "revision": "c4fe5ce9c4e62feb6952544c6fa6f01a"
  }, {
    "url": "_app/immutable/chunks/B0u1QsjN.js",
    "revision": "140ae531f66e15588a22f09d9a09a48b"
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
