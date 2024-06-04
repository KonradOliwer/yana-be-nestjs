import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GLOBAL_FILTERS, GLOBAL_PIPES } from '../src/common/global-extentions';
import { v4 as uuid } from 'uuid';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(...GLOBAL_FILTERS);
    app.useGlobalPipes(...GLOBAL_PIPES);
    await app.init();
  });

  describe('NotesModule', () => {
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer()).get('/notes');
      await Promise.all(
        uncleared.body.map(({ id }) => {
          return request(app.getHttpServer()).delete(`/notes/${id}`);
        }),
      );
    });

    it('get all, create, get all, modify, get all, delete, get all', async () => {
      const getResponse0 = await request(app.getHttpServer()).get('/notes');
      expect(getResponse0.body.length).toBe(0);

      const createResponse = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name',
          content: 'test content',
        })
        .expect(201);
      expect(createResponse.body.id).toBeDefined();
      expect(createResponse.body.name).toBe('test name');
      expect(createResponse.body.content).toBe('test content');

      const getResponse1 = await request(app.getHttpServer()).get('/notes');
      expect(getResponse1.body.length).toBe(1);
      expect(getResponse1.body[0].id).toBeDefined();
      expect(getResponse1.body[0].name).toBe('test name');
      expect(getResponse1.body[0].content).toBe('test content');

      const putResponse = await request(app.getHttpServer())
        .put('/notes/' + getResponse1.body[0].id)
        .send({
          id: getResponse1.body[0].id,
          name: 'changed name',
          content: 'changed content',
        })
        .expect(200);
      expect(putResponse.body.id).toBeDefined();
      expect(putResponse.body.name).toBe('changed name');
      expect(putResponse.body.content).toBe('changed content');

      const getResponse2 = await request(app.getHttpServer()).get('/notes');
      expect(getResponse2.body.length).toBe(1);
      expect(getResponse2.body[0].id).toBeDefined();
      expect(getResponse2.body[0].name).toBe('changed name');
      expect(getResponse2.body[0].content).toBe('changed content');

      const deleteResponse = await request(app.getHttpServer())
        .delete('/notes/' + getResponse1.body[0].id)
        .expect(204);
      expect(deleteResponse.body).toEqual({});

      const getResponse3 = await request(app.getHttpServer())
        .get('/notes')
        .expect(200);
      expect(getResponse3.body).toEqual([]);

      return getResponse3;
    });

    it('fail to add note with existing name', async () => {
      const createResponse1 = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name',
          content: 'test content1',
        })
        .expect(201);
      expect(createResponse1.body.id).toBeDefined();
      expect(createResponse1.body.name).toBe('test name');
      expect(createResponse1.body.content).toBe('test content1');

      const createResponse2 = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name',
          content: 'test content2',
        })
        .expect(400);
      expect(createResponse2.body.code).toBe('NOTE_ALREADY_EXISTS');
      expect(createResponse2.body.message).toBe(
        'Note with name test name already exists.',
      );
    });

    it('fail to update note to existing name', async () => {
      const createResponse1 = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name1',
          content: 'test content1',
        })
        .expect(201);
      expect(createResponse1.body.id).toBeDefined();
      expect(createResponse1.body.name).toBe('test name1');
      expect(createResponse1.body.content).toBe('test content1');

      const createResponse2 = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name2',
          content: 'test content2',
        })
        .expect(201);

      const updateRespone = await request(app.getHttpServer())
        .put('/notes/' + createResponse2.body.id)
        .send({
          id: createResponse2.body.id,
          name: 'test name1',
          content: 'test content2',
        })
        .expect(400);
      expect(updateRespone.body.code).toBe('NOTE_ALREADY_EXISTS');
      expect(updateRespone.body.message).toBe(
        'Note with name test name1 already exists.',
      );
    });

    it('fail to update not existing note', async () => {
      const id = uuid();
      const response = await request(app.getHttpServer())
        .put('/notes/' + id)
        .send({
          id: id,
          name: 'test name',
          content: 'test content',
        })
        .expect(404);
      expect(response.body.code).toBe('NOTE_NOT_FOUND');
      expect(response.body.message).toBe(`Note with id ${id} not found.`);
    });

    it('fail to create note with too long name', async () => {
      const response = await request(app.getHttpServer())
        .post('/notes/')
        .send({
          name: 'a'.repeat(51),
          content: 'test content',
        })
        .expect(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toBe(
        'name must be shorter than or equal to 50 characters',
      );
    });

    it('fail to update note with too long name', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name',
          content: 'test content',
        })
        .expect(201);

      const updateResponse = await request(app.getHttpServer())
        .put('/notes/' + createResponse.body.id)
        .send({
          id: createResponse.body.id,
          name: 'a'.repeat(51),
          content: 'test content',
        })
        .expect(400);
      expect(updateResponse.body.code).toBe('VALIDATION_ERROR');
      expect(updateResponse.body.message).toBe(
        'name must be shorter than or equal to 50 characters',
      );
    });

    it('fail to delete not existing note', async () => {
      const id = uuid();
      const response = await request(app.getHttpServer())
        .delete('/notes/' + id)
        .expect(404);
      expect(response.body.code).toBe('NOTE_NOT_FOUND');
      expect(response.body.message).toBe(`Note with id ${id} not found.`);
    });

    it('fail to update if ID not matching url', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/notes')
        .send({
          name: 'test name',
          content: 'test content',
        })
        .expect(201);

      const updateResponse = await request(app.getHttpServer())
        .put('/notes/' + uuid())
        .send({
          id: createResponse.body.id,
          name: 'test name',
          content: 'test content',
        })
        .expect(400);
      expect(updateResponse.body.code).toBe('VALIDATION_ERROR');
      expect(updateResponse.body.message).toBe('id: should match url id');
    });
  });
});
