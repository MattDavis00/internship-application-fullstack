"use strict";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle an incoming request.
 * Split the response randomly 50/50 between variant A and B.
 * @param {Request} request The request
 */
async function handleRequest(request) {

  let variants = await getVariants(); // Get variant URLs

  if (variants !== null) { // Variant array loaded correctly.

    // Fetch variant A or B page at a 50% chance each
    let random = Math.random();
    let URL = (random < 0.5 ? variants[0] : variants[1]);
    let response = await fetch(URL);

    if (response.status === 200) { // Variant fetch successful, return the random variant response.
      return response;
    } else { // Variant fetch failed, return error response.
      return new Response('Could not fetch variant page.', {
        headers: { 'content-type': 'text/plain' },
      });
    }

  } else { // Could not fetch variant array, return error response.
    return new Response('Could not fetch A/B variant URL list.', {
      headers: { 'content-type': 'text/plain' },
    });
  }
}

/**
 * Fetch the 2 URL variants from the API
 * @returns {Array} Returns an array of size 2 if successful, returns null if the request failed.
 */
async function getVariants() {
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');

  if (response.status === 200) { // Handle 200 OK status

    let data = await response.json();
    let variants = data.variants;
    return variants;

  } else { // Non 200 status, return null
    return null;
  }
  
}