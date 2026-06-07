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
    "url": "_app/immutable/nodes/7.esRsB25k.js",
    "revision": "9b94d376b688f406a14d0d07abd46437"
  }, {
    "url": "_app/immutable/nodes/6.DakRNAmO.js",
    "revision": "dd060ce5eb7f60e6e2808255494df948"
  }, {
    "url": "_app/immutable/nodes/5.CL_nNlI1.js",
    "revision": "951aa0ef37ecda1a8f6a42c5bca678d9"
  }, {
    "url": "_app/immutable/nodes/4.BMRDXpjZ.js",
    "revision": "6051c430d06c98910e0160f3a6fa9285"
  }, {
    "url": "_app/immutable/nodes/3.DnCTMGut.js",
    "revision": "5db86750f2520ed7a320a107f4edbe1d"
  }, {
    "url": "_app/immutable/nodes/2.D3mS5C54.js",
    "revision": "d695683231eb23e8956d8955533205c9"
  }, {
    "url": "_app/immutable/nodes/1.D48SQNGj.js",
    "revision": "b0722a50e3733aebcadf77696d72951b"
  }, {
    "url": "_app/immutable/nodes/0.CTi_B2Cz.js",
    "revision": "eaa7b7dbbd6699935e0ff9731c721e6e"
  }, {
    "url": "_app/immutable/entry/start.BiaKNZDh.js",
    "revision": "3c8fb9d8a95e6a73a5bc1c7d236a3649"
  }, {
    "url": "_app/immutable/entry/app.07GVZeq5.js",
    "revision": "a513a2aa5f9fbd62edf557b9f06cc161"
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
    "url": "_app/immutable/chunks/CRs-mKH5.js",
    "revision": "259401bf4a6ac30be1a16d8dacf7bfa1"
  }, {
    "url": "_app/immutable/chunks/CC3Du7S5.js",
    "revision": "c227eea6719dcfd017a57094cfc99975"
  }, {
    "url": "_app/immutable/chunks/Bp2wUQ_c.js",
    "revision": "997f7a2c978890908eb0276b452d301e"
  }, {
    "url": "_app/immutable/chunks/BOx43okh.js",
    "revision": "90a4bca8a95862ab240ac38c30172d32"
  }, {
    "url": "_app/immutable/chunks/BCMRl2n2.js",
    "revision": "e03f9096bafa9b6768fff09745b84986"
  }, {
    "url": "_app/immutable/chunks/B4DdeP_I.js",
    "revision": "2d58aea6293fafa6fec4a4fd899e4d38"
  }, {
    "url": "_app/immutable/chunks/AowkN6Qv.js",
    "revision": "f71d4ef5976209af7d432c1584804b45"
  }, {
    "url": "_app/immutable/chunks/7de_Yw8c.js",
    "revision": "022b120f0378766e609862a39f74387d"
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
