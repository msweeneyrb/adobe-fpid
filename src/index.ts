/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import { v4 as uuidv4 } from 'uuid';
import { parse } from 'cookie';

export default {
	async fetch(request): Promise<Response> {
		const url = new URL(request.url);
        const path = url.pathname;
        const extension = path.split('.').pop() || null;
		const acceptHeader = request.headers.get('Accept') || '';

        // Skip processing non-page or api requests
        if (!extension || path.startsWith('/api') || !acceptHeader.includes('text/html')) {
            return fetch(request);
        }

		const COOKIE_NAME = "FPID";
		const cookie = parse(request.headers.get("Cookie") || "");
		const cookieOptions = 'Secure; SameSite=Lax; Path=/; Max-Age=31536000;';
		let cookieValue;

		if (cookie[COOKIE_NAME] != null) {
			cookieValue = cookie[COOKIE_NAME];
		} else {
			cookieValue = uuidv4();
		}

		const originalResponse = await fetch(request);

		const response = new Response(originalResponse.body, originalResponse);

		response.headers.append('Set-Cookie', `${COOKIE_NAME}=${cookieValue}; ${cookieOptions}`);

		return response;
	}
}  satisfies ExportedHandler<Env>;;