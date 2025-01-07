import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  http.post('/api/register', () => {
    return HttpResponse.json({
      message: 'User registered',
    });
  }),
  http.post('/api/login', () => {
    return HttpResponse.json({
      token: 'fake_token',
    });
  })
);
