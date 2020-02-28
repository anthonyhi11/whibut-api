const { expect } = require('chai');
const supertest = require('supertest');
process.env.JWT_SECRET = 'test-jwt-secret'

global.expect = expect 
global.supertest = supertest

