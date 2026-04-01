import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';

const feature = loadFeature(path.join(__dirname, '../features/registration.feature'));

defineFeature(feature, (test) => {})