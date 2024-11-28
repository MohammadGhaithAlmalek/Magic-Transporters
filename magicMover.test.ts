import request from 'supertest';
import {app} from './src/server'; // or '../src/app'


describe('Magic Mover API', () => {
  it('should create a new Magic Mover', async () => {
    const newMover = {
      max_weight: 1000,
      status: 'Resting',  // MagicMoverStatus.RESTING
    };

    const response = await request(app)
      .post('/api/magic-movers')
      .send(newMover);

    expect(response.status).toBe(201); // 201 Created
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Magic Mover created successfully');
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.max_weight).toBe(newMover.max_weight);
  });

  it('should return all Magic Movers', async () => {
    const response = await request(app)
      .get('/api/magic-movers')
      .send();

    expect(response.status).toBe(200); // 200 OK
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeInstanceOf(Array);  // Should be an array
  });

});
