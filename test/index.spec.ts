// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getCookie } from '../src/index';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Adobe FPID', () => {
	it('should have the FPID cookie in the response header', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		const cookieHeader = response.headers.get('Set-Cookie');
		expect(cookieHeader).toContain('FPID=');
	  });
});

describe('getCookie', () => {
	it('should return the cookie value if it exists', () => {
	  const cookies = 'FPID=existing-cookie;';
	  const name = 'FPID';

	  const result = getCookie(cookies, name);

	  expect(result).toBe('existing-cookie');
	});

	it('should return null if the cookie does not exist', () => {
	  const cookies = '';
	  const name = 'FPID';

	  const result = getCookie(cookies, name);

	  expect(result).toBe(null);
	});
  });