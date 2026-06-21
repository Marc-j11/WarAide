const path = require('path');
const os = require('os');
const fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = path.join(os.tmpdir(), `waraide-api-${process.pid}.db`);

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { closeDb } = require('../../src/db/connection');
const { runMigrations } = require('../../src/db/migrate');
const { runSeed } = require('../../src/db/seed');
const createApp = require('../../src/app');

let app;

before(() => {
  if (fs.existsSync(process.env.DATABASE_PATH)) {
    fs.unlinkSync(process.env.DATABASE_PATH);
  }
  closeDb();
  runMigrations();
  runSeed();
  app = createApp();
});

after(() => {
  closeDb();
  if (fs.existsSync(process.env.DATABASE_PATH)) {
    fs.unlinkSync(process.env.DATABASE_PATH);
  }
});

test('GET /health', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('GET /gares — liste et recherche', async () => {
  const list = await request(app).get('/gares');
  assert.equal(list.status, 200);
  assert.ok(list.body.data.length >= 11);

  const search = await request(app).get('/gares?nom=Petro');
  assert.equal(search.status, 200);
  assert.ok(search.body.data.some((g) => g.nom.includes('Petro')));
});

test('GET /liaisons', async () => {
  const res = await request(app).get('/liaisons');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.length >= 29);
});

test('POST /itineraire — temps', async () => {
  const res = await request(app)
    .post('/itineraire')
    .send({ departId: 1, arriveeId: 11, critere: 'temps' });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.depart.nom, 'Gare 9 Kilo');
  assert.equal(res.body.data.arrivee.nom, 'BEM Abidjan');
  assert.ok(res.body.data.etapes.length >= 1);
  assert.ok(res.body.data.tempsTotal > 0);
});

test('POST /itineraire — prix', async () => {
  const res = await request(app)
    .post('/itineraire')
    .send({ departId: 9, arriveeId: 8, critere: 'prix' });

  assert.equal(res.status, 200);
  assert.ok(res.body.data.prixTotal > 0);
});

test('POST /gares — créer un établissement', async () => {
  const res = await request(app)
    .post('/gares')
    .send({
      nom: 'Test Université Integration',
      type: 'ecole',
      categorie: 'destination:Cocody',
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.nom, 'Test Université Integration');

  const del = await request(app).delete(`/gares/${res.body.data.id}`);
  assert.equal(del.status, 204);
});

test('POST /itineraire — validation erreur 400', async () => {
  const res = await request(app).post('/itineraire').send({});
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
});

test('GET /gares/:id — 404', async () => {
  const res = await request(app).get('/gares/99999');
  assert.equal(res.status, 404);
});

test('POST /auth/register + login + me', async () => {
  const email = `test-${Date.now()}@waraide.ci`;

  const register = await request(app)
    .post('/auth/register')
    .send({ name: 'Aya Konan', email, password: 'secret123' });

  assert.equal(register.status, 201);
  assert.equal(register.body.data.user.prenom, 'Aya');
  assert.ok(register.body.data.token);

  const login = await request(app)
    .post('/auth/login')
    .send({ email, password: 'secret123' });

  assert.equal(login.status, 200);
  assert.equal(login.body.data.user.email, email);

  const me = await request(app)
    .get('/auth/me')
    .set('Authorization', `Bearer ${login.body.data.token}`);

  assert.equal(me.status, 200);
  assert.equal(me.body.data.prenom, 'Aya');
});

test('POST /auth/login — mauvais mot de passe', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'inconnu@waraide.ci', password: 'wrong' });

  assert.equal(res.status, 401);
});

test('GET /gares/proches — tri par distance', async () => {
  const res = await request(app).get('/gares/proches').query({
    lat: 5.36,
    lng: -3.96,
    limit: 3,
  });

  assert.equal(res.status, 200);
  assert.ok(res.body.data.length <= 3);
  assert.ok(res.body.data[0].distance >= 0);
  if (res.body.data.length >= 2) {
    assert.ok(res.body.data[0].distance <= res.body.data[1].distance);
  }
});
