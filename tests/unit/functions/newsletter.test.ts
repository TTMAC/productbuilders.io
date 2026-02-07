import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the handler - will be implemented in netlify/functions/subscribe.ts
describe('Newsletter Signup Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.BUTTONDOWN_API_KEY;
  });

  it('should_return_201_when_valid_email_submitted', async () => {
    // Set up environment
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 'test-id', email: 'test@example.com' }),
    });

    // Import handler dynamically after mocking
    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'test@example.com', discipline: 'PM' }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('message');
    expect(body.message).toContain('subscribed');
  });

  it('should_return_400_when_invalid_email', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'invalid-email' }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('error');
  });

  it('should_return_400_when_no_email_provided', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({}),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.error).toContain('email');
  });

  it('should_return_405_when_method_not_POST', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'GET',
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(405);
    const body = JSON.parse(result.body);
    expect(body.error).toContain('Method not allowed');
  });

  it('should_return_204_for_OPTIONS_request', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'OPTIONS',
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(204);
    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin');
  });

  it('should_return_500_when_api_key_not_configured', async () => {
    // No API key set

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toContain('not configured');
  });

  it('should_return_200_for_duplicate_subscription', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    // Mock 409 response from Buttondown
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'Subscriber already exists' }),
    });

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'existing@example.com' }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toContain('already subscribed');
  });

  it('should_handle_buttondown_api_error', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    // Mock error response from Buttondown
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' }),
    });

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('error');
  });

  it('should_include_cors_headers_in_response', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 'test-id' }),
    });

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    };

    const result = await handler(event);

    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin');
    expect(result.headers?.['Access-Control-Allow-Origin']).toBe('*');
  });

  it('should_send_discipline_as_tag_to_buttondown', async () => {
    process.env.BUTTONDOWN_API_KEY = 'test_api_key';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 'test-id' }),
    });

    global.fetch = mockFetch;

    const { handler } = await import('../../../netlify/functions/subscribe');

    const event: any = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'test@example.com', discipline: 'Engineering' }),
    };

    await handler(event);

    // Check that fetch was called with correct body
    expect(mockFetch).toHaveBeenCalled();
    const fetchCall = mockFetch.mock.calls[0];
    const fetchBody = JSON.parse(fetchCall[1].body);
    expect(fetchBody.tags).toContain('Engineering');
  });
});
