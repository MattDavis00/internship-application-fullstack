"use strict";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle an incoming request.
 * Split the response 50/50 between variant A and B.
 * @param {Request} request The request
 */
async function handleRequest(request) {
  let response = new Response('Fatal error, no response generated.', {
    headers: { 'content-type': 'text/plain' },
  });

  let variants = await getVariants();

  if (variants !== null) {
    let random = Math.random();
    let URL = (random < 0.5 ? variants[0] : variants[1]);
    response = await fetch(URL);
  }

  return response;
}

/**
 * Fetch the variant URLs
 */
async function getVariants() {
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');

  if (response.status === 200) { // Handle OK status
    console.log("Got OK 200 response");

    let data = await response.json();
    let variants = data.variants;
    console.log(variants);
    return variants;

  } else { // Handle non 200 OK status
    console.log('Error collecting variants, status code' + response.status);
    return null;
  }
  
}