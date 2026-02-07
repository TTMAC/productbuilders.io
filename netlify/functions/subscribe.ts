import type { Handler, HandlerEvent } from '@netlify/functions';

const BUTTONDOWN_API_URL = 'https://api.buttondown.email/v1/subscribers';

/**
 * Newsletter signup handler
 * Per SRD - NEVER expose API key client-side, use serverless function proxy
 *
 * @param event - Netlify function event
 * @returns Response with status and message
 */
export const handler: Handler = async (event: HandlerEvent) => {
  // Read API key dynamically for better testability
  const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight CORS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { email, discipline } = JSON.parse(event.body || '{}');

    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email required' }),
      };
    }

    // Check if API key is configured
    if (!BUTTONDOWN_API_KEY) {
      console.error('BUTTONDOWN_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Newsletter service not configured' }),
      };
    }

    // Prepare request body for Buttondown API
    const requestBody: Record<string, any> = { email };

    // Add discipline as a tag if provided
    if (discipline) {
      requestBody.tags = [discipline];
    }

    // Subscribe to Buttondown
    const response = await fetch(BUTTONDOWN_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Handle duplicate subscription (409 Conflict)
    if (response.status === 409) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'You are already subscribed!'
        }),
      };
    }

    // Handle other Buttondown API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Buttondown API error:', errorData);

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Failed to subscribe. Please try again.'
        }),
      };
    }

    // Success
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Successfully subscribed! Check your email to confirm.'
      }),
    };
  } catch (error) {
    // Handle unexpected errors
    console.error('Newsletter signup error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
